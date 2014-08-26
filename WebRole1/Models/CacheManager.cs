using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StackExchange.Redis;
using System.Threading.Tasks;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;

namespace WebRole1.Models
{
    public class CacheManager
    {
        private static ConnectionMultiplexer connection;

        static CacheManager()
        {            
            if (connection == null)
            {
                connection = ConnectionMultiplexer.Connect(
                                @"signalrandredispoc.redis.cache.windows.net,password=y2K80dd//9d1bgmu+qQfj2JGq+9qOtR8vj/Q1pMn1gE=,allowAdmin=true");

            }      
        }
        
        // Defaults to 1 hour expiration date
        public static bool Set(string key, object value)
        {
            var timeSpan = new TimeSpan(1, 0, 0);
            return Set(key, value, timeSpan);
        }

        public static bool Set(string key, object value, TimeSpan expirationDate)
        {
            var cached = false;
            if (value != null)
            {
                var redis = connection.GetDatabase();
                var serializedValue = Serialize(value);
                redis.StringSet(key, serializedValue, expirationDate);                
                cached = true;
            }
            return cached;
        }

        public static T Get<T>(string key)
        {
            var redis = connection.GetDatabase();
            var serializedValue = redis.StringGet(key);
            return Deserialize<T>(serializedValue);
        }

        public static void PurgeContent()
        {
            var endpoints = connection.GetEndPoints(true);
            foreach (var endpoint in endpoints)
            {
                var server = connection.GetServer(endpoint);
                server.FlushDatabase();
            }
        }

        #region Utilities

        private static byte[] Serialize(object o)
        {
            if (o == null)
            {
                return null;
            }

            BinaryFormatter binaryFormatter = new BinaryFormatter();
            using (MemoryStream memoryStream = new MemoryStream())
            {
                binaryFormatter.Serialize(memoryStream, o);
                byte[] objectDataAsStream = memoryStream.ToArray();
                return objectDataAsStream;
            }
        }

        private static T Deserialize<T>(byte[] stream)
        {
            if (stream == null)
            {
                return default(T);
            }

            BinaryFormatter binaryFormatter = new BinaryFormatter();
            using (MemoryStream memoryStream = new MemoryStream(stream))
            {
                T result = (T)binaryFormatter.Deserialize(memoryStream);
                return result;
            }
        }

        #endregion
    }
}
