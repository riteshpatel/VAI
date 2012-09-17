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

				      var extWin = Ext.create('Ext.window.Window',{
							title:'DIG Document',
							id:'docWindow',
							width:600,
							height:500,
							autoScroll:true,
							layout:'fit',							
							autoLoad:{
								url:docurl,
								scripts:true,
								disableCaching:false
							}
							

						});
						extWin.show();					      
					      
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
		return false;

}
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

				      var extWin = Ext.create('Ext.window.Window',{
							title:'DIG Document',
							id:'docWindow',
							width:600,
							height:300,
							layout:'fit',							
							autoLoad:{
								url:docurl,
								scripts:true,
								disableCaching:false
							}
							

						});
						extWin.show();					      
					      
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
		return false;
}

Ext.define('DIGSearch',{
	scope:this,
	doSearch:function(srch){
		var rsrcGuid = '';
		
		for(var i=0; i < DIGGlobal.guidGrp.length; i++){
			rsrcGuid += "<View Name='' ResourceGuid='" + DIGGlobal.guidGrp.get(i) + "'>";
			
		}

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
					      var critChild = critNode.childNodes;
					      var critChildXml = critChild[0].nodeValue;

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
					      var txtValue = soNode.attributes.getNamedItem("TextValue").value;
					      this.html = '<div style="margin:10 0 0 0;padding:20 0 0 30">';
					      this.html += '<font style="text-decoration:underline;font-size:14px;font-weight:bold;">Search summary</font><br><br>';
					      this.html += 'Searched for <b>' + txtValue + '</b><br>' +
							  'Searched at ' + eventTS + '<br>';

					      this.dsMap = new Ext.util.MixedCollection();
					      this.msgMap = new Ext.util.MixedCollection();
					      this.recCntMap = new Ext.util.MixedCollection();


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
							
							if(dsAndQry != '' && dsAndQry != null){
								this.dsMap.add(cntr, dsAndQry);															
								cntr++;
							}	

							if(msg != null && msg != ''){
								this.msgMap.add(msgcntr, msg + ":" + recCount);																
								msgcntr++;
							}

						}

					      }
					      this.html += '<br><br>';
					      //DIGGlobal.rcrdCount = this.dsMap;
					      var keys = this.dsMap.keys;

					      for(var s=0; s < this.dsMap.length; s++){				      		
							var dsName = this.dsMap.get(s);
							var dsQry = dsName.substring(dsName.indexOf('.')+1);

							var msgRaw = this.msgMap.get(s);
							var msg = msgRaw.substring(0, msgRaw.indexOf(':'));
							this.html += '<b>' + dsName + '</b> - <b>' + msg + '</b><br>';

					      }

					      this.html += '</div>';		
					      var tabs = Ext.getCmp('mainTabs');
					      tabs.setActiveTab('resultstab');				      
					      Ext.fly('summarydiv').update(this.html);
					      //var acc = this.bldDSAccordion(this.dsMap);		  
					      var dgs = new DIGSearch();
					      var acc = dgs.bldDSTree(this.dsMap,this.msgMap,srch);
					      var rsEast = Ext.getCmp('results-east');
					      rsEast.add(acc);

						
						
				}
			}
		}
		var crit = "<Group Name='Groups'><SO Fuzzy='False' FuzVal='1' Stemming='False' Phonic='False' Syn='False' SearchType='allofthewords' TextValue='" + srch + "'></Group>";
		var srcs = rsrcGuid;
		var srchopt = "<Options StartRecd='0' NumRecdsperView='20' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='True' ShowWordList='false' IndexProfile='default'>";
		
		
		var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
							"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
							"<soap:Body>"+
							"<DIG_x0020_Search xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface'>"+
							"<sessionToken>" + digToken + "</sessionToken>"+
							"<searchType>BasicSearch</searchType><criteria>&lt;Group Name='Groups'&gt;&lt;SO Fuzzy='False' FuzVal='1' Stemming='False' Phonic='False' Syn='False' SearchType='allofthewords' TextValue='" + srch + "' /&gt;&lt;/Group&gt;</criteria><sources>&lt;Sources&gt;&lt;View Name='' ResourceGuid='ea92a4a9-ccc4-4f46-aacf-2e9db5d18868' /&gt;&lt;View Name='' ResourceGuid='b26170f3-f427-4336-99d5-3dca0d5c9ad9' /&gt;&lt;/Sources&gt;</sources><searchoptions>&lt;Options StartRecd='0' NumRecdsperView='20' ServerTimeout='300' GetOnlyMappedColumns='false' GetOnlyCount='True' ShowWordList='false' IndexProfile='default' /&gt;</searchoptions>" + 							
							"</DIG_x0020_Search>"+
							"</soap:Body>"+
							"</soap:Envelope>";
		xmlHttpReq.send(soapRequest);
		return false;
		
	},
	
	bldDSTree:function(dsMap,msgMap,srch){
		this.rsdsTree = Ext.create('Ext.tree.Panel', {
					height:500,
					autoHeight:true,
					autoRender:true,
					border:0,
					id:'rsdstree',
					scope:this
				});	
		this.rsdsTree.setRootNode({
				    text: 'All DIG Servers',
				    expanded: true
				});   
		var dsRoot = this.rsdsTree.getRootNode();		
		
		for(var i=0; i < dsMap.length; i++){
			var dsRaw = dsMap.get(i);
			var dsName = dsRaw.substring(0, dsRaw.indexOf('.'));			
			var dsQry = dsRaw.substring(dsRaw.indexOf('.')+1);			

			var msgRaw = msgMap.get(i);
			var cnt = msgRaw.substring(msgRaw.indexOf(':') + 1);

			var cNode = dsRoot.appendChild({id:dsName, text:dsName, leaf:false});			
			var qNode = cNode.appendChild({id:dsQry, text:dsQry + ' <b>[' + cnt + ']</b>', leaf:true});
			
		}
		this.rsdsTree.expandAll();
		this.rsdsTree.on('itemclick', function(view, record, item, index, event){	
			
			var nodeName = record.data.text;
			var dsQry = record.data.id;

			var rpanel = Ext.getCmp('resultPanel');
			var rsGrid = Ext.getCmp('resultgrid');
			rpanel.remove('resultgrid', true);
			rpanel.remove('datastore', true);
			rpanel.doLayout();
	
			Ext.fly('resultgriddiv').update('');
			
			var rsrcGuid = DIGGlobal.guidGrp.getByKey(dsQry);
			var digSrch = new DIGSearch();
			digSrch.getGridXml(rsrcGuid,srch,dsQry,0,20, true);
		});
		this.rsdsTree.doLayout();
		return this.rsdsTree;
	},
	
	getGridXml:function(guid,srch,dsqry,startrec,pagesize,newgrid){
		var digToken = GetCookie("sessionToken");
		
		
	        xmlHttpReq = new XMLHttpRequest();	         
		xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/DIGInterface.asmx",true);
		xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
		xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/DIGInterface/DIG Search");
		xmlHttpReq.onreadystatechange=function(){
			if(xmlHttpReq.readyState == 4){		
				if(xmlHttpReq.status == 200){
					      var response = xmlHttpReq.responseXML.documentElement;
					      var xml = response.getElementsByTagName('DIG_x0020_SearchResult')[0].firstChild.data;
					      
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
		
		//if(startrec == 0)startrec = 1;
		
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
		return false;
		
		
	},
	
	parseDocXml:function(xml,dsQry,guid,srch){
		Ext.fly('summarydiv').update('');
		var docTitle = $(xml).find('DocTitle').text();
		var docExt = $(xml).find('Extension').text();
		var docAddr = $(xml).find('DocAddress').text();
		var fileName = $(xml).find('FileName').text();
		var hits = $(xml).find('Hits').text();
		var hitCount = $(xml).find('HitCount').text();
		var score = $(xml).find('Score').text();
		var dsc = $(xml).find('Description').text();
		var inContext = $(xml).find('HitsInContext').text();
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
		
		html = '<div style=padding:20px;width:600px;text-align:left>Document ID: ' + docID + '<br><br>' + 
		       "<a href=javascript:getDSDocXml('" + docID + "','" + hits + "','" + score + "','" + findexPath + "','" + fdocTitle + "','" + rsrcGuid + "');>HTML</a><br><br>" + 
		       '<br>' + '<font style="font-size:12px;font-weight:bold;">File Information & Scoring</font><br>' +
				'Score: ' + score + '&nbsp;&nbsp;Hits:' + hits + '<br><br>' + 
				docTitle + '<br><br>' + 
				'Document Summary & Highlighted search items<br><br>' + 
				inContext + '<br><br></div>';
/*
		var rspanel = Ext.getCmp('resultPanel');	       		
		rspanel.add({'html' : html, border:0});
		rspanel.doLayout();
*/
		Ext.fly('resultgriddiv').update(html);
		var rspanel = Ext.getCmp('resultPanel');	       		
		rspanel.doLayout();
		
				
	},
	
	parseGridXml:function(xml,dsQry,guid,srch,newgrid){
		
		Ext.fly('summarydiv').update('');
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
						if(nodeName != 'DIGMetaData'){
							newXml += '<' + nodeName + '>' + val + '</' + nodeName + '>\n';							
						}else if(nodeName == 'DIGMetaData'){
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
							
						}
					});
					newXml += '</' + dsQry + '>\n';
				}
			});

		});
		newXml += '</NewDataSet>';
		nxml = $.parseXML(newXml);
		
	    	var rpanel = Ext.getCmp('resultPanel');
	    	var rsGrid = Ext.getCmp('resultgrid');
	    	if(rsGrid != undefined && newgrid == true){
			//remove grid/data store explicitly before adding a new instance.
			rpanel.remove('resultgrid', true);
			rpanel.remove('datastore', true);
			rpanel.doLayout();
	    	}

	    	var arrParentNodes = new Array();
	    	var arrCols = new Array();
	    	var cntr = 0;
	    	$(xml).find('NewDataSet').each(function(){
			$(this).children().each(function(){
				var parentNodeName = (this).nodeName;			    		
				if(arrParentNodes.indexOf(parentNodeName) == -1 && parentNodeName != 'xs:schema'){
					arrParentNodes.push(parentNodeName);
					cntr++;
					$(this).children().each(function(){		    				
						arrCols.push(parentNodeName + ':' + this.nodeName);
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
				fieldsCol.push(colName);
				if(colName == 'DIGMetaData'){
					gridCols.push({
						text:'HTML',
						flex:1,
						dataIndex:colName,
						sortable:true,
						renderer:getDoc
					});
				}else{
					gridCols.push({
						text:colName,
						flex:1,
						dataIndex:colName,
						sortable:true,
						renderer:columnWrap
					});
				}
	
			}
	    	}
	    	function getDoc(val){

	    		var arrval = val.split('|');
	    		var serverName = arrval[0];
	    		var docTitle = arrval[1];
	    		var indexPath = arrval[2];
	    		if(indexPath.indexOf("\\") != -1){
	    			indexPath = indexPath.replace(/\\/g, '^');
	    		}
	    		var hits = arrval[3];
	    		var rsrcguid = arrval[4];
	    		var docid = arrval[5];
	    		var jsfunc = "javascript:getDocXml('" + serverName + "','" + docTitle + "','" + indexPath + "','" + hits + "','" + rsrcguid + "','" + docid + "');";
	    		var jsLink = '<a href="' + jsfunc + '">Link</a>';
	    		
	    		return jsLink;
	    	
	    	}
	    	
		function columnWrap(val){
		    return '<div style="white-space:normal !important;">'+ val +'</div>';
		}
	    	
	    	xml = nxml;
	    	if(newgrid){
			this.bldGrid(xml,dsQry,fieldsCol,gridCols,guid,srch);	
		}else{
			this.refreshGrid(xml,dsQry,fieldsCol,gridCols,guid);
		}
	},
	
	refreshGrid:function(xml,dsQry,fieldsCol,gridCols,guid,srch){	
		
		var rsGrid = Ext.getCmp('resultgrid');
		var gridStore = rsGrid.getStore();
		
		var currPage = gridStore.currentPage;
		var startCnt = currPage * 20;
		
		var myStore = Ext.create('Ext.data.Store', {			
			//autoLoad: true,			
			pageSize:20,
			data:xml,
			id:'str',
			fields:fieldsCol,
			remoteSort:true,
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
	
	bldGrid:function(xml,dsQry,fieldsCol,gridCols,guid,srch){		
	    	// create the Data Store	    	
	    	var rpanel = Ext.getCmp('resultPanel');	    	
	    	var store = Ext.create('Ext.data.Store', {			
			//autoLoad: true,			
			pageSize:20,
			data:xml,
			id:'datastore',
			fields:fieldsCol,
			remoteSort:true,
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

	    	// create the grid
	    	var grid = Ext.create('Ext.grid.Panel', {
			id:'resultgrid',
			store: 'datastore',
			columns: gridCols,	
			autoScroll:true,
			width: 960,				
			border:0,
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
						dgsrch.getGridXml(guid,srch,dsQry,startrec,pagesize,false);
						
					}
				/*
					'beforechange':function(){
						//call getGridXml with new start record...
						var currPage = store.currentPage;	
						
						var startrec = currPage * 20;	
						var totalcount = store.getTotalCount();
						
						if(startrec > totalcount){
							currPage = currPage - 1;
							startrec = (currPage - 1) *20;
						}
						var pagesize = 20;
						
						var dgsrch = new DIGSearch();
						dgsrch.getGridXml(guid,srch,dsQry,startrec,pagesize,false);
					}
				*/					
				}
			})
	    	});
	    	
	    	store.load({start:0});
	    	
	    	rpanel.add(grid);
	    	rpanel.doLayout();
	}
});