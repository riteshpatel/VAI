Ext.define('ListParser', {
	getFormsListXML: function(){
		xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.open("post","/VAI.DIG.SmartClient.ReportManager/ExportData.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://localhost/vai.dig.smartclient.reportmanager/reportdatacollector/FormsList");
		xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){		

					var response = xmlHttpReq.responseXML.documentElement;
					var xml = response.getElementsByTagName('FormsListResult')[0].firstChild.data;

					if (window.DOMParser)
					  {
					  parser=new DOMParser();
					  xmlDoc=parser.parseFromString(xml,"text/xml");
					  }
					else // Internet Explorer
					  {
					  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
					  xmlDoc.async="false";
					  xmlDoc.loadXML(xml); 
					  }
					var ele = xmlDoc.documentElement;			
					var child = ele.childNodes;
					var fcnt = 0;
					for(var i=0; i < child.length; i++){
						var childname = ele.childNodes[i].nodeName;						
						if(childname == 'Form'){						
							fcnt++;
							var name = child[i].getAttribute("Name");
							var val= child[i].getAttribute("Text");
							DIGGlobal.formMap.add(val, name);							
						}
					}

					var frmcnt = DIGGlobal.formMap.getCount();				
					for(var i=0; i < frmcnt; i++){
						var formname = DIGGlobal.formMap.get(i);
						
						var keys = DIGGlobal.formMap.keys;
						var formid = keys[i];

						DIGGlobal.fieldForm.add({
							xtype:'panel',
							height:30,
							border:0,					
							defaults:{anchor:'100%'},
							items:[{
								xtype:'button',
								text:formname,
								margin:'10 0 20 0',
								configRecIndex:i,
								id:formname,					
								handler: function(){
									var fp = new FormParser();
									fp.getForm(this.id);
								}

							}]
						});								

					}
					
					DIGGlobal.fieldForm.doLayout();
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
