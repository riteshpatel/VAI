Ext.define('XMLDSParser',{
	getDSXmlJQ:function(){
	        var digToken = "";
	        digToken = GetCookie("sessionToken");

	        xmlHttpReq = new XMLHttpRequest();	         
		xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG DataSources");
		xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){
					var xml = xmlHttpReq.responseXML;
					var dsxml = $(xml).find("DIGSourcesXML").text();
					var digds = $(xml).find('DIGSources').text();
					
					if(!window.DOMParser){
						  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
						  xmlDoc.async="false";
						  xmlDoc.loadXML(digds);
						  if($(xmlDoc).find('ServerSet')){
						  	  var serverName = 'Local DIG Servers';
						  	  DIGGlobal.digServers.push(serverName);
							  
							  $(xmlDoc).find('DataSource').each(function(){
								var dsLabel = $(this).attr('Label');	
								var dsSysName = $(this).attr('SystemName');
								DIGGlobal.dsMap.add(dsSysName, serverName + ':' + dsLabel);
								
								$(this).find('QueryGroup').each(function(){
									var qryGrpName = $(this).attr('Name');
									var rsrcGuid = $(this).attr('ResourceGuid');
									DIGGlobal.qryGrpNameArr.push(dsLabel + ':' + qryGrpName + '^' + rsrcGuid);
								});
							  });
						  }
					}else{
						if($(digds).find('ServerSet')){
							var serverName = 'Local DIG Servers';
							DIGGlobal.digServers.push(serverName);
							
							$(digds).find('DataSource').each(function(){								
								var dsLabel = $(this).attr('Label');
								var dsSysName = $(this).attr('SystemName');
								DIGGlobal.dsMap.add(dsSysName, serverName + ':' + dsLabel);
								
								$(this).find('QueryGroup').each(function(){
									var qryGrpName = $(this).attr('Name');
									var rsrcGuid= $(this).attr('ResourceGuid');
									DIGGlobal.qryGrpNameArr.push(dsLabel + ':' + qryGrpName + '^' + rsrcGuid);									
								});

							});
						}
					}
					
					
					DIGGlobal.dsTree.setRootNode({
					    text: 'All DIG Servers',
					    expanded: true
					});    

					var dsRoot = DIGGlobal.dsTree.getRootNode();	
					for(var a=0; a < DIGGlobal.digServers.length; a++){
						var serverName = DIGGlobal.digServers[a];
						var cNode = dsRoot.appendChild({text:serverName, leaf:false});
						for(var d=0; d < DIGGlobal.dsMap.length; d++){
							var dsRaw = DIGGlobal.dsMap.get(d);
							var dsServer = dsRaw.substring(0, dsRaw.indexOf(':'));
							var dsName = dsRaw.substring(dsRaw.indexOf(':') + 1);

							if(dsName != null && serverName == dsServer){
								var qNode = cNode.appendChild({text:dsName, leaf:false});
								for(var q=0; q < DIGGlobal.qryGrpNameArr.length; q++){
									var qryRaw = DIGGlobal.qryGrpNameArr[q];
									var qryLabel = qryRaw.substring(0, qryRaw.indexOf(':'));
									var qryGrpName = qryRaw.substring(qryRaw.indexOf(':') + 1, qryRaw.indexOf('^'));
									var rsrcGuid = qryRaw.substring(qryRaw.indexOf('^') + 1);
									if(qryLabel == dsName){
										qNode.appendChild({text:qryGrpName, leaf:true, id:rsrcGuid, checked:true});
									}
								}
							}
						}
					}					
					DIGGlobal.dsTree.doLayout();	
					DIGGlobal.dsTree.expandAll();
				}else{
					window.location.href="login.html";

				}

			}
		}

		var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
							"<soap:Body>"+
							"<DIG_x0020_DataSources xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
							"<sessionToken>" + digToken + "</sessionToken>"+
							"</DIG_x0020_DataSources>"+
							"</soap:Body>"+
							"</soap:Envelope>";
		xmlHttpReq.send(soapRequest);
		return false;

	},
	getDSXml:function(){
	        var digToken = "";
	        digToken = GetCookie("sessionToken");

	        xmlHttpReq = new XMLHttpRequest();	         
		xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG DataSources");
		xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){
						var response = xmlHttpReq.responseXML.documentElement;
						var xml = response.getElementsByTagName('DIGSourcesXML')[0].firstChild.data;

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
						var ssChildren = ele.childNodes;
						var ssLen = ssChildren.length;

						var fltrCnt = 0;

						for(var x=0; x < ssLen; x++){
							var serverName = ssChildren[x].nodeName;
							DIGGlobal.digServers.push(serverName);

							var dsChildren = ssChildren[x].childNodes;
							var dsChildLen = dsChildren.length;
							for(var a=0; a < dsChildLen; a++){
								if(serverName != 'RemoteServers'){
									var dsLabel = dsChildren[a].getAttribute("Label");
									var dsSysName = dsChildren[a].getAttribute("SystemName");
									DIGGlobal.dsMap.add(dsSysName, serverName + ':' + dsLabel);

									var qryGrp = dsChildren[a].childNodes;
									var qryGrpLen = qryGrp.length;
									for(var q=0; q < qryGrpLen; q++){
										var qryGrpName = qryGrp[q].getAttribute("Name");
										var rsrcGuid = qryGrp[q].getAttribute("ResourceGuid");										
										DIGGlobal.qryGrpNameArr.push(dsLabel + ':' + qryGrpName + '^' + rsrcGuid);

										var fltrChildren = qryGrp[q].childNodes;
										var fltrLen = fltrChildren.length;
										for(var b=0; b < fltrLen; b++){
											var mstrObject = fltrChildren[b].getAttribute("MasterObject");
											if(mstrObject != null && mstrObject.length != 0){
												DIGGlobal.dsFields.add(fltrCnt, dsLabel + ":" + qryGrpName + ":" + mstrObject);
												fltrCnt++;
											}
										}

									}
								}else{
									var rele = xmlDoc.documentElement.getElementsByTagName("RemoteServer")[0];
									var rsDisplayName = rele.getAttribute("DisplayName");

									//get remote server ServerSet
									var releServerSet = rele.childNodes;
									var releDSChildren = releServerSet[0].childNodes;
									var releDSChildrenLen = releDSChildren.length;

									for(var r=0; r < releDSChildrenLen; r++){
										var dsLabel = releDSChildren[r].getAttribute("Label");
										var dsSysName = releDSChildren[r].getAttribute("SystemName");
										DIGGlobal.dsMap.add(dsSysName, serverName + ':' + dsLabel);	
										var qryGrp = releDSChildren[a].childNodes;
										var qryGrpLen = qryGrp.length;
										for(var q=0; q < qryGrpLen; q++){
											var qryGrpName = qryGrp[q].getAttribute("Name");
											var rsrcGuid = qryGrp[q].getAttribute("ResourceGuid");
											DIGGlobal.qryGrpNameArr.push(dsLabel + ':' + qryGrpName + '^' + rsrcGuid);

											var fltrChildren = qryGrp[q].childNodes;
											var fltrLen = fltrChildren.length;
											for(var b=0; b < fltrLen; b++){
												var mstrObject = fltrChildren[b].getAttribute("MasterObject");
												if(mstrObject != null && mstrObject.length != 0){
													DIGGlobal.dsFields.add(fltrCnt, dsLabel + ":" + qryGrpName + ":" + mstrObject);
													fltrCnt++;
												}
											}

										}


									}

								}

							}						
						}					

					
					DIGGlobal.dsTree.setRootNode({
					    text: 'All DIG Servers',
					    expanded: true
					});    

					var dsRoot = DIGGlobal.dsTree.getRootNode();	
					for(var a=0; a < DIGGlobal.digServers.length; a++){
						var serverName = DIGGlobal.digServers[a];
						var cNode = dsRoot.appendChild({text:serverName, leaf:false});
						for(var d=0; d < DIGGlobal.dsMap.length; d++){
							var dsRaw = DIGGlobal.dsMap.get(d);
							var dsServer = dsRaw.substring(0, dsRaw.indexOf(':'));
							var dsName = dsRaw.substring(dsRaw.indexOf(':') + 1);

							if(dsName != null && serverName == dsServer){
								var qNode = cNode.appendChild({text:dsName, leaf:false});
								for(var q=0; q < DIGGlobal.qryGrpNameArr.length; q++){
									var qryRaw = DIGGlobal.qryGrpNameArr[q];
									var qryLabel = qryRaw.substring(0, qryRaw.indexOf(':'));
									var qryGrpName = qryRaw.substring(qryRaw.indexOf(':') + 1, qryRaw.indexOf('^'));
									var rsrcGuid = qryRaw.substring(qryRaw.indexOf('^') + 1);
									if(qryLabel == dsName){
										qNode.appendChild({text:qryGrpName, leaf:true, id:rsrcGuid, checked:true});
									}
								}
							}
						}
					}					
					DIGGlobal.dsTree.doLayout();	
					DIGGlobal.dsTree.expandAll();
					
				}else{
					window.location.href="login.html";

				}

			}
			
			
		
		}
		var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
							"<soap:Body>"+
							"<DIG_x0020_DataSources xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
							"<sessionToken>" + digToken + "</sessionToken>"+
							"</DIG_x0020_DataSources>"+
							"</soap:Body>"+
							"</soap:Envelope>";
		xmlHttpReq.send(soapRequest);
		return false;
	
	}

});
