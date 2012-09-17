/**
login.js
@author Ritesh Patel for VAI
@version 1.0
@last-modified 01/26/2012
* Class used to perfor DIG login
*/
var securityToken = null;
function SoapCall(name,password){
    xmlHttpReq = new XMLHttpRequest();
	xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/SecurityManager.asmx",true);
	xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
	xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/SecurityManager/DIGLogin");
	xmlHttpReq.onreadystatechange=doUpdate;
	var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
						"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'"+
						" xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
						"<soap:Body>"+
						"<DIGLogin xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/SecurityManager'>"+
						"<userName>"+ name +"</userName>"+
						"<password>" + password + "</password>"+
						"</DIGLogin>"+
						" </soap:Body>"+
						"</soap:Envelope>";
	xmlHttpReq.send(soapRequest);
	return false;
}

function doUpdate(){	
	if(xmlHttpReq.readyState == 4){		
		if(xmlHttpReq.status == 200){
			var responseXml=xmlHttpReq.XML;			
			//securityToken = responseXml.getElementsByTagName("DIGLoginResponse")[0].text;	
			//alert(xmlHttpReq.getResponseHeader("Content-Type"));
			var response = xmlHttpReq.responseXML.documentElement;
			var securityToken = response.getElementsByTagName('DIGLoginResult')[0].firstChild.data;
			//put security token in a cookie...
			Ext.util.Cookies.set('sessionToken', securityToken);			
			window.location.href="dig.html";
		}else{
			alert(xmlHttpReq.statusText);
			alert('Error logging into Digital Information Gateway');
		}

	}
}
