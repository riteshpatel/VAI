/**
@class FormParser
@author Ritesh Patel for VAI
@version 1.0
@last-modified 01/26/2012
* Class to parse the actual forms from xml files
*/
function linkFSGridXml(guid,srch,dsqry,startrec,pagesize,newgrid){
	//Ext.fly('resultgriddiv').update('');
	//Ext.fly('summarydiv').update('');
	var rstabs = Ext.getCmp('resultsMainTabs');
	rstabs.setActiveTab('searchResultsTab');

	var rsGrid = Ext.getCmp('resultgrid');

	if(rsGrid){
		rsGrid.destroy();
	}
	
	
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
						"<searchType>BasicSearch</searchType><criteria>&lt;Group Name='Groups'&gt;&lt;SO Fuzzy='False' FuzVal='1' Stemming='False' Phonic='False' Syn='False' SearchType='boolean' TextValue='" + srch + "' /&gt;&lt;/Group&gt;</criteria><sources>&lt;Sources&gt;&lt;View Name='' ResourceGuid='" + guid + "' /&gt;&lt;/Sources&gt;</sources><searchoptions>&lt;Options StartRecd='" + startrec + "' NumRecdsperView='" + pagesize + "' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='False' ShowWordList='false' IndexProfile='default' /&gt;</searchoptions>" + 							
						"</DIG_x0020_Search>"+
						"</soap:Body>"+
						"</soap:Envelope>";

	xmlHttpReq.send(soapRequest);
	//return false;
}
Ext.define('FormParser',{
	scope:this,
	searchNode:function(node,nodeSearch,cnt){
		node.eachChild(function(n){
			if(n.hasChildNodes()){	
				var dgs = new DIGSearch();
				dgs.searchNode(n, nodeSearch,cnt);
				
			}
			//alert(n.get('text'));
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
						
					      var dsName = viewName.substring(0, viewName.indexOf('.'));
					      var qryName = viewName.substring(viewName.indexOf('.') + 1);
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
								jsfunc = "javascript:linkFSGridXml('" + rsrcGuid + "','" + srch + "','" + tdsQry + "',0,20,true);";
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
							//this.html += '<tr><td style="border:1px solid #404040"><font class="srchdsbg" align="center" width="250">' + dsName + '</font></td><td align="center" style="border:1px solid #404040"><font class="srchdsbg"><a href="' + jsfunc + '">' + nums + '</a></font></td></tr>';
							html = dsName + ' [<a href="' + jsfunc + '" style="color:white">' + nums + '</a>]';
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
							//DIGGlobal.resultsWindow.add(dynPnl);							
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

	getForm:function(formName){
		DIGGlobal.activeFormName = formName;
		xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.open("post","/VAI.DIG.SmartClient.ReportManager/ExportData.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://localhost/vai.dig.smartclient.reportmanager/reportdatacollector/GetForm");
		xmlHttpReq.onreadystatechange=function(){
		
			DIGGlobal.labelMap.clear();
			DIGGlobal.fldMap.clear();
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){		
					var labelArray = new Array();
					//var ctlArray = new Array();
					var ctlnameArray = new Array();
					//var srchArray = new Array();
					var valArray = new Array();
					var idArray = new Array();
					var xml = xmlHttpReq.responseXML;
					var dsxml = $(xml).find("GetFormResult").text();
					if(!window.DOMParser){
						  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
						  xmlDoc.async="false";
						  xmlDoc.loadXML(dsxml);	
						$(xmlDoc).find('Row').each(function(){
							$(this).find('Control').each(function(){
								var attrcnt = $(this).get(0).attributes.length;
								if(attrcnt == 3){
									var labelid = $(this).attr('ID');
									var val = $(this).attr('Value');								
									labelArray.push(val);
									//extJs Collection
									DIGGlobal.labelMap.add(labelid,val);							
								}else if(attrcnt == 9){
									var ctltype = $(this).attr("Type");
									DIGGlobal.ctlArray.push(ctltype);
									var srchtype = $(this).attr("SearchObjectName");
									DIGGlobal.srchArray.push(srchtype);
									var ctlval = $(this).attr("Value");
									valArray.push(ctlval);
									var str = ctltype + '|' + srchtype + '|' + ctlval;
									var id = $(this).attr("ID");										
									idArray.push(id);
									DIGGlobal.fldMap.add(id,str);										

								}

							});
						});
					}else{
						$(dsxml).find('Row').each(function(){
							$(this).find('Control').each(function(){
								var attrcnt = $(this).get(0).attributes.length;
								if(attrcnt == 3){
									var labelid = $(this).attr('ID');
									var val = $(this).attr('Value');								
									labelArray.push(val);
									//extJs Collection
									DIGGlobal.labelMap.add(labelid,val);							
								}else if(attrcnt == 9){
									var ctltype = $(this).attr("Type");
									DIGGlobal.ctlArray.push(ctltype);
									var srchtype = $(this).attr("SearchObjectName");
									DIGGlobal.srchArray.push(srchtype);
									var ctlval = $(this).attr("Value");
									valArray.push(ctlval);
									var str = ctltype + '|' + srchtype + '|' + ctlval;
									var id = $(this).attr("ID");										
									idArray.push(id);
									DIGGlobal.fldMap.add(id,str);										

								}

							});
						});
					}

					var fldcnt = DIGGlobal.fldMap.getCount();
					var lblcnt = DIGGlobal.labelMap.getCount();
					for(var i=0; i < fldcnt; i++){
						var label = DIGGlobal.labelMap.get(i);
						var fldname = DIGGlobal.fldMap.get(i);
						
						var keys = DIGGlobal.fldMap.keys;
						var fldid = keys[i];						
					}	
					
					
					DIGGlobal.searchFrm = new Ext.form.Panel({
						name:'SearchFrm',
						id:'SearchFrm',
						autoHeight:true,	
						width:'100%',
						bodyPadding: 5,						
						autoScroll:true,
						scope:this,
						border:0,
						defaults:{
							labelWidth:200
						}			
					});					
					var fld = '';
					
					//dynamically adding forms (this should come from parsed XML)
					for(var i=0; i < fldcnt; i++){
						var labelName = DIGGlobal.labelMap.get(i);
						var srchFld = DIGGlobal.srchArray[i];
						var mixFld = DIGGlobal.fldMap.get(i);
						var keys = DIGGlobal.fldMap.keys;
						var fldID = keys[i];
						var fldArr = new Array();
						fldArr = mixFld.split('|');
						if(fldArr.length > 0){
							var ctlType = fldArr[0];
							var ctlValue = fldArr[1];
							var ddVal = fldArr[2];
							var arr = new Array();
							arr = ddVal.split(",");
							var ds = "";
							var arr1 = "";
							var arr2 = "";		
							if(ctlType == 'DropDownList'){
								for(var a=0, b = arr.length; a < b; a++){
									arr[a] = [arr[a]];
								}
								ds = new Ext.data.ArrayStore({
									data:arr,
									fields:['name']
								});
							}
							switch (ctlType){
								case "TextBox":
									fld = new Ext.form.TextField({
										fieldLabel:labelName,
										id:labelName,
										name:labelName,
										allowBlank:false,				
										listeners:{
											scope:this,
											specialkey:function(f,o){
											    if(o.getKey()==13){
											    	var fps = new FormParser();
												//fps.performFormSearch();
												fps.asyncFormSearch();
											    }
											}
										}										
										
									});
									DIGGlobal.searchFrm.add(fld);									
									break;
								case "DatePicker":
								    fld = new Ext.form.Date({
										fieldLabel:labelName,
										name:labelName,
										id:labelName,
										allowBlank:false
									});
									DIGGlobal.searchFrm.add(fld);
									break;
								case "DropDownList":
									fld = new Ext.form.ComboBox({
										store:ds,
										displayField:'name',
										name:labelName,
										id:labelName,
										mode: 'local',
										fieldLabel:labelName
									});
									DIGGlobal.searchFrm.add(fld);
									break;
								default:							
							}
						}
						
					}
					
					var submitBtn = Ext.create('Ext.Button',{
						text:'Search',						
						renderTo:document.body,
						cls:'x-searchbtn',
						handler:function(){
							//alert('Perform Search!');
							var fp = new FormParser();
							fp.asyncFormSearch();
						}
					});
					
					DIGGlobal.searchFrm.add(submitBtn);					

					DIGGlobal.searchFrm.doLayout();
					var formdiv = document.getElementById("formdiv");
					formdiv.innerHTML = '';
					
					var dynpanel = null;
					dynpanel = Ext.create('Ext.panel.Panel',{
								autoHeight:true,
								autoScroll:true,
								animCollapse:true,	
								cls:'x-frmheader',
								padding:'0',
								width:'1200',
								margin:'0',
								border:0,
								title:DIGGlobal.activeFormName + ' Search',								
								bodyStyle:{
									background:'white'
								},
								renderTo:'formdiv',
								items:[DIGGlobal.searchFrm]
							});						
					
					
				}
			}
		
		
		
		
		}
		var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
							"<soap:Body>"+
							"<GetForm  xmlns='http://localhost/vai.dig.smartclient.reportmanager/reportdatacollector'>"+
							"<fName>" + formName + "</fName>" + 
							"</GetForm>" + 
							" </soap:Body>"+
							"</soap:Envelope>";
		xmlHttpReq.send(soapRequest);
		return false;
	},
	
	asyncFormSearch:function(){
		DIGGlobal.guidGrp.clear();
		var chkNodes = DIGGlobal.dsTree.getView().getChecked();
		for(var n=0; n < chkNodes.length; n++){
			var selNode = chkNodes[n];			
			var isleaf = selNode.isLeaf();			
			if(!isleaf){//root node
				rootNode = selNode.get('text');
			}else{	
				var nodeTxt = selNode.get('text');
				var nodeParent = selNode.parentNode.get('text');

				if(nodeTxt == 'Docs'){
					nodeTxt = rootNode + '.' + nodeTxt;
				}
				DIGGlobal.guidGrp.add(nodeTxt, selNode.get('id'));
			}

		}


		var qryStr = '';
		var cntr = 0;
		for(var i=0; i < DIGGlobal.labelMap.getCount(); i++){
			var fld = Ext.getCmp(DIGGlobal.labelMap.get(i));
			var fldType = fld.getXType();
			
			var val = fld.getValue();
			if(val != null && val != ''){				
				if(fldType == 'datefield'){
					val = Ext.Date.format(val,'m/d/Y');									
				}
				if(cntr == 0){
					qryStr += '(' + DIGGlobal.srchArray[i] + ' CONTAINS (' + val + ')) '; 
				}else{
					qryStr += 'AND ((' + DIGGlobal.srchArray[i] + ' CONTAINS (' + val + ')) '; 
				}
				cntr++;
			}
		}
	
	
		/* build Tree */
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

		DIGGlobal.noCheckTree.on('itemclick', function(view, record, item, index, event){
			var rstabs = Ext.getCmp('resultsMainTabs');
			rstabs.setActiveTab('searchResultsTab');

			Ext.fly('summarydiv').update('');
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
					digSrch.getFSGridXml(rsrcGuid,qryStr,dsQry,0,20, true);
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
	        summaryTab.setTitle('Search Summary');
	        
	        var resultsMainTab = Ext.getCmp('resultsMainTabs');
	        resultsMainTab.setActiveTab('searchSummaryTab');
	        
		var digToken = "";
		digToken = GetCookie("sessionToken");


/*            */

		var rootNode;
		if(cntr > 0){
			var rsrcGuid = '';
			
			for(var i=0; i < DIGGlobal.guidGrp.length; i++){
				srcs = "&lt;View Name='' ResourceGuid='" + DIGGlobal.guidGrp.get(i) + "'/&gt;";
				
				var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
									"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
									"<soap:Body>"+
									"<DIG_x0020_Search xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
									"<sessionToken>" + digToken + "</sessionToken>"+							
									"<searchType>BasicSearch</searchType><criteria>&lt;Group Name='Groups'&gt;&lt;SO Fuzzy='false' FuzVal='2' Stemming='false' Phonic='false' Syn='false' SearchType='boolean' TextValue='" + qryStr + "' /&gt;&lt;/Group&gt;</criteria><sources>&lt;Sources&gt;" + srcs + "&lt;/Sources&gt;</sources><searchoptions>&lt;Options StartRecd='0' NumRecdsperView='20' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='True' ShowWordList='false' IndexProfile='default' /&gt;</searchoptions>" + 							
									"</DIG_x0020_Search>"+
									"</soap:Body>"+
									"</soap:Envelope>";
				this.getSummary(soapRequest,i,callComplete,qryStr);				
				
			}
		}
			
	},
	
	performFormSearch:function(){
		var rootNode;
		DIGGlobal.guidGrp.clear();
		var chkNodes = DIGGlobal.dsTree.getView().getChecked();
		for(var n=0; n < chkNodes.length; n++){
			var selNode = chkNodes[n];			
			var isleaf = selNode.isLeaf();			
			if(!isleaf){//root node
				rootNode = selNode.get('text');
			}else{	
				var nodeTxt = selNode.get('text');
				var nodeParent = selNode.parentNode.get('text');

				if(nodeTxt == 'Docs'){
					nodeTxt = rootNode + '.' + nodeTxt;
				}
				DIGGlobal.guidGrp.add(nodeTxt, selNode.get('id'));
			}

		}


		var qryStr = '';
		var cntr = 0;
		for(var i=0; i < DIGGlobal.labelMap.getCount(); i++){
			var fld = Ext.getCmp(DIGGlobal.labelMap.get(i));
			var fldType = fld.getXType();
			
			var val = fld.getValue();
			if(val != null && val != ''){				
				if(fldType == 'datefield'){
					val = Ext.Date.format(val,'m/d/Y');									
				}
				if(cntr == 0){
					qryStr += '(' + DIGGlobal.srchArray[i] + ' CONTAINS (' + val + ')) '; 
				}else{
					qryStr += 'AND ((' + DIGGlobal.srchArray[i] + ' CONTAINS (' + val + ')) '; 
				}
				cntr++;
			}
		}
		//alert(qryStr);
		if(cntr > 0){
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
								jsfunc = "javascript:linkFSGridXml('" + rsrcGuid + "','" + qryStr + "','" + tdsQry + "',0,20,true);";
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

					      var acc = dgs.bldFSDSTree(this.dsMap,this.msgMap,qryStr);

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

			var srcs = rsrcGuid;
			var srchopt = "<Options StartRecd='0' NumRecdsperView='20' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='True' ShowWordList='false' IndexProfile='default'>";

			var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
								"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
								"<soap:Body>"+
								"<DIG_x0020_Search xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
								"<sessionToken>" + digToken + "</sessionToken>"+							
								"<searchType>BasicSearch</searchType><criteria>&lt;Group Name='Groups'&gt;&lt;SO Fuzzy='false' FuzVal='2' Stemming='false' Phonic='false' Syn='false' SearchType='boolean' TextValue='" + qryStr + "' /&gt;&lt;/Group&gt;</criteria><sources>&lt;Sources&gt;" + srcs + "&lt;/Sources&gt;</sources><searchoptions>&lt;Options StartRecd='0' NumRecdsperView='20' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='True' ShowWordList='false' IndexProfile='default' /&gt;</searchoptions>" + 							
								"</DIG_x0020_Search>"+
								"</soap:Body>"+
								"</soap:Envelope>";
			xmlHttpReq.send(soapRequest);
			return false;
		}else{
			alert('You must specify item to search');
		}
	}
});//end Class
