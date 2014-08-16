var urlstring=(location.href);
if ((urlstring.indexOf("sskb.ssops.org") != -1) || (urlstring.indexOf("ultraworld.eu") != -1) || (urlstring.indexOf("coolpage.biz") != -1) || (urlstring.indexOf("shracardo.szm.com") != -1)) {
 alert('ACHTUNG! DIES IST NICHT RICARDO.CH! Bitte loeschen Sie die erhaltene Mail und schliessen Sie diese Seite.');
 alert('ATTENTION! CECI N EST PAS RICARDO.CH! MERCI DE FERMER CE SITE.');
}

function getCookieVal(offset) {
	var endstr=document.cookie.indexOf (";", offset);
	if (endstr==-1)
	    endstr = document.cookie.length;
	try { return decodeURIComponent(document.cookie.substring(offset, endstr)); }
	catch (ex) { return unescape(document.cookie.substring(offset, endstr)); }
	
}

function GetCookie (name) {
	var arg=name+"=";
	var alen=arg.length;
	var clen=document.cookie.length;
	var i=0;
	while (i<clen) {
		var j=i+alen;
		if (document.cookie.substring(i, j)==arg)
			return getCookieVal (j);
        i = document.cookie.indexOf(" ",i)+1;
		if (i==0) break;
	}
	return null;
}

function GetCookieExpiration (name) {
	var arg=name+"=";
	var alen=arg.length;
	var clen=document.cookie.length;
	var i=0;
	while (i<clen) {
		var j=i+alen;
		if (document.cookie.substring(i, j)==arg)
		{
			// On trouve la ligne du cookie concerné
			// j est le point de départ de la ligne
			var beginExpire = document.cookie.indexOf("expires=", j);

			if (beginExpire != -1) // trouvé !
			{
				beginExpire += 8; // longueur de "expires="
				var endExpire = document.cookie.indexOf(";", j);
				if (endExpire == -1)
				  		endExpire=document.cookie.length;
				try { return decodeURIComponent(document.cookie.substring(beginExpire, endExpire)); }
				catch (ex) { return unescape(document.cookie.substring(beginExpire, endExpire)); }
			}
			else
				return null;
			
		}
        i = document.cookie.indexOf(" ",i)+1;
		if (i==0) break;
	}
	return null;
}

function SetCookie (name, value) {
	
	// Paramètres du cookie :
	//	- name : le nom de la variable stockée
	//  - value : sa valeur
	//  - (optionel) NbMinutes : le nombre de minutes de validité
	
	var argv = SetCookie.arguments;
	var argc = SetCookie.arguments.length;
	var NbMinutesExpire = (argc > 2) ? argv[2] : null;
	var domain = (argc > 3) ? argv[3] : null;

	var ExpirationDate = null;

	if (NbMinutesExpire != null)
	{
		// un paramètre de temps a été rentré !
		// on calcule la date d'expiration relative
		ExpirationDate = new Date();
		ExpirationDate.setTime(ExpirationDate.getTime()+(NbMinutesExpire*60*1000));
	}

	//alert('ExpirationDate ? : ' + ExpirationDate.toGMTString());

	// we define that a cookie is readable on the whole site by setting the path to '/'
	document.cookie = name + "=" + encodeURIComponent(value) +
	((ExpirationDate == null) ? "" : ("; expires=" + ExpirationDate.toGMTString())) + "; path=/ ;" +
	((domain == null) ? "" : ("; domain=" + domain));	
}

function SetCookieLog (name, value, expires, domain) {
// un cookie a besoin d'un nom, d'une valeur, d'une date d'expiration
// 
	var argv=SetCookieLog.arguments;
	var argc=SetCookieLog.arguments.length;
	var path="/";
	//var domain=(argc > 4) ? argv[4] : null;
	var secure=(argc > 5) ? argv[5] : false;
	
	var ExpirationDate = null;
	ExpirationDate = new Date();
	ExpirationDate.setTime(ExpirationDate.getTime() + (expires*60*1000));
	//alert('ExpirationDate ? : ' + ExpirationDate.toGMTString() );
	document.cookie=name+"="+encodeURIComponent(value)+
		((expires==null) ? "" : ("; expires="+ExpirationDate.toGMTString()))+
		((path==null) ? "" : ("; path="+path))+
		((domain==null) ? "" : ("; domain="+domain))+
		((secure==true) ? "; secure" : "");
}