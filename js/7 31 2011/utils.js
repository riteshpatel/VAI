function LoggedIn(){
	var localToken = Ext.util.Cookies.get("sessionToken");	
    xmlHttpReq = new XMLHttpRequest();
	xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/SecurityManager.asmx",true);
	xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
	xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/SecurityManager/DIG Session Validation");
	xmlHttpReq.onreadystatechange=isLoggedIn;
	var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
						"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'"+
						" xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
						"<soap:Body>"+
						"<DIG_x0020_Session_x0020_Validation xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/SecurityManager'>"+
						"<sessionToken>"+ localToken +"</sessionToken>"+						
						"</DIG_x0020_Session_x0020_Validation>"+
						" </soap:Body>"+
						"</soap:Envelope>";
	xmlHttpReq.send(soapRequest);
	return false;
}

function isLoggedIn(){	
	if(xmlHttpReq.readyState == 4){			
		if(xmlHttpReq.status == 200){
			var responseXml=xmlHttpReq.XML;	
			var response = xmlHttpReq.responseXML.documentElement;
			var loggedIn = response.getElementsByTagName('DIG_x0020_Session_x0020_ValidationResult')[0].firstChild.data;
			Ext.util.Cookies.set('loggedIn', loggedIn);
		}else{
			alert(xmlHttpReq.statusText);
			alert('Your login is expired, please login again');
			window.location.href="login.html";
		}

	}
}

function getCookieVal (offset) {
  var endstr = document.cookie.indexOf (";", offset);
  if (endstr == -1) { endstr = document.cookie.length; }
  return unescape(document.cookie.substring(offset, endstr));
  }

function GetCookie (name) {
  var arg = name + "=";
  var alen = arg.length;
  var clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg) {
      return getCookieVal (j);
      }
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) break; 
    }
  return null;
  }
