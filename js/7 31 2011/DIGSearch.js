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
					      var acc = dgs.bldDSTree(this.dsMap,this.msgMap);
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
	
	bldDSTree:function(dsMap,msgMap){
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
			//Ext.fly('summarydiv').update('');
			var nodeName = record.data.text;			
			alert(nodeName);
		});
		this.rsdsTree.doLayout();
		return this.rsdsTree;
	}
});