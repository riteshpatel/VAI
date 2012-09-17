/**
@class DIGSearch
@author Ritesh Patel for VAI
@version 1.0
@last-modified 02/12/2012
* Class to perform the DIG Search
*/

/**
	linkGridXml()
	Creates Search summary on Results Tab
*/
function linkGridXml(guid,srch,dsqry,startrec,pagesize,newgrid){
	//Ext.getCmp('summaryWindow').hide();
	//Ext.fly('resultgriddiv').update('');
	DIGGlobal.digMask.show();
	var rstabs = Ext.getCmp('resultsMainTabs');
	rstabs.setActiveTab('searchResultsTab');

	var rsGrid = Ext.getCmp('resultgrid');

	if(rsGrid){
		rsGrid.destroy();
	}
	
	Ext.fly('summarydiv').update('');
	if(dsqry.lastIndexOf('.') != -1){
		dsqry = dsqry.substring(dsqry.lastIndexOf('.') + 1);			
	}
	var digToken = GetCookie("sessionToken");
	xmlHttpReq = new XMLHttpRequest();	         
	xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
	xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
	xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG Search");
	xmlHttpReq.onreadystatechange=function(){
		if(xmlHttpReq.readyState == 4){		
			if(xmlHttpReq.status == 200){


				      var response = xmlHttpReq.responseXML;
				      var xml = $(response).find('DIG_x0020_SearchResult').text();
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

				       var dgs = new DIGSearch();	

				       if(dsqry == 'Docs'){
						dgs.parseDocXml(xmlDoc,dsqry,guid,srch);
				       }else{					       		
						dgs.parseGridXml(xmlDoc,dsqry,guid,srch,newgrid);	

				       }					       	
			}
		}
	}			
	var crit = "<Group Name='Groups'><SO Fuzzy='False' FuzVal='1' Stemming='False' Phonic='False' Syn='False' SearchType='allofthewords' TextValue='" + srch + "'></Group>";
	var srcs = guid;
	var srchopt = "<Options StartRecd='" + startrec + "' NumRecdsperView='" + pagesize + "' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='False' ShowWordList='false' IndexProfile='default'>";
	var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
						"<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>"+
						"<soap:Body>"+
						"<DIG_x0020_Search xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
						"<sessionToken>" + digToken + "</sessionToken>"+
						"<searchType>BasicSearch</searchType><criteria>&lt;Group Name='Groups'&gt;&lt;SO Fuzzy='False' FuzVal='1' Stemming='False' Phonic='False' Syn='False' SearchType='allofthewords' TextValue='" + srch + "' /&gt;&lt;/Group&gt;</criteria><sources>&lt;Sources&gt;&lt;View Name='' ResourceGuid='" + guid + "' /&gt;&lt;/Sources&gt;</sources><searchoptions>&lt;Options StartRecd='" + startrec + "' NumRecdsperView='" + pagesize + "' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='False' ShowWordList='false' IndexProfile='default' /&gt;</searchoptions>" + 							
						"</DIG_x0020_Search>"+
						"</soap:Body>"+
						"</soap:Envelope>";

	xmlHttpReq.send(soapRequest);
}

/**
	getDSDocXml()
	Responds to html document link in the results grid
*/
function getDSDocXml(docid,hits,score,indexPath,doctitle,rsrcguid){
		if(indexPath.indexOf('^') != -1){		
			var ival = indexPath.split('^');
			var newindexPath = '';
			for(var i=0; i < ival.length; i++){
				newindexPath += ival[i];
				if(i < (ival.length - 1)){
					newindexPath += '\\';
				}
				
			}
			indexPath = newindexPath;			
		}

		if(doctitle.indexOf('^') != -1){		
			var ival = doctitle.split('^');
			var newdoctitle = '';
			for(var i=0; i < ival.length; i++){
				newdoctitle += ival[i];
				if(i < (ival.length - 1)){
					newdoctitle += '\\';
				}
				
			}
			doctitle = newdoctitle;			
		}

	        var digToken = "";
	        digToken = GetCookie("sessionToken");
	        xmlHttpReq = new XMLHttpRequest();	         
		xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG Document");
		xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){
				      var response = xmlHttpReq.responseXML.documentElement;
				      var docurl = response.getElementsByTagName('DIG_x0020_DocumentResult')[0].firstChild.data;
				      var extWin = Ext.getCmp('docWindow');
				      if(!extWin){
					      extWin = Ext.create('Ext.window.Window',{
								title:'DIG Document',
								id:'docWindow',
								width:800,
								height:600,
								autoScroll:true,
								layout:'fit',							
								autoLoad:{
									url:docurl,
									scripts:true,
									disableCaching:false
								},
								bbar:[
									{
										xtype:'button',
										text:'Close',
										iconCls:'icon-close',
										handler:function(){
											extWin.close();
										}
									},{
										text: 'Print',
										iconCls: 'icon-print',
										handler : function(){
											Ext.ux.grid.PrintPanel.printAutomatically = false;
											Ext.ux.grid.PrintPanel.print(docWin);											
										}

									   }
								]


							});
							extWin.show();					      
					}else{
						extWin.getLoader().load({url:docurl,scripts:true,disableCaching:false});
						if(!extWin.isVisible()){				     		
							extWin.show();
						}				     	
					}
					      
				}
			}
		}
		
		var soapRequest = "";
		soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>"+
							"<soap:Body>"+
							"<DIG_x0020_Document xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
							"<sessionToken>" + digToken + "</sessionToken>"+
							"<docInfo>&lt;DocInfo DocumentInfo=\"&amp;lt;?xml version=&amp;quot;1.0&amp;quot;?&amp;gt;&amp;lt;DTSInfo&amp;gt;&amp;lt;DTS ServerName=&amp;quot;Local&amp;quot; DocTitle='" + doctitle + "' Hits='" + hits + "' ResourceGuid='" + rsrcguid + "' IndexPath='" + indexPath + "' DocID='" + docid + "' /&amp;gt;&amp;lt;/DTSInfo&amp;gt;\" asHTML='True' isWebPage='True' /&gt;</docInfo>" + 
							"<serverName>digdev.visualanalytics.com</serverName>" + 
							"<serverTimeOut>300000</serverTimeOut>" + 
							"</DIG_x0020_Document>"+
							"</soap:Body>"+
							"</soap:Envelope>";
							
		
		xmlHttpReq.send(soapRequest);

}

/**
	getDocXml()
	Responds to html link from the Grid
*/
function getDocXml(serverName,docTitle,indexPath,hits,rsrcguid,docid){
		
		if(indexPath.indexOf('^') != -1){		
			var ival = indexPath.split('^');
			var newindexPath = '';
			for(var i=0; i < ival.length; i++){
				newindexPath += ival[i];
				if(i < (ival.length - 1)){
					newindexPath += '\\';
				}
				
			}
			indexPath = newindexPath;
			
		}
	        var digToken = "";
	        digToken = GetCookie("sessionToken");
	        xmlHttpReq = new XMLHttpRequest();	         
			xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
			xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
			xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG Document");
			xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){
				      var response = xmlHttpReq.responseXML.documentElement;
				      var docurl = response.getElementsByTagName('DIG_x0020_DocumentResult')[0].firstChild.data;
				      //Ext.fly('linkdiv').update(docurl);
				      
				      var docWin = Ext.getCmp('docWindow');
				      
				      if(!docWin){				      		
					      var extWin = Ext.create('Ext.window.Window',{
								title:'DIG Document',
								id:'docWindow',
								width:800,
								height:600,
								closeAction:'hide',
								layout:'fit',	
								cls:'window-style',
								scope:this,
								loader:{},
								autoLoad:{
									url:docurl,
									scripts:true,
									disableCaching:false
								},
								bbar:[
									{
										xtype:'button',
										text:'Close',
										iconCls:'icon-close',
										handler:function(){
											extWin.close();
										}
									},{
										text: 'Print',
										iconCls: 'icon-print',
										handler : function(){
											Ext.ux.grid.PrintPanel.printAutomatically = false;
											Ext.ux.grid.PrintPanel.print(docWin);											
										}

									   }
								]


							});
							extWin.show();					      
				     }else{
				     	
				     	docWin.getLoader().load({url:docurl,scripts:true,disableCaching:false});
				     	if(!docWin.isVisible()){				     		
				     		docWin.show();
				     	}				     	
				     }
					      
				}
			}
		}
		
		var soapRequest = "";
		soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>"+
							"<soap:Body>"+
							"<DIG_x0020_Document xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
							"<sessionToken>" + digToken + "</sessionToken>"+
							"<docInfo>&lt;DocInfo DocumentInfo=\"&amp;lt;?xml version=&amp;quot;1.0&amp;quot;?&amp;gt;&amp;lt;DTSInfo&amp;gt;&amp;lt;DTS ServerName=&amp;quot;Local&amp;quot; DocTitle='" + docTitle + "' Hits='" + hits + "' ResourceGuid='" + rsrcguid + "' IndexPath='" + indexPath + "' DocID='" + docid + "' /&amp;gt;&amp;lt;/DTSInfo&amp;gt;\" asHTML='True' isWebPage='True' /&gt;</docInfo>" + 
							"<serverName>digdev.visualanalytics.com</serverName>" + 
							"<serverTimeOut>300000</serverTimeOut>" + 
							"</DIG_x0020_Document>"+
							"</soap:Body>"+
							"</soap:Envelope>";
							
		
		xmlHttpReq.send(soapRequest);
		//return false;
}

/**
	callComplete()
	Callback function for the asynchronous search
*/
function callComplete(trans){
	var dynPnl = Ext.create('Ext.panel.Panel', {
	      	title: trans,
		    width: 200,
		    autoHeight:true,
		    maxWidth:300,		    
		    style:'margin:0 auto;',	
			height:20,			
		    defaults: {
				// applied to each contained panel
				bodyStyle: 'padding:15px'
		    }
		});
	DIGGlobal.resultsWindow.add(dynPnl);
}

/**
	Actual class definition
*/
Ext.define('DIGSearch',{
	scope:this,
	searchNode:function(node,nodeSearch,cnt){
		node.eachChild(function(n){
			if(n.hasChildNodes()){	
				var dgs = new DIGSearch();
				dgs.searchNode(n, nodeSearch,cnt);
				
			}
			
			var chNodeName = n.get('text');
			if(chNodeName == nodeSearch){
				n.set('text', chNodeName + ' <b>[' + cnt + ']</b>');				
				n.commit();
			}
			
			
		});
		
	},
	getSummary:function(url,reqIndex,completeCB,srch){
		xmlHttpReq = new XMLHttpRequest();	         
		xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG Search");
		xmlHttpReq.onreadystatechange=function(){
	
			for(var i=0; i < DIGGlobal.ajaxArr.length; i++){				
				if(DIGGlobal.ajaxArr[i] && DIGGlobal.ajaxArr[i].readyState == 4){
					if(DIGGlobal.ajaxArr[i].status == 200){
					      var response = DIGGlobal.ajaxArr[i].responseXML;
					      var xml = $(response).find('DIG_x0020_SearchResult').text();		
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

					      var xmldata = xmlDoc.documentElement;
					      var html = '';
					      var transGuid = Ext.DomQuery.selectValue('TransactionGUID', xmldata);	
					      var eventTS = Ext.DomQuery.selectValue('EventTimestamp', xmldata);	
					      var critNode = Ext.DomQuery.selectNode('SearchCriteria', xmldata);
					      
					      var critChild = '', critChildXml = '';
					      critChild = critNode.childNodes;
					      critChildXml = critChild[0].nodeValue;
					      var parser;
					      if(!window.DOMParser){
						  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
						  xmlDoc.async="false";
						  xmlDoc.loadXML(critChildXml); 												      
					      }else{
						      parser = new DOMParser();
						      xmlDoc=parser.parseFromString(critChildXml,"text/xml");
					      }
					      var soNode = Ext.DomQuery.selectNode('SO', xmlDoc);
					      var txtValue = '';
					      txtValue = soNode.attributes.getNamedItem("TextValue").value;

					      this.dsMap = new Ext.util.MixedCollection();
					      this.msgMap = new Ext.util.MixedCollection();
					      this.recCntMap = new Ext.util.MixedCollection();
				              
				              var viewGUID = Ext.DomQuery.selectValue('ViewGUID', xmldata);
					      var viewName = Ext.DomQuery.selectValue('ViewName', xmldata);
						
					      var dsName = '';
					      if(dsName.indexOf('.') != -1){
					      	dsName = viewName.substring(0, viewName.indexOf('.'));
					      }else{
					      	dsName = viewName;
					      }
					      var qryName = '';
					      if(viewName.indexOf('.') != -1){
					      	qryName = viewName.substring(viewName.indexOf('.') + 1);
					      }else{
					      	qryName = viewName;
					      }
					      
					      var digNodes = xmldata.getElementsByTagName('sysDIGViewsInfo');
					      var cntr = 0, msgcntr = 0;
					      for(var d=0; d < digNodes.length; d++){
							var dcNodes = digNodes[d].childNodes;	
							for(var c=0; c < dcNodes.length; c++){
								var chNode = dcNodes[c];
								var qryName = '', msg = '', dsName = '', dsAndQry = '', recCount = '';
								if(chNode.nodeName == 'ViewName'){
									dsAndQry = chNode.childNodes[0].nodeValue;
									
									dsName = dsAndQry.substring(0, dsAndQry.indexOf('.'));
									qryName = dsAndQry.substring(dsAndQry.indexOf('.') + 1);
									DIGGlobal.rcrdView.push(qryName);									
								}else if(chNode.nodeName == 'ViewStatus'){
									var vStatus = chNode.childNodes[0].nodeValue;
									if(!window.DOMParser){
										xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
										xmlDoc.async="false";
										xmlDoc.loadXML(vStatus); 												      								
									}else{
										parser = new DOMParser();
										xmlDoc = parser.parseFromString(vStatus, "text/xml");
									}
									var vinfo = Ext.DomQuery.selectNode('ViewInfo', xmlDoc);
									msg = vinfo.attributes.getNamedItem('Message').value;								
									recCount = vinfo.attributes.getNamedItem('RecordCount').value;									1
									DIGGlobal.rcrdCount.push(recCount);
								}

								if(dsAndQry != '' && dsAndQry != null && msg.indexOf('Bad Data') == -1){								
									this.dsMap.add(cntr, dsAndQry);	
									cntr++;
								}	

								if(msg != null && msg != '' && msg.indexOf('Bad Data') == -1){								 
									this.msgMap.add(msgcntr, msg + ":" + recCount);	
									msgcntr++;
								}

							}


					      }//end for					      
					      
					      
					      var keys = this.dsMap.keys;
					      
					      for(var s=0; s < this.dsMap.length; s++){				      		
							var dsName = this.dsMap.get(s);
							var dsQry = dsName.substring(dsName.indexOf('.')+1);
							var msgRaw = this.msgMap.get(s);
							var msg = msgRaw.substring(0, msgRaw.indexOf(':'));
							var pattern = /[0-9]+/;
							var nums = msg.match(pattern);
							msg = msg.replace(nums, '<b>' + nums + '</b>');
							var tdsQry = dsQry;
							var rsrcGuid;
							if(dsName.indexOf('.Docs') != -1){
								rsrcGuid = DIGGlobal.guidGrp.getByKey(dsName);
							}else{
								rsrcGuid = DIGGlobal.guidGrp.getByKey(tdsQry);
							}
							var jsfunc = '';
							if(nums == null){
								nums = 0;
							}
							if(nums > 0){
								jsfunc = "javascript:linkGridXml('" + rsrcGuid + "','" + srch + "','" + tdsQry + "',0,20,true);";
							}else{
								jsfunc = "javascript:alert('No data found');";
							}
							var dsRoot = DIGGlobal.noCheckTree.getRootNode();
							
							var onlyName = '';
							if(dsName.indexOf('Docs') == -1){
								onlyName = dsName.substring(dsName.indexOf('.')+1);
							}else{
								onlyName = dsName;
							}
							
							var dgs = new DIGSearch();
							dgs.searchNode(dsRoot,onlyName,nums);
							
							DIGGlobal.srcCntr++;
							//html = dsName + ' [<a href="' + jsfunc + '" style="color:white">' + nums + '</a>]';
							html = DIGGlobal.srcCntr + ') <a href="' + jsfunc + '" style="color:white">' + dsName + ' [' + nums + ']</a>';
							var dynPnl = Ext.create('Ext.panel.Panel', {
									title: html,
									width: 400,
									autoHeight:true,
									maxWidth:600,		    
									style:'margin:0 auto;',	
									height:25,			
									defaults: {
										// applied to each contained panel
										bodyStyle: 'padding:15px'
									}
								});
							
							Ext.getCmp('searchSummaryTab').add(dynPnl);
							
					      }//end for
					      
					}//end if
					DIGGlobal.ajaxArr[i] = null;
				}//end if
				
			}
		}
		DIGGlobal.ajaxArr.push(xmlHttpReq);		
		xmlHttpReq.send(url);		
	},
	
	//perform parallel search
	parallelSearch:function(srch){
	
		DIGGlobal.srcCntr = 0;
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
							qryArr.push(qryGrpName + ':' + qryGrpName);
							
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
		//itemclick event on the tree nodes
		DIGGlobal.noCheckTree.on('itemclick', function(view, record, item, index, event){
			var rstabs = Ext.getCmp('resultsMainTabs');
			rstabs.setActiveTab('searchResultsTab');
			var srchResultTab = Ext.getCmp('searchResultsTab');
			//srchResultTab.update('<html></html>');
			Ext.fly('htmldiv').update('');
			var isRoot = record.data.root;
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
			Ext.fly('summarydiv').update('');
			var rsGrid = Ext.getCmp('resultgrid');
			
			if(rsGrid){
				rsGrid.destroy();
			}
			
			var rsrcGuid = DIGGlobal.guidGrp.getByKey(dsQry);

			var digSrch = new DIGSearch();
			if(nodoc == true){
				alert('No documents found');
			}else{
				if(isRoot){
					var rstabs = Ext.getCmp('resultsMainTabs');
					rstabs.setActiveTab('searchSummaryTab');
					
				}else{
					digSrch.getGridXml(rsrcGuid,srch,dsQry,0,20, true);
				}
			}
		});
		
		
		DIGGlobal.noCheckTree.expandAll();
		this.rsdsTree = DIGGlobal.noCheckTree;
		this.rsdsTree.autoScroll = true;
		this.rsdsTree.height = 800;
		
	        var rsEast = Ext.getCmp('results-east');
	        rsEast.add(this.rsdsTree);
		
		//loop through each nodes
	        var tabs = Ext.getCmp('mainTabs');
	        tabs.setActiveTab('resultstab');
	        
	        var summaryTab = Ext.getCmp('searchSummaryTab');
	        summaryTab.setTitle('Search Summary [' + srch + ']');
	        
	        var resultsMainTab = Ext.getCmp('resultsMainTabs');
	        resultsMainTab.setActiveTab('searchSummaryTab');
	        
		var digToken = "";
		digToken = GetCookie("sessionToken");
		//search options
		var phon = Ext.getCmp('phonetic');		
		var syn = Ext.getCmp('syn');
		var stem = Ext.getCmp('stem');
		var fuzz = Ext.getCmp('fuzzy');
		var fuzzfld = '', fuzztxtval = '1';

		var phonval = phon.getValue();
		var synval = syn.getValue();
		var stemval = stem.getValue();
		var fuzzval = fuzz.getValue();
		var srchtype = Ext.getCmp('phrasebtn').getText();		
		
		phonval = phonval == true ? 'True' : 'False';
		synval = synval == true ? 'True' : 'False';
		stemval = stemval == true ? 'True' : 'False';
		fuzzval = fuzzval == true ? 'True' : 'False';
		
		
		if(srchtype == 'Any of the Words'){
			srchtype = 'anyofthewords';
		}else if(srchtype == 'Exact Phrase'){
			srchtype = 'theexactphrase';
		}else if(srchtype == 'Boolean'){
			srchtype = 'boolean';	
		}else{
			srchtype = 'allofthewords';
		}
		if(fuzzval == 'True'){
			fuzzfld = Ext.getCmp('fuzzytxt');
			fuzztxtval = fuzzfld.getValue();
		}
		for(var i=0; i < DIGGlobal.guidGrp.length; i++){
			if(i == 0){	
				var titlePanel = Ext.create('Ext.panel.Panel', {
					title: '<font style="font-size:16px;font-weight:bold;color:#ffcc66;">You have searched for ' + DIGGlobal.guidGrp.length + ' Data Sources</font>',
					width: 400,
					autoHeight:true,
					maxWidth:600,		    
					style:'margin:0 auto;background-color:#000000',	
					height:25,			
					defaults: {
						// applied to each contained panel
						bodyStyle: 'padding:15px'
					}
				});
				Ext.getCmp('searchSummaryTab').add(titlePanel);
			}
		
			srcs = "&lt;View Name='' ResourceGuid='" + DIGGlobal.guidGrp.get(i) + "'/&gt;"
			var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
								"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
								"<soap:Body>"+
								"<DIG_x0020_Search xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
								"<sessionToken>" + digToken + "</sessionToken>"+
								"<searchType>BasicSearch</searchType><criteria>&lt;Group Name='Groups'&gt;&lt;SO Fuzzy='" + fuzzval + "' FuzVal='" + fuzztxtval + "' Stemming='" + stemval + "' Phonic='" + phonval + "' Syn='" + synval + "' SearchType='" + srchtype + "' TextValue='" + srch + "' /&gt;&lt;/Group&gt;</criteria><sources>&lt;Sources&gt;" + srcs + "&lt;/Sources&gt;</sources><searchoptions>&lt;Options StartRecd='0' NumRecdsperView='20' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='True' ShowWordList='false' IndexProfile='default' /&gt;</searchoptions>" + 							
								"</DIG_x0020_Search>"+
								"</soap:Body>"+
								"</soap:Envelope>";			
			this.getSummary(soapRequest,i,callComplete,srch);			
		}		
	},
	/**
		doSearch()
		Obsolete (synchronous search)
	*/
	doSearch:function(srch){
	
		   var pgb = Ext.create('Ext.ProgressBar', {
			text: 'Searching...',
			width: 335
		   });

		   var smenu = Ext.create('Ext.menu.Menu', {
			width: 350,
			plain: true,
			float: true,
			shadow: true,
			frame: true,
			style:'margin-left:-150px;text-align:left',
			items: [
			    pgb
			]
		   });

		   smenu.show();
		    
		var rsrcGuid = '';
		
		for(var i=0; i < DIGGlobal.guidGrp.length; i++){
			rsrcGuid += "&lt;View Name='' ResourceGuid='" + DIGGlobal.guidGrp.get(i) + "'/&gt;";			
		}
		
		var prog = 0;
		prog = (50) % 105;
		pgb.updateProgress(prog / 100);
		
	        var digToken = "";
	        digToken = GetCookie("sessionToken");
	        xmlHttpReq = new XMLHttpRequest();	         
			xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
			xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
			xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG Search");
			xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){
					      //FIRE FOX Issue, modify code to look like XMLDSParser
					      //var response = xmlHttpReq.responseXML.documentElement;
					      //var xml = response.getElementsByTagName('DIG_x0020_SearchResult')[0].firstChild.data;
					      var response = xmlHttpReq.responseXML;
					      var xml = $(response).find('DIG_x0020_SearchResult').text();
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
						
					      var xmldata = xmlDoc.documentElement;
					      
					      var transGuid = Ext.DomQuery.selectValue('TransactionGUID', xmldata);	
					      var eventTS = Ext.DomQuery.selectValue('EventTimestamp', xmldata);	
					      var critNode = Ext.DomQuery.selectNode('SearchCriteria', xmldata);
					      
					      var critChild = '', critChildXml = '';
					      critChild = critNode.childNodes;
					      critChildXml = critChild[0].nodeValue;
					      var parser;
					      if(!window.DOMParser){
						  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
						  xmlDoc.async="false";
						  xmlDoc.loadXML(critChildXml); 												      
					      }else{
						      parser = new DOMParser();
						      xmlDoc=parser.parseFromString(critChildXml,"text/xml");
					      }
					      var soNode = Ext.DomQuery.selectNode('SO', xmlDoc);
					      var txtValue = '';
					      
					      txtValue = soNode.attributes.getNamedItem("TextValue").value;
					      this.html = '<div style="margin-top:20px;width:750px;margin-left:auto;margin-right:auto;">';
					      this.html += '<table width="600" style="border:1px solid #404040" class="rsultssummary">' +
					      		   '<tr><td class="rsultsheader" colspan="2">Search summary</td></tr>';
					      this.html += '<tr><td class="headerfont1" style="background-color:#333333;color:white" colspan="2">Searched for <font class="srchtxtbg">' + txtValue + ' @ ' + eventTS + '</font></td></tr>';
					      this.html += '<tr><td class="normfont" style="background-color:#99CCFF"><b>Data Sources</b></td><td align=center class="normfont" style="background-color:#99CCFF"><b>Results</b></td></tr>';	
					      this.dsMap = new Ext.util.MixedCollection();
					      this.msgMap = new Ext.util.MixedCollection();
					      this.recCntMap = new Ext.util.MixedCollection();

					      prog = (prog + 80) % 105;
					      pgb.updateProgress(prog / 100);

					      var digNodes = xmldata.getElementsByTagName('sysDIGViewsInfo');
					      var cntr = 0, msgcntr = 0;
					      for(var i=0; i < digNodes.length; i++){
						var dcNodes = digNodes[i].childNodes;				      	
						for(var c=0; c < dcNodes.length; c++){
							var chNode = dcNodes[c];
							var qryName = '', msg = '', dsName = '', dsAndQry = '', recCount = '';
							if(chNode.nodeName == 'ViewName'){
								dsAndQry = chNode.childNodes[0].nodeValue;							
								dsName = dsAndQry.substring(0, dsAndQry.indexOf('.'));
								qryName = dsAndQry.substring(dsAndQry.indexOf('.') + 1);
								DIGGlobal.rcrdView.push(qryName);
							}else if(chNode.nodeName == 'ViewStatus'){
								var vStatus = chNode.childNodes[0].nodeValue;
								if(!window.DOMParser){
									xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
									xmlDoc.async="false";
									xmlDoc.loadXML(vStatus); 												      								
								}else{
									parser = new DOMParser();
									xmlDoc = parser.parseFromString(vStatus, "text/xml");
								}
								var vinfo = Ext.DomQuery.selectNode('ViewInfo', xmlDoc);
								msg = vinfo.attributes.getNamedItem('Message').value;								
								recCount = vinfo.attributes.getNamedItem('RecordCount').value;
								
								DIGGlobal.rcrdCount.push(recCount);
							}
							
							if(dsAndQry != '' && dsAndQry != null && msg.indexOf('Bad Data') == -1){								
								this.dsMap.add(cntr, dsAndQry);															
								cntr++;
							}	

							if(msg != null && msg != '' && msg.indexOf('Bad Data') == -1){								
								this.msgMap.add(msgcntr, msg + ":" + recCount);																
								msgcntr++;
							}

						}

					      }
					      
					      
					      var keys = this.dsMap.keys;
					      		
					      prog = (prog + 90) % 105;
					      pgb.updateProgress(prog / 100);
					      		
					      for(var s=0; s < this.dsMap.length; s++){				      		
							var dsName = this.dsMap.get(s);
							var dsQry = dsName.substring(dsName.indexOf('.')+1);
							var msgRaw = this.msgMap.get(s);
							var msg = msgRaw.substring(0, msgRaw.indexOf(':'));
							var pattern = /[0-9]+/;
							var nums = msg.match(pattern);
							msg = msg.replace(nums, '<b>' + nums + '</b>');
							var tdsQry = dsQry;
							var rsrcGuid;
							if(dsName.indexOf('.Docs') != -1){
								rsrcGuid = DIGGlobal.guidGrp.getByKey(dsName);
							}else{
								rsrcGuid = DIGGlobal.guidGrp.getByKey(tdsQry);
							}
							var jsfunc = '';
							if(nums == null){
								nums = 0;
							}
							if(nums > 0){
								jsfunc = "javascript:linkGridXml('" + rsrcGuid + "','" + srch + "','" + tdsQry + "',0,20,true);";
							}else{
								jsfunc = "javascript:alert('No data found');";
							}
							
							this.html += '<tr><td style="border:1px solid #404040"><font class="srchdsbg" align="center" width="250">' + dsName + '</font></td><td align="center" style="border:1px solid #404040"><font class="srchdsbg"><a href="' + jsfunc + '">' + nums + '</a></font></td></tr>';

					      }
					      this.html += '</table>';
					      		   
					      this.html += '</div>';
					      DIGGlobal.searchSummary = this.html;
					      var tabs = Ext.getCmp('mainTabs');
					      tabs.setActiveTab('resultstab');	

					      Ext.fly('summarydiv').update(this.html);	
					      
					      
					      var dgs = new DIGSearch();
					      
					      var acc = dgs.bldDSTree(this.dsMap,this.msgMap,srch);
					      
					      var rsEast = Ext.getCmp('results-east');
					      rsEast.add(acc);
					      
					      prog = (100) % 105;
					      pgb.updateProgress(95);
					      
					      pgb.updateText('Done');
					      pgb.wait({interval:1000});
					      pgb.destroy();
					      smenu.destroy();					      
						
				}
			}
		}
		var crit = "<Group Name='Groups'><SO Fuzzy='False' FuzVal='1' Stemming='False' Phonic='False' Syn='False' SearchType='allofthewords' TextValue='" + srch + "'></Group>";
		var srcs = rsrcGuid;
		var srchopt = "<Options StartRecd='0' NumRecdsperView='20' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='True' ShowWordList='false' IndexProfile='default'>";
		
		//search options
		var phon = Ext.getCmp('phonetic');		
		var syn = Ext.getCmp('syn');
		var stem = Ext.getCmp('stem');
		var fuzz = Ext.getCmp('fuzzy');
		var fuzzfld = '', fuzztxtval = '1';

		var phonval = phon.getValue();
		var synval = syn.getValue();
		var stemval = stem.getValue();
		var fuzzval = fuzz.getValue();
		var srchtype = Ext.getCmp('phrasebtn').getText();		
		
		phonval = phonval == true ? 'True' : 'False';
		synval = synval == true ? 'True' : 'False';
		stemval = stemval == true ? 'True' : 'False';
		fuzzval = fuzzval == true ? 'True' : 'False';
		
		
		if(srchtype == 'Any of the Words'){
			srchtype = 'anyofthewords';
		}else if(srchtype == 'Exact Phrase'){
			srchtype = 'theexactphrase';
		}else if(srchtype == 'Boolean'){
			srchtype = 'boolean';	
		}else{
			srchtype = 'allofthewords';
		}
		if(fuzzval == 'True'){
			fuzzfld = Ext.getCmp('fuzzytxt');
			fuzztxtval = fuzzfld.getValue();
		}
		
		var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
							"<soap:Body>"+
							"<DIG_x0020_Search xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
							"<sessionToken>" + digToken + "</sessionToken>"+
							"<searchType>BasicSearch</searchType><criteria>&lt;Group Name='Groups'&gt;&lt;SO Fuzzy='" + fuzzval + "' FuzVal='" + fuzztxtval + "' Stemming='" + stemval + "' Phonic='" + phonval + "' Syn='" + synval + "' SearchType='" + srchtype + "' TextValue='" + srch + "' /&gt;&lt;/Group&gt;</criteria><sources>&lt;Sources&gt;" + srcs + "&lt;/Sources&gt;</sources><searchoptions>&lt;Options StartRecd='0' NumRecdsperView='20' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='True' ShowWordList='false' IndexProfile='default' /&gt;</searchoptions>" + 							
							"</DIG_x0020_Search>"+
							"</soap:Body>"+
							"</soap:Envelope>";
		xmlHttpReq.send(soapRequest);
		return false;
		
	},
	/**
		bldDSTree()
		Obsolete used in doSearch
	*/
	bldDSTree:function(dsMap,msgMap,srch){
		var xdq = new XMLDSParser();
		
		xdq.getDSXmlNoCheck(dsMap,msgMap,srch);
		this.rsdsTree = DIGGlobal.noCheckTree;
		this.rsdsTree.autoScroll = true;
		this.rsdsTree.height = 800;
		return this.rsdsTree;
	},

	/**
		bldFSDSTree()
		Obsolete used in doSearch
	*/
	bldFSDSTree:function(dsMap,msgMap,qrystr){
		var xdq = new XMLDSParser();
		
		xdq.getFSDSXmlNoCheck(dsMap,msgMap,qrystr);
		this.rsdsTree = DIGGlobal.noCheckTree;
		this.rsdsTree.autoScroll = true;
		this.rsdsTree.height = 800;
		return this.rsdsTree;
	},

	/**
		getGridXml()
		Extracts XML returned by the webservice to render the grid
	*/
	getGridXml:function(guid,srch,dsqry,startrec,pagesize,newgrid){
		DIGGlobal.digMask.show();
		if(dsqry.lastIndexOf('.') != -1){
			dsqry = dsqry.substring(dsqry.lastIndexOf('.') + 1);			
		}
		var digToken = GetCookie("sessionToken");
	        xmlHttpReq = new XMLHttpRequest();	         
		xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG Search");
		xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){
					      var response = xmlHttpReq.responseXML;
					      //console.log(response);
					      var xml = $(response).find('DIG_x0020_SearchResult').text();
					      //&#xC;
					      xml = xml.replace(/[&#]/g,'');
					      //str.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '') ;
					      
					      if (window.DOMParser)
						{
						  //console.log(xml);
						  parser=new DOMParser();
						  //xmlDoc=parser.parseFromString(xml,"text/xml");
						  xmlDoc = $.parseXML(xml);
						  console.log(xmlDoc);
						}
					      else // Internet Explorer
						{
						  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
						  xmlDoc.async="false";
						  xmlDoc.loadXML(xml); 
						}
					       
					       var dgs = new DIGSearch();	
					       //console.log(xmlDoc);
					       if(dsqry == 'Docs'){
					       		dgs.parseDocXml(xmlDoc,dsqry,guid,srch);
					       }else{			
					       		dgs.parseGridXml(xmlDoc,dsqry,guid,srch,newgrid);
					       		
					       }					       	
				}
			}
		}			

		//advanced search options
		var phon = Ext.getCmp('phonetic');		
		var syn = Ext.getCmp('syn');
		var stem = Ext.getCmp('stem');
		var fuzz = Ext.getCmp('fuzzy');
		var fuzzfld = '', fuzztxtval = '1';

		var phonval = phon.getValue();
		var synval = syn.getValue();
		var stemval = stem.getValue();
		var fuzzval = fuzz.getValue();
		var srchtype = Ext.getCmp('phrasebtn').getText();		
		
		phonval = phonval == true ? 'True' : 'False';
		synval = synval == true ? 'True' : 'False';
		stemval = stemval == true ? 'True' : 'False';
		fuzzval = fuzzval == true ? 'True' : 'False';
		
		
		if(srchtype == 'Any of the Words'){
			srchtype = 'anyofthewords';
		}else if(srchtype == 'Exact Phrase'){
			srchtype = 'theexactphrase';
		}else if(srchtype == 'Boolean'){
			srchtype = 'boolean';	
		}else{
			srchtype = 'allofthewords';
		}
		if(fuzzval == 'True'){
			fuzzfld = Ext.getCmp('fuzzytxt');
			fuzztxtval = fuzzfld.getValue();
		}
		

		var crit = "<Group Name='Groups'><SO Fuzzy='False' FuzVal='1' Stemming='False' Phonic='False' Syn='False' SearchType='allofthewords' TextValue='" + srch + "'></Group>";
		var srcs = guid;
		var srchopt = "<Options StartRecd='" + startrec + "' NumRecdsperView='" + pagesize + "' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='False' ShowWordList='false' IndexProfile='default'>";
		
		//if(startrec == 0)startrec = 1;
				
		var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>"+
							"<soap:Body>"+
							"<DIG_x0020_Search xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
							"<sessionToken>" + digToken + "</sessionToken>"+
							"<searchType>BasicSearch</searchType><criteria>&lt;Group Name='Groups'&gt;&lt;SO Fuzzy='" + fuzzval + "' FuzVal='" + fuzztxtval + "' Stemming='" + stemval + "' Phonic='" + phonval + "' Syn='" + synval + "' SearchType='" + srchtype + "' TextValue='" + srch + "' /&gt;&lt;/Group&gt;</criteria><sources>&lt;Sources&gt;&lt;View Name='' ResourceGuid='" + guid + "' /&gt;&lt;/Sources&gt;</sources><searchoptions>&lt;Options StartRecd='" + startrec + "' NumRecdsperView='" + pagesize + "' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='False' ShowWordList='false' IndexProfile='default' /&gt;</searchoptions>" + 							
							"</DIG_x0020_Search>"+
							"</soap:Body>"+
							"</soap:Envelope>";

		xmlHttpReq.send(soapRequest);
		return false;
		
		
	},
	
	/**
		parseDocXml()
		Parses documents returned by the web service
		Implement multiple docs in the next release
	*/	
	parseDocXml:function(xml,dsQry,guid,srch){
		
		$(xml).find('DIGDocs.Docs').each(function(){
			var loopDocTitle = $(xml).find('DocTitle').text();
			alert(loopDocTitle);
			
		});
		Ext.fly('summarydiv').update('');
		var html = '';		
		
		
		var docTitle = $(xml).find('DocTitle').text();
		
		
		var docExt = $(xml).find('Extension').text();
		var docAddr = $(xml).find('DocAddress').text();
		var fileName = $(xml).find('FileName').text();
		var hits = $(xml).find('Hits').text();
		
		
		var hitCount = $(xml).find('HitCount').text();
		hitCount = hitCount.substring(0,20) + '...';
		var score = $(xml).find('Score').text();

		
		var dsc = $(xml).find('Description').text();
		dsc = dsc.replace(/[^a-zA-Z 0-9]+/g,'');
		
		
		var inContext = $(xml).find('HitsInContext').text();
		
		inContext = inContext.replace(/[^a-zA-Z 0-9]+/g,'');
		
		
		
		var indexPath = $(xml).find('IndexPath').text();
		var docID = $(xml).find('DocID').text();
		var rsrcGuid = $(xml).find('ResourceGuid').text();
		var tranGuid = $(xml).find('TransactionGUID').text();
		var findexPath = '', fdocTitle = '';
		if(indexPath.indexOf("\\") != -1){
			findexPath = indexPath.replace(/\\/g, '^');
		}
		
		if(docTitle.indexOf("\\") != -1){
			fdocTitle = docTitle.replace(/\\/g, '^');
		}

		html = '<div style="margin-top:20px;width:750px;margin-left:auto;margin-right:auto;">';
		html += '<table width="700" style="border:1px solid #404040" class="rsultssummary">' +
			'<tr><td align=left colspan=4 class="rsultsheader">' +
		       'DIG Documents<br><br>' + 
		       '</td></tr>' + 
			'<tr><td class="docheader" style="border:1px solid #404040">Document</td>' +
			'<td class="docheader" width=100 style="border:1px solid #404040">Score</td>' +
			'<td class="docheader" width=120 style="border:1px solid #404040">Hits</td>' +
			'<td class="docheader" style="border:1px solid #404040">Details</td>' + 
			'</tr>' + 
		       '<tr><td align=center style="padding:2px;border:1px solid #404040" valign=top>' + 
		       docID + "<a href=javascript:getDSDocXml('" + docID + "','" + hits + "','" + score + "','" + findexPath + "','" + fdocTitle + "','" + rsrcGuid + "');><br><br>Display</a></td>" + 
				'<td align=center valign=top style="border:1px solid #404040">' + score + '</td><td>&nbsp;</td>' + 
				'<td align=left valign=top style="border:1px solid #404040">' + docTitle + '<br><br>' + 
				'Document Summary & Highlighted search items<br><br>' + 
				inContext + '<br><br></td>';
		html += '</tr>' + 
			'</table></div>';
		
		var rstabs = Ext.getCmp('resultsMainTabs');
		rstabs.setActiveTab('searchResultsTab');
		var srchResultTab = Ext.getCmp('searchResultsTab');
		
		Ext.fly('htmldiv').update(html);
		DIGGlobal.digMask.hide();
				
	},
	/**
		parseGridXml()
		Parse XML returned by the web service for rendering the grid
	*/
	parseGridXml:function(xml,dsQry,guid,srch,newgrid,isfs){

		//Ext.fly('summarydiv').update('');
		var newXml =    '<?xml version="1.0" encoding="UTF-8"?>\n' + 
				'<NewDataSet>\n';
		
		for(var i=0; i < DIGGlobal.rcrdView.length; i++){
			var tmpName = DIGGlobal.rcrdView[i];
			
			if(tmpName == dsQry){
				var cnt = DIGGlobal.rcrdCount[i];
				newXml += '<TotalRecords>' + cnt + '</TotalRecords>';
				break;
			}
		}
		
			
		$(xml).find('NewDataSet').each(function(){
			$(this).children().each(function(){				
				if(this.nodeName.indexOf(dsQry) != -1){
					newXml += '<' + dsQry + '>\n';
					$(this).children().each(function(){
						var nodeName = this.nodeName;						
						var val = $(this).text();
						if(nodeName != 'Photo' && nodeName != 'DIGMetaData'){
							val = val.replace(/[^a-zA-Z 0-9]+/g,'');
						}
						if(val == null){
							val = '';
						}
						if(nodeName.indexOf('_x0020_') != -1){
							nodeName = nodeName.replace(/_x0020_/g, '');
						}
						
						if(nodeName == 'DIGMetaData'){
							var ixml = $.parseXML(val);
							$(ixml).find('DTS').each(function(){
									var serverName = $(this).attr('ServerName');
									var docTitle = $(this).attr('DocTitle');
									var indexPath = $(this).attr('IndexPath');
									var hits = $(this).attr('Hits');
									var rsrcguid = $(this).attr('ResourceGuid');
									var docid = $(this).attr('DocID');
									newXml += '<' + nodeName + '>' + serverName + '|'  + docTitle + '|' + indexPath + '|' + hits + '|' + rsrcguid + '|' + docid + '</' + nodeName + '>';									
								});							
							
						}else if(nodeName == 'Photo'){
							newXml += '<' + nodeName + '>' + val + '</' + nodeName + '>\n';							
						}else{
							newXml += '<' + nodeName + '>' + val + '</' + nodeName + '>\n';							
						}
					});
					newXml += '</' + dsQry + '>\n';
				}
			});

		});
		newXml += '</NewDataSet>';
		nxml = $.parseXML(newXml);
		
	    	var rsGrid = Ext.getCmp('resultgrid');
	    	
	    	if(rsGrid != undefined && newgrid == true){	    	
	    		var rcenter = Ext.getCmp('resultscenter');
	    		rcenter.remove('resultgrid',true);
	    		rcenter.remove('datastore', true);
	    	}

	    	var arrParentNodes = new Array();
	    	var arrCols = new Array();
	    	var cntr = 0;
	    	$(xml).find('NewDataSet').each(function(){	    		
			$(this).children().each(function(){
				var parentNodeName = (this).nodeName;	
				var strParentNodes = arrParentNodes.toString();
				
				if(strParentNodes.indexOf(parentNodeName) == -1 && parentNodeName != 'xs:schema'){
					arrParentNodes.push(parentNodeName);
					cntr++;
					$(this).children().each(function(){
						if(this.nodeName == 'DIGMetaData'){
							arrCols.splice(0,0,parentNodeName + ':' + this.nodeName);
						}else if(this.nodeName == 'Score'){
							arrCols.splice(1,0,parentNodeName + ':' + this.nodeName);
						}else{
							arrCols.push(parentNodeName + ':' + this.nodeName);
						}
					});
				}
	
			});
	    	});
	    	var gridCols = [];
	    	var fieldsCol = [];
	    	
	    	for(var i=0; i < arrCols.length; i++){
			var rawCols = arrCols[i];
			if(rawCols.indexOf(dsQry) != -1){		    					
				var colName = rawCols.substring(rawCols.indexOf(':') +1);		
				
				if(colName.indexOf('_x0020_') != -1){
					colName = colName.replace(/_x0020_/g, '');
				}
				fieldsCol.push(colName);
				if(colName == 'DIGMetaData'){
					gridCols.push({
						text:'HTML',
						flex:1,
						dataIndex:colName,
						sortable:true,
						renderer:getDoc
					});
				}else if(colName == 'Photo'){
					gridCols.push({
						text:colName,
						flex:1,
						dataIndex:colName,
						width:300,
						sortable:true,
						renderer:getImage
					});
				}else if(colName == 'AddressGoogleMaps' || colName == 'SecondaryAddressGoogleMaps'){
					gridCols.push({
						text:colName,
						flex:1,
						dataIndex:colName,
						sortable:true,
						renderer:mapUrl
					});
				}else{
					gridCols.push({
						text:colName,
						flex:1,
						dataIndex:colName,
						sortable:true,
						renderer:columnWrap,
						width:350
					});
				}
	
			}
	    	}
	    	
	    	function mapUrl(val){
	    		return '<a href="' + val + '" target=_blank>Map</a>';
	    	}
	    	function getImage(val){	    		
	    		return '<img src="data:image/jpg;base64,' + val + '"/>';	    		
	    	}
	    	
	    	function getDoc(val){			
	    		var arrval = val.split('|');
	    		var serverName = arrval[0];
	    		var docTitle = arrval[1];
	    		var indexPath = arrval[2];
	    		if(indexPath != null && indexPath.indexOf("\\") != -1){
	    			indexPath = indexPath.replace(/\\/g, '^');
	    		}
	    		var hits = arrval[3];
	    		var rsrcguid = arrval[4];
	    		var docid = arrval[5];
	    		var jsfunc = "javascript:getDocXml('" + serverName + "','" + docTitle + "','" + indexPath + "','" + hits + "','" + rsrcguid + "','" + docid + "');";
	    		var jsLink = '<a href="' + jsfunc + '">Display</a>';
	    		return jsLink;
	    	
	    	}
	    	
		function columnWrap(val){
		    return '<div style="white-space:normal !important;">'+ val +'</div>';
		}
	    	
	    	xml = nxml;
	    	
	    	if(newgrid){
			this.bldGrid(xml,dsQry,fieldsCol,gridCols,guid,srch,isfs);	
		}else{
			this.refreshGrid(xml,dsQry,fieldsCol,gridCols,guid);
		}
	},
	
	refreshGrid:function(xml,dsQry,fieldsCol,gridCols,guid){	
		DIGGlobal.digMask.hide();
		
		var rsGrid = Ext.getCmp('resultgrid');
		var gridStore = rsGrid.getStore();
		
		var myStore = Ext.create('Ext.data.Store', {			
			//autoLoad: true,			
			pageSize:20,
			data:xml,
			id:'str',
			fields:fieldsCol,
			remoteSort:false,
			direction:'ASC',
			proxy: {
			    // load using HTTP
			    type: 'memory',
			    // the return will be XML, so lets set up a reader
			    reader: {
				type: 'xml',
				record:dsQry,
				totalProperty:'TotalRecords'
			    }
			}
	    	});
	    	
	    	gridStore.loadRecords(myStore.getRange(0,myStore.getCount()),{addRecords: false});
		
	},
	/**
		bldGrid()
		Build grid
	*/
	bldGrid:function(xml,dsQry,fieldsCol,gridCols,guid,srch,isfs){	
	    	var store = Ext.create('Ext.data.Store', {			
			pageSize:20,
			data:xml,
			id:'datastore',
			fields:fieldsCol,
			remoteSort:false,
			direction:'ASC',			
			proxy: {
			    type: 'memory',
			    reader: {
				type: 'xml',
				record:dsQry,
				totalProperty:'TotalRecords'
			    }
			}
	    	});
		var gridWidth = 1800;
		if(gridCols.length > 10 && gridCols.length < 20){
			gridWidth = 2000;
		}else if(gridCols.length >= 20){
			gridWidth = 2200;
		}

	    	// create the grid
	    	var chkGrid = Ext.getCmp('resultgrid');
	    	
	    	if(!chkGrid){
			var grid = Ext.create('Ext.grid.Panel', {
				id:'resultgrid',
				store: 'datastore',
				columns: gridCols,	
				border:0,
				tbar:[/*{
					xtype:'button',
					text:'Export To Excel',
					padding:'5',
					iconCls:'icon-xls',
					handler:function(){
							if(Ext.isIE6 || Ext.isIE7 || Ext.isIE8){
								Ext.ux.grid.Printer.printAutomatically = false;
								Ext.ux.grid.Printer.print(grid,gridCols);
							}else{
								document.location='data:application/vnd.ms-excel;base64,' + Base64.encode(grid.getExcelXml());
							}

					}
				      },*/
				      {
				      		text: 'Print',
				      	        iconCls: 'icon-print',
				      	        handler : function(){
				      	            	Ext.ux.grid.Printer.printAutomatically = false;
				      	            	Ext.ux.grid.Printer.print(grid,gridCols);
				      	        }
	            
				      }],
				// paging bar on the bottom
				bbar: Ext.create('Ext.PagingToolbar', {
				    store: store,
				    id:'pagebar',				    
				    displayInfo: true,
				    displayMsg: 'Displaying topics {0} - {1} of {2}',			    
				    emptyMsg: "No topics to display",			    
				    scope:this,
					listeners:{
						'beforechange':function(paging,page){						
							var currPage = store.currentPage;							
							var startrec = currPage * 20;	
							var totalcount = store.getTotalCount();

							if(startrec > totalcount){
								currPage = currPage - 1;
								startrec = (currPage - 1) *20;
							}

							if(page < currPage){//clicked previous button
								startrec = (page - 1) * 20;
							}
							var pagesize = 20;
							var dgsrch = new DIGSearch();
							if(isfs){
								dgsrch.getFSGridXml(guid,srch,dsQry,startrec,pagesize,false);
							}else{
								dgsrch.getGridXml(guid,srch,dsQry,startrec,pagesize,false);
							}

						}
					}
				}),
			});
			Ext.getCmp('searchResultsTab').remove(Ext.getCmp('resultgrid'));
			Ext.getCmp('searchResultsTab').add(grid);
			Ext.getCmp('searchResultsTab').doLayout();
		}	    	
		
		DIGGlobal.digMask.hide();
	},
	/**
		getFSGridXml()
		Retreive Form Search XML returned by the web service
	*/
	getFSGridXml:function(guid,srch,dsqry,startrec,pagesize,newgrid){
	
		DIGGlobal.digMask.show();
		if(dsqry.lastIndexOf('.') != -1){
			dsqry = dsqry.substring(dsqry.lastIndexOf('.') + 1);			
		}
		var digToken = GetCookie("sessionToken");
	        xmlHttpReq = new XMLHttpRequest();	         
		xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG Search");
		xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){
					      var response = xmlHttpReq.responseXML;
					      var xml = $(response).find('DIG_x0020_SearchResult').text();
					      
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
					       
					       var dgs = new DIGSearch();	
					       
					       if(dsqry == 'Docs'){
					       		dgs.parseDocXml(xmlDoc,dsqry,guid,srch);
					       }else{			
					       		dgs.parseGridXml(xmlDoc,dsqry,guid,srch,newgrid,true);
					       }					       	
				}
			}
		}			

		var srcs = guid;
		

		var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>"+
							"<soap:Body>"+
							"<DIG_x0020_Search xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
							"<sessionToken>" + digToken + "</sessionToken>"+
							"<searchType>BasicSearch</searchType><criteria>&lt;Group Name='Groups'&gt;&lt;SO Fuzzy='false' FuzVal='2' Stemming='false' Phonic='false' Syn='false' SearchType='boolean' TextValue='" + srch + "' /&gt;&lt;/Group&gt;</criteria><sources>&lt;Sources&gt;&lt;View Name='' ResourceGuid='" + guid + "' /&gt;&lt;/Sources&gt;</sources><searchoptions>&lt;Options StartRecd='" + startrec + "' NumRecdsperView='" + pagesize + "' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='False' ShowWordList='false' IndexProfile='default' /&gt;</searchoptions>" + 							
							"</DIG_x0020_Search>"+
							"</soap:Body>"+
							"</soap:Envelope>";

		xmlHttpReq.send(soapRequest);
		return false;
		
		
	}	
	
});//End Class