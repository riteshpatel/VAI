Ext.define('XMLDSParser',{
	searchString:function(dsQryArr,cntArr,qryGrpName){
		var nodeStr = '';
		for(var i=0; i < dsQryArr.length; i++){
			var qryName = dsQryArr[i];			
			if(qryName == qryGrpName){
				var str = cntArr[i];				
				//remove . for DIGDocs				
				if(str.lastIndexOf('.') != -1){
					str = str.substring(str.lastIndexOf('.') + 1);
				}
				nodeStr = str;
				break;
			}
		}
		
		return nodeStr;
	},
	getDSXmlNoCheckAsync:function(dsMap,msgMap,srch){
		var dsQryArr = new Array();
		var cntArr = new Array();
		for(var i=0; i < dsMap.length; i++){
			var dsRaw = dsMap.get(i);
			var dsName = dsRaw.substring(0,dsRaw.indexOf('.'));
			var dsQry = dsRaw.substring(dsRaw.lastIndexOf('.')+1);			
			
			var msgRaw = msgMap.get(i);			
			var cnt = msgRaw.substring(msgRaw.indexOf(':') + 1);
			
			if(dsQry == 'Docs'){
				dsQry = dsRaw;
			}
			
			dsQryArr.push(dsQry);
			cntArr.push(dsQry +  ' <b>[' + cnt + ']</b>');			
		}		
	},
	getDSXmlNoCheck:function(dsMap,msgMap,srch){
		var dsQryArr = new Array();
		var cntArr = new Array();
		
		for(var i=0; i < dsMap.length; i++){
			var dsRaw = dsMap.get(i);
			
			var dsName = dsRaw.substring(0, dsRaw.indexOf('.'));			
			var dsQry = dsRaw.substring(dsRaw.lastIndexOf('.')+1);			
			
			var msgRaw = msgMap.get(i);			
			var cnt = msgRaw.substring(msgRaw.indexOf(':') + 1);
			
			if(dsQry == 'Docs'){
				dsQry = dsRaw;
			}
			
			dsQryArr.push(dsQry);
			cntArr.push(dsQry +  ' <b>[' + cnt + ']</b>');			
			
		}


		DIGGlobal.noCheckTree.setRootNode({
		    text: 'All DIG Servers',
		    expanded: true
		});    

		var dsRoot = DIGGlobal.noCheckTree.getRootNode();	
		for(var a=0; a < DIGGlobal.digServers.length; a++){
			var serverName = DIGGlobal.digServers[a];
			var cNode = dsRoot.appendChild({text:serverName, leaf:false});
			var treeMap = new Object();
			
			for(var d=0; d < DIGGlobal.dsMap.length; d++){
				var dsRaw = DIGGlobal.dsMap.get(d);
				
				var dsServer = dsRaw.substring(0, dsRaw.indexOf(':'));
				var dsName = dsRaw.substring(dsRaw.indexOf(':') + 1);
				var qryArr = new Array();
				if(dsName != null && serverName == dsServer){
					for(var q=0; q < DIGGlobal.qryGrpNameArr.length; q++){
						var qryRaw = DIGGlobal.qryGrpNameArr[q];						
						var qryLabel = qryRaw.substring(0, qryRaw.indexOf(':'));
						var qryGrpName = qryRaw.substring(qryRaw.indexOf(':') + 1, qryRaw.indexOf('^'));
						var rsrcGuid = qryRaw.substring(qryRaw.indexOf('^') + 1);
						if(qryGrpName == 'Docs'){
							qryGrpName = qryLabel + '.' + qryGrpName;
						}
						
						if(qryLabel == dsName){
							var nodeStr = this.searchString(dsQryArr,cntArr,qryGrpName);							
							if(nodeStr != ''){								
								qryArr.push(nodeStr + ':' + qryGrpName);
							}else{
								qryArr.push(qryGrpName + ':' + qryGrpName);
							}							
							
						}
					}
					
					treeMap[dsName] = qryArr;
				}
			}
			
			//node sort
			var keys = [];
			for (var key in treeMap) {
			    if (treeMap.hasOwnProperty(key)) {
				keys.push(key);
			    }
			}
			keys.sort ();
			for (i in keys) {
			   var key = keys[i];

			   var qNode = cNode.appendChild({text:key, leaf:false});
			   var value = treeMap[key];
			   value.sort();

			   for(var b=0; b < value.length; b++){
			      var rawVal = value[b];			      
			      var qryGrpName = rawVal.substring(0, rawVal.indexOf(':'));
			      var origGrpName = rawVal.substring(rawVal.indexOf(':') + 1);
			      qNode.appendChild({text:qryGrpName, leaf:true, id:origGrpName});

			   }

			}				
			
		}
		
		DIGGlobal.noCheckTree.on('itemclick', function(view, record, item, index, event){			
			var isRoot = record.data.root;
			//var parentNode = record.parentNode;
			//var parentName = parentNode.get('text');
			var nodoc = false;
			var nodeName = record.data.text;
			
			if(nodeName.indexOf('<b>[0]') != -1){
				nodoc = true;
			}else if(nodeName.indexOf('<b>') == -1 && !isRoot){
				nodoc = false;
			}else if(nodeName.indexOf('<b>[0]') == -1){
				nodoc = false;
			}else{
				nodoc = false;
			}
			
			var dsQry = record.data.id;
			//var rpanel = Ext.getCmp('resultPanel');
			var rsGrid = Ext.getCmp('resultgrid');
			
			if(rsGrid){
				rsGrid.destroy();
			}
			//Ext.fly('resultgriddiv').update('');
			Ext.fly('summarydiv').update('');
			
			var rsrcGuid = DIGGlobal.guidGrp.getByKey(dsQry);

			var digSrch = new DIGSearch();
			if(nodoc == true){
				alert('No documents found');
			}else{
				if(isRoot){
					//Ext.fly('resultgriddiv').update(DIGGlobal.searchSummary);
					Ext.fly('summarydiv').update(DIGGlobal.searchSummary);
				}else{
					digSrch.getGridXml(rsrcGuid,srch,dsQry,0,20, true);
				}
			}
		});
		
		
		DIGGlobal.noCheckTree.doLayout();	
		DIGGlobal.noCheckTree.expandAll();

	},
	
	getFSDSXmlNoCheck:function(dsMap,msgMap,srch){
		var dsQryArr = new Array();
		var cntArr = new Array();
		
		for(var i=0; i < dsMap.length; i++){
			var dsRaw = dsMap.get(i);
			
			var dsName = dsRaw.substring(0, dsRaw.indexOf('.'));			
			var dsQry = dsRaw.substring(dsRaw.lastIndexOf('.')+1);			
			
			var msgRaw = msgMap.get(i);			
			var cnt = msgRaw.substring(msgRaw.indexOf(':') + 1);
			
			if(dsQry == 'Docs'){
				dsQry = dsRaw;
			}
			
			dsQryArr.push(dsQry);
			cntArr.push(dsQry +  ' <b>[' + cnt + ']</b>');			
			
		}


		DIGGlobal.noCheckTree.setRootNode({
		    text: 'All DIG Servers',
		    expanded: true
		});    

		var dsRoot = DIGGlobal.noCheckTree.getRootNode();	
		for(var a=0; a < DIGGlobal.digServers.length; a++){
			var serverName = DIGGlobal.digServers[a];
			var cNode = dsRoot.appendChild({text:serverName, leaf:false});
			var treeMap = new Object();
			
			for(var d=0; d < DIGGlobal.dsMap.length; d++){
				var dsRaw = DIGGlobal.dsMap.get(d);
				
				var dsServer = dsRaw.substring(0, dsRaw.indexOf(':'));
				var dsName = dsRaw.substring(dsRaw.indexOf(':') + 1);
				var qryArr = new Array();
				if(dsName != null && serverName == dsServer){
					for(var q=0; q < DIGGlobal.qryGrpNameArr.length; q++){
						var qryRaw = DIGGlobal.qryGrpNameArr[q];
						
						var qryLabel = qryRaw.substring(0, qryRaw.indexOf(':'));
						var qryGrpName = qryRaw.substring(qryRaw.indexOf(':') + 1, qryRaw.indexOf('^'));
						var rsrcGuid = qryRaw.substring(qryRaw.indexOf('^') + 1);
						if(qryGrpName == 'Docs'){
							qryGrpName = qryLabel + '.' + qryGrpName;
						}
						if(qryLabel == dsName){
							var nodeStr = this.searchString(dsQryArr,cntArr,qryGrpName);
							if(nodeStr != ''){
								qryArr.push(nodeStr + ':' + qryGrpName);
							}else{
								qryArr.push(qryGrpName + ':' + qryGrpName);
							}							
							
						}
					}
					treeMap[dsName] = qryArr;
				}
			}
			
			//node sort
			var keys = [];
			for (var key in treeMap) {
			    if (treeMap.hasOwnProperty(key)) {
				keys.push(key);
			    }
			}
			keys.sort ();
			for (i in keys) {
			   var key = keys[i];

			   var qNode = cNode.appendChild({text:key, leaf:false});
			   var value = treeMap[key];
			   value.sort();

			   for(var b=0; b < value.length; b++){
			      var rawVal = value[b];
			      var qryGrpName = rawVal.substring(0, rawVal.indexOf(':'));
			      var origGrpName = rawVal.substring(rawVal.indexOf(':') + 1);
			      qNode.appendChild({text:qryGrpName, leaf:true, id:origGrpName});

			   }

			}				
			
		}
		
		DIGGlobal.noCheckTree.on('itemclick', function(view, record, item, index, event){			
			var isRoot = record.data.root;
			//var parentNode = record.parentNode;
			//var parentName = parentNode.get('text');
			var nodoc = false;
			var nodeName = record.data.text;
			
			if(nodeName.indexOf('<b>[0]') != -1){
				nodoc = true;
			}else if(nodeName.indexOf('<b>') == -1 && !isRoot){
				nodoc = false;
			}else if(nodeName.indexOf('<b>[0]') == -1){
				nodoc = false;
			}else{
				nodoc = false;
			}
			
			var dsQry = record.data.id;
			//var rpanel = Ext.getCmp('resultPanel');
			var rsGrid = Ext.getCmp('resultgrid');
			
			if(rsGrid){
				rsGrid.destroy();
			}
			//Ext.fly('resultgriddiv').update('');
			Ext.fly('summarydiv').update('');
			var rsrcGuid = DIGGlobal.guidGrp.getByKey(dsQry);

			var digSrch = new DIGSearch();
			if(nodoc == true){
				alert('No documents found');
			}else{
				if(isRoot){
					Ext.fly('summarydiv').update(DIGGlobal.searchSummary);
				}else{
					digSrch.getFSGridXml(rsrcGuid,srch,dsQry,0,20, true);
				}
			}
		});
		
		
		DIGGlobal.noCheckTree.doLayout();	
		DIGGlobal.noCheckTree.expandAll();

	},	
	
	getDSXmlJQRs:function(){
		DIGGlobal.digMask = new Ext.LoadMask(Ext.getBody(), {
				cls: 'x-mask-msg custom-mask-msg',				
				msg: 'Loading...',
				msgCls: 'x-mask-loading custom-mask-loading'
		});
			
		DIGGlobal.digMask.show();
	        
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
					var f = 0;
					if(!window.DOMParser){
						  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
						  xmlDoc.async="false";
						  xmlDoc.loadXML(digds);
						  $(xmlDoc).children().each(function(){
						  	$(this).children().each(function(){
								var serverName = this.nodeName;
								
								if(serverName.toLowerCase() == 'serverset'){
									DIGGlobal.digServers.push('Local DIG Servers');
									var tserverName = 'Local DIG Servers';

									$(this).children().each(function(){
										var dsLabel = $(this).attr('Label');	
										var dsSysName = $(this).attr('SystemName');
										
										DIGGlobal.dsMap.add(f, tserverName + ':' + dsLabel);
										f++;
										$(this).children().each(function(){
											if(this.nodeName == 'QueryGroup'){
												var qryGrpName = $(this).attr('Name');
												var rsrcGuid = $(this).attr('ResourceGuid');
												DIGGlobal.qryGrpNameArr.push(dsLabel + ':' + qryGrpName + '^' + rsrcGuid);
											}
										});

									});

								}else if(serverName.toLowerCase() == 'remoteservers'){
									//DIGGlobal.digServers.push('Remote Servers');
									var tserverName = 'Remote Servers';

									$(this).children().each(function(){
										var rnodename = this.nodeName;
										if(rnodename.toLowerCase() == 'remoteserver'){
											var rsServerName = $(this).attr('DisplayName');										
											DIGGlobal.digServers.push(rsServerName);
										
											$(this).children().each(function(){//ServerSet
												$(this).children().each(function(){
													var dsLabel = $(this).attr('Label');	
													var dsSysName = $(this).attr('SystemName');
													//DIGGlobal.dsMap.add(dsSysName, rsServerName + ':' + dsLabel);
													DIGGlobal.dsMap.add(f, rsServerName + ':' + dsLabel);
													f++;
													
													$(this).children().each(function(){
														if(this.nodeName == 'QueryGroup'){
															var qryGrpName = $(this).attr('Name');
															var rsrcGuid = $(this).attr('ResourceGuid');
															DIGGlobal.qryGrpNameArr.push(dsLabel + ':' + qryGrpName + '^' + rsrcGuid);
														}
													});

												});
											});
										}
									});
								}
							});

						  });
						  							
					}else{
						  $(digds).children().each(function(){
						  	var serverName = this.nodeName;
						  	
							if(serverName.toLowerCase() == 'serverset'){
								DIGGlobal.digServers.push('Local DIG Servers');
								var tserverName = 'Local DIG Servers';
								$(this).children().each(function(){
									var dsLabel = $(this).attr('Label');	
									var dsSysName = $(this).attr('SystemName');
									//DIGGlobal.dsMap.add(dsSysName, tserverName + ':' + dsLabel);
									DIGGlobal.dsMap.add(f, tserverName + ':' + dsLabel);
									f++;
									
									$(this).children().each(function(){
										
										if(this.nodeName.toLowerCase() == 'querygroup'){
											var qryGrpName = $(this).attr('Name');
											var rsrcGuid = $(this).attr('ResourceGuid');											
											DIGGlobal.qryGrpNameArr.push(dsLabel + ':' + qryGrpName + '^' + rsrcGuid);
										}
									});

								});

							}else if(serverName.toLowerCase() == 'remoteservers'){
								//DIGGlobal.digServers.push('Remote Servers');
								var tserverName = 'Remote Servers';
								$(this).children().each(function(){
									var rnodename = this.nodeName;
									if(rnodename.toLowerCase() == 'remoteserver'){
										var rsServerName = $(this).attr('DisplayName');										
										DIGGlobal.digServers.push(rsServerName);
										$(this).children().each(function(){//ServerSet
											$(this).children().each(function(){
												var dsLabel = $(this).attr('Label');	
												var dsSysName = $(this).attr('SystemName');
												//DIGGlobal.dsMap.add(dsSysName, rsServerName + ':' + dsLabel);
												DIGGlobal.dsMap.add(f, rsServerName + ':' + dsLabel);
												f++;
												
												$(this).children().each(function(){
													if(this.nodeName.toLowerCase() == 'querygroup'){
														var qryGrpName = $(this).attr('Name');
														var rsrcGuid = $(this).attr('ResourceGuid');
														DIGGlobal.qryGrpNameArr.push(dsLabel + ':' + qryGrpName + '^' + rsrcGuid);
													}
												});

											});
										});
									}
								});
							}

						  });
					
					}
					
					DIGGlobal.digServers.sort();
					
					DIGGlobal.dsTree.setRootNode({
					    text: 'All DIG Servers',
					    expanded: true
					});    

					var dsRoot = DIGGlobal.dsTree.getRootNode();	
					for(var a=0; a < DIGGlobal.digServers.length; a++){
						var serverName = DIGGlobal.digServers[a];
						
						var cNode = dsRoot.appendChild({text:serverName, leaf:false, checked:true});
						var treeMap = new Object();
						for(var d=0; d < DIGGlobal.dsMap.length; d++){
							var dsRaw = DIGGlobal.dsMap.get(d);
							var dsServer = dsRaw.substring(0, dsRaw.indexOf(':'));
							var dsName = dsRaw.substring(dsRaw.indexOf(':') + 1);
							var qryArr = new Array();
							if(dsName != null && serverName == dsServer){
								for(var q=0; q < DIGGlobal.qryGrpNameArr.length; q++){
									var qryRaw = DIGGlobal.qryGrpNameArr[q];
									var qryLabel = qryRaw.substring(0, qryRaw.indexOf(':'));
									var qryGrpName = qryRaw.substring(qryRaw.indexOf(':') + 1, qryRaw.indexOf('^'));
									var rsrcGuid = qryRaw.substring(qryRaw.indexOf('^') + 1);
									if(qryLabel == dsName){
										qryArr.push(qryGrpName + ':' + rsrcGuid);	
									}
								}

								treeMap[dsName] = qryArr;
							}
						}
						
						//node sort
						var keys = [];
						for (var key in treeMap) {
						    if (treeMap.hasOwnProperty(key)) {
							keys.push(key);
						    }
						}
						keys.sort ();
					        for (i in keys) {
					           var key = keys[i];
					           
					           var qNode = cNode.appendChild({text:key, leaf:false, checked:true});
					           var value = treeMap[key];
					           value.sort();
					           
					           for(var b=0; b < value.length; b++){
						      var rawVal = value[b];
						      var qryGrpName = rawVal.substring(0, rawVal.indexOf(':'));
						      var rsrcGuid = rawVal.substring(rawVal.indexOf(':') + 1);
						      qNode.appendChild({text:qryGrpName, leaf:true, id:rsrcGuid, checked:true});
						     
					           }
					          
					        }				
						
						
					}	
					
					DIGGlobal.dsTree.on('itemclick', function(view, record, item, index, event){	
						var isRoot = record.data.root;
						if(!isRoot){
							var isChecked = record.data.checked;			
							function nodeCheck(node){
								node.eachChild(function(n){
									if(n.hasChildNodes()){					
										nodeCheck(n);

									}
									n.set('checked', isChecked);
								});
							}
							nodeCheck(record);
						}

					});

					DIGGlobal.dsTree.doLayout();	
					DIGGlobal.dsTree.expandAll();
					DIGGlobal.digMask.hide();
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
		
		DIGGlobal.digMask.show();
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
					DIGGlobal.digMask.hide();			
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
