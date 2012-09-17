/*
@class utils.js
@author Ritesh Patel for VAI
@version 1.0
@last-modified 01/26/2012
Utility class for login / cookies
*/

/**
	LoggedIn()
	Function to login the user in DIG
*/
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
}//end LoggedIn

/**
	isLoggedIn()
	Function to check if the user is already logged in to DIG
*/
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
}//end isLoggedIn

/**
	getCookieVal()
	@param {String} offset
	Read value of a specific cookie
*/
function getCookieVal (offset) {
  var endstr = document.cookie.indexOf (";", offset);
  if (endstr == -1) { endstr = document.cookie.length; }
  return unescape(document.cookie.substring(offset, endstr));
}//end getCookieVal

/**
	GetCookie()
	@param {String} name
	Loop through cookies and look for specific cookie, then pass that cookie to getCookieVal to retrieve the value stored in side of a cookie
*/
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
}//end GetCookie

/**
	digLogout()
	Function to log out the user from DIG
*/
function digLogout(){
    var localToken = Ext.util.Cookies.get("sessionToken");	
    xmlHttpReq = new XMLHttpRequest();
	xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/SecurityManager.asmx",true);
	xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
	xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/SecurityManager/DIGLogOut");
	xmlHttpReq.onreadystatechange=redirectUser;
	var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
						"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'"+
						" xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
						"<soap:Body>"+
						"<DIGLogOut xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/SecurityManager'>"+
						"<sessionToken>"+ localToken +"</sessionToken>"+						
						"</DIGLogOut>"+
						" </soap:Body>"+
						"</soap:Envelope>";
	xmlHttpReq.send(soapRequest);
 	
 }//end digLogout
 
/**
	redirectUser()
	Function to redirect the user after logging them out or if the login is expired
*/
function redirectUser(){
	if(xmlHttpReq.readyState == 4){			
		if(xmlHttpReq.status == 200){
			var responseXml=xmlHttpReq.XML;	
			var response = xmlHttpReq.responseXML.documentElement;
			var loggedOut = response.getElementsByTagName('DIGLogOutResult')[0].firstChild.data;
			window.location.href = "login.html";			
		}

	}
 }//end redirectUser