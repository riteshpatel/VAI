/**
@class ListParser
@author Ritesh Patel for VAI
@version 1.0
@last-modified 01/26/2012
* Class to parse forms listing from the XML file
*/
function getForm(formname){
	var fp = new FormParser();
	fp.getForm(formname);
}
Ext.define('ListParser', {
	getForm:function(){
		alert('test');
	},
	getFormsListXML:function(){
		xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.open("post","/VAI.DIG.SmartClient.ReportManager/ExportData.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://localhost/vai.dig.smartclient.reportmanager/reportdatacollector/FormsList");
		xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){	
					var xml = xmlHttpReq.responseXML;
					var formxml = $(xml).find("FormsListResult").text();
					var srchxml = $(xml).find("FormSearches").text();
					
					if(!window.DOMParser){
						  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
						  xmlDoc.async="false";
						  xmlDoc.loadXML(formxml);
						  $(xmlDoc).find('Form').each(function(){
						  	var name = $(this).attr('Name');
						  	var val = $(this).attr('Text');
						  	DIGGlobal.formMap.add(val, name);							
						  });	
					}else{
						  $(formxml).find('Form').each(function(){
						  	var name = $(this).attr('Name');
						  	var val = $(this).attr('Text');
						  	DIGGlobal.formMap.add(val, name);							
						  });	
					
					}
					
					var frmcnt = DIGGlobal.formMap.getCount();	
					
					var html = '<div class="wireframemenu">' + 
					'<ul>';
					for(var i=0; i < frmcnt; i++){
						var formname = DIGGlobal.formMap.get(i);
						
						var keys = DIGGlobal.formMap.keys;
						var formid = keys[i];
						html += "<li><a href=\"javascript:getForm('" + formname + "');\">" + formname + "</a></li>";						
					
					}
					html +='</ul>' +
					       '</div>';
					
				
					var panel = Ext.create('Ext.panel.Panel',{						
						layout:'fit',
						scope:this,
						html:html						
					});
					DIGGlobal.fieldForm.add(panel);
					
					
					for(var i=0; i < frmcnt; i++){
						var formname = DIGGlobal.formMap.get(i);
						
						var keys = DIGGlobal.formMap.keys;
						var formid = keys[i];						

					}

					
							
				}
			}
		}
		
		var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
							"<soap:Body>"+
							"<FormsList  xmlns='http://localhost/vai.dig.smartclient.reportmanager/reportdatacollector' />"+
							" </soap:Body>"+
							"</soap:Envelope>";
		xmlHttpReq.send(soapRequest);
		return false;
		
		
	}
});
