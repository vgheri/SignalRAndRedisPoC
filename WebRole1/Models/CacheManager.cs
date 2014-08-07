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

        public static ConnectionMultiplexer Connection
        {
            get
            {
                if (connection == null)
                {
                    connection = ConnectionMultiplexer.Connect(
                                    @"signalrandredispoc.redis.cache.windows.net,password=ourpassword");

                }
                return connection;
            }
            private set { }
        }

        public static bool Set(string key, object value)
        {
            var cached = false;
            if (value != null)
            {
                var redis = Connection.GetDatabase();
                var serializedValue = Serialize(value);
                redis.StringSet(key, serializedValue);
                cached = true;
            }
            return cached;
        }

        public static T Get<T>(string key)
        {
            var redis = Connection.GetDatabase();
            var serializedValue = redis.StringGet(key);
            return Deserialize<T>(serializedValue);
        }

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
    }
}
