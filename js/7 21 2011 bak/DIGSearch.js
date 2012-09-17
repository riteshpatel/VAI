Ext.define('DIGSearch',{
	doSearch:function(srch){
	        var digToken = "";
	        digToken = GetCookie("sessionToken");
	        xmlHttpReq = new XMLHttpRequest();	         
		xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG Search");
		xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){
						var response = xmlHttpReq.responseXML.documentElement;
						var xml = response.getElementsByTagName('DIG_x0020_SearchResult')[0].firstChild.data;
						alert(xml);
				}
			}
		}
		var crit = "<Group Name='Groups'><SO Fuzzy='False' FuzVal='1' Stemming='False' Phonic='False' Syn='False' SearchType='allofthewords' TextValue='" + srch + "'></Group>";
		var srcs = "<View Name='' ResourceGuid='ea92a4a9-ccc4-4f46-aacf-2e9db5d18868'><View Name='' ResourceGuid='b26170f3-f427-4336-99d5-3dca0d5c9ad9'>";
		var srchopt = "<Options StartRecd='0' NumRecdsperView='20' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='True' ShowWordList='false' IndexProfile='default'>";
		
		
		var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
							"<soap:Body>"+
							"<DIG_x0020_Search xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
							"<sessionToken>" + digToken + "</sessionToken>"+
							//"<searchType>BasicSearch</searchType>" + 							
							"<searchType>BasicSearch</searchType><criteria>&lt;Group Name='Groups'&gt;&lt;SO Fuzzy='False' FuzVal='1' Stemming='False' Phonic='False' Syn='False' SearchType='allofthewords' TextValue='Patel' /&gt;&lt;/Group&gt;</criteria><sources>&lt;Sources&gt;&lt;View Name='' ResourceGuid='ea92a4a9-ccc4-4f46-aacf-2e9db5d18868' /&gt;&lt;View Name='' ResourceGuid='b26170f3-f427-4336-99d5-3dca0d5c9ad9' /&gt;&lt;/Sources&gt;</sources><searchoptions>&lt;Options StartRecd='0' NumRecdsperView='20' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='True' ShowWordList='false' IndexProfile='default' /&gt;</searchoptions>" + 							
							//"<criteria>" + srch + "</criteria>" +
							//"<sources>" + srcs + "</sources>" + 
							"</DIG_x0020_Search>"+
							"</soap:Body>"+
							"</soap:Envelope>";
		xmlHttpReq.send(soapRequest);
		return false;
		
	}
});