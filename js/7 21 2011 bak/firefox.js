/* DIG Namespace */
Ext.namespace('DIG');
Ext.require(['*']);

/*
DIGGlobal - class for global definitions
@author Ritesh Patel
@version 1.0
@date 6/2011
*/
Ext.define('DIGGlobal', {
	singleton: true,
	formWindow: '',
	activeFormName: '',
	//form initialization for Fields tab
	fieldForm:new Ext.form.Panel({		
		defaultType:'textfield',
		renderTo:Ext.getBody(),
		border:0
	}),
	//form initialization for Search tab
	searchFrm: new Ext.form.Panel({
		name:'SearchFrm',
		autoHeight:true,	
		bodyPadding: 5,
		autoScroll:true,
		border:0,
		defaults:{
			labelWidth:200
		}			
	}),	
	
	//Accordion menu
	accMenu: new Ext.panel.Panel({
		width: 300,
		height: 300,
		layout:'accordion',
		animate:true,
		defaults: {
			// applied to each contained panel
			bodyStyle: 'padding:15px'
		},
		layoutConfig: {
			// layout-specific configs go here
			titleCollapse: false,
			animate: true,
			activeOnTop: true
		},
		items: [{
			title: 'DIG SERVER HEALTH',
			html: 'Shows DIG Server Health!'
		},{
			title: 'VIEWS',
			html: 'Control for enabling/disabling views'
		},{
			title: 'REMOTE SERVERS',
			html: 'Control for enabling/disabling remote servers'
		},{
			title: 'DEFAULT USER SETTINGS',
			html: 'Displays default user settings'
		},{
			title: 'CHANGE PASSWORD',
			html: 'Changes user password'
		}
		
		]		
	}),	
	
	globalForm: new Ext.form.Panel({
		autoHeight:true,
		width:500,
		margin:'50 0 0 0',
		bodyPadding:10,
		border: 0,
		defaults:{
			anchor: '100%',
			labelWidth:100
		},
		items:[{
			xtype: 'textfield',
			name: 'search',
			allowBlank: false,
			width:'70%',
			fieldLabel: 'Search'
		},
		{
			xtype:'button',
			text:'Search',
			anchor:'10%',
			style:{
				float:'right'
			},
			handler:function(){
				alert('You clicked search');
			}
		}]
	}), 	
	
	labelMap: new Ext.util.MixedCollection(),
	fldMap: new Ext.util.MixedCollection(),
	formMap: new Ext.util.MixedCollection(),
	/* Data Source Collection Variables */	
	digServers: new Array(),//stores DIG Server Names
	dsMap: new Ext.util.MixedCollection(),//stores DIG Data Sources	
	qryGrp: new Array(),//stores DIG Query Groups
	qryGrpNameArr: new Array(),//stores DIG Query Group Names
	//data source fields collection
	dsFields: new Ext.util.MixedCollection(),//stores fields by Data Source and Query Group	
	
	dsTree: new Ext.tree.Panel({
			height:500,
			autoHeight:true,
			autoRender:true,
			border:0,
			id:'dstree'
		})
	
});

Ext.define('FormParser',{
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
					var response = xmlHttpReq.responseXML.documentElement;
					var xml = response.getElementsByTagName('GetFormResult')[0].firstChild.data;

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
					var labelArray = new Array();
					var ctlArray = new Array();
					var ctlnameArray = new Array();
					var srchArray = new Array();
					var valArray = new Array();
					var idArray = new Array();
					  
					var ele = xmlDoc.documentElement;			
					var child = ele.childNodes;
					for(var i=0; i < child.length; i++){
						var childname = ele.childNodes[i].nodeName;
						
						var ctlchild = ele.childNodes[i].childNodes;
						for(var c = 0; c < ctlchild.length; c++){
							var rowname = ctlchild[c].nodeName;
							if(rowname == 'Row'){
								var rowchild = ctlchild[c].childNodes;
								for(var r=0; r < rowchild.length; r++){
									var rcname = rowchild[r].nodeName;
									if(rcname == 'Control'){
										var attr = rowchild[r].attributes;
										if(attr.length == 3){
											var labelid = rowchild[r].getAttribute("ID");
											var val = rowchild[r].getAttribute("Value");
											labelArray.push(val);
											
											//extJs Collection
											DIGGlobal.labelMap.add(labelid,val);
										}else if(attr.length == 9){
											var ctltype = rowchild[r].getAttribute("Type");
											ctlArray.push(ctltype);
											var srchtype = rowchild[r].getAttribute("SearchObjectName");
											srchArray.push(srchtype);
											var ctlval = rowchild[r].getAttribute("Value");
											valArray.push(ctlval);
											var str = ctltype + '|' + srchtype + '|' + ctlval;
											var id = rowchild[r].getAttribute("ID");										
											idArray.push(id);
											DIGGlobal.fldMap.add(id,str);										
										}
									}
								}
							}
						}
					}	
					var fldcnt = DIGGlobal.fldMap.getCount();
					var lblcnt = DIGGlobal.labelMap.getCount();
					for(var i=0; i < fldcnt; i++){
						var label = DIGGlobal.labelMap.get(i);
						var fldname = DIGGlobal.fldMap.get(i);
						
						var keys = DIGGlobal.fldMap.keys;
						var fldid = keys[i];
						//alert(label + ' ' + fldid + ' ' + fldname);
					}	
					
					
					DIGGlobal.searchFrm = new Ext.form.Panel({
						name:'SearchFrm',
						autoHeight:true,	
						bodyPadding: 5,
						autoScroll:true,
						border:0,
						defaults:{
							labelWidth:200
						}			
					});					
					var fld = '';
					//dynamically adding forms (this should come from parsed XML)

					for(var i=0; i < fldcnt; i++){
						var labelName = DIGGlobal.labelMap.get(i);
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
										allowBlank:false
									});
									DIGGlobal.searchFrm.add(fld);									
									break;
								case "DatePicker":
								    fld = new Ext.form.Date({
										fieldLabel:labelName,
										allowBlank:false
									});
									DIGGlobal.searchFrm.add(fld);
									break;
								case "DropDownList":
									fld = new Ext.form.ComboBox({
										store:ds,
										displayField:'name',
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
						handler:function(){
							alert('Perform Search!');
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
								margin:'0 0 0 0',
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
	}
});

Ext.define('XMLDSParser',{
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
					var response = xmlHttpReq.responseXML;
					var xmlRaw = response.getElementsByTagName('DIGSourcesXML');
					var xml = xmlRaw.item(0).firstChild.nodeValue;
					var arr = new Array();
					var doc;
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
					for(var x=0; x < ssLen; x++){
						var serverName = ssChildren[x].nodeName;
						alert(serverName);
					}					
					
					DIGGlobal.dsTree.setRootNode({
					    text: 'All DIG Servers',
					    expanded: true
					});    

					var dsRoot = DIGGlobal.dsTree.getRootNode();	

					for(var d=0; d < DIGGlobal.dsMap.length; d++){
						var dsRaw = DIGGlobal.dsMap.get(d);
						var dsServer = dsRaw.substring(0, dsRaw.indexOf(':'));
						var dsName = dsRaw.substring(dsRaw.indexOf(':') + 1);

						if(dsName != null){
							dsRoot.appendChild({text:dsName, leaf:true, checked:true});
						}
					}
					
					DIGGlobal.dsTree.doLayout();					
					
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

Ext.define('XMLParser', {
	getFormsXML: function(){
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


DIG.bldSearchTabs = function(){
	var fieldsLayoutPanel = Ext.create('Ext.panel.Panel', {
		width:875,
		height: 550,
		layout: 'border',
		margin:'20 10 0 10',
		frame:true,
		autoScroll:true,
		items: [{
		    // xtype: 'panel' implied by default
		    title: 'DIG Forms',
		    region:'west',
		    xtype: 'panel',
		    margin: '0 0 0 0',
		    width: 200,
		    collapsible: true,   // make collapsible
		    id: 'fields-west',
		    items:[DIGGlobal.fieldForm],
		    listeners:{
			'render':function(tab){
				var xmlP = new XMLParser();
				xmlP.getFormsXML();

			}
		    }

		},{
		    title: '',
		    region: 'center',     // center region is required, no width/height specified
		    xtype: 'panel',
		    layout: 'fit',
		    margin: '0 0 0 0',
		    autoScroll:true,
		    id:'fields-center',
		    html:'<div id="formdiv"></div>'
		},{
		    // xtype: 'panel' implied by default
		    title: 'Data Sources',
		    region:'east',
		    xtype: 'panel',
		    margin: '0 0 0 0',
		    width: 250,		    
		    collapsible: true,   // make collapsible
		    id: 'fields-east',
		    items:DIGGlobal.dsTree
		}]
	    });

 	
	var globalLayoutPanel = new Ext.panel.Panel({
		width: 800,
		height: 400,
		layout: 'border',
		margin:'20 0 0 20',
		frame:true,		
		items: [{
		    title: '',
		    region: 'center',     // center region is required, no width/height specified
		    xtype: 'panel',
		    layout: 'fit',
		    margins: '0 0 0 0',
		    //html:'Search Form goes here...'
		    items:[DIGGlobal.globalForm]		   
		},{
		    // xtype: 'panel' implied by default
		    title: 'Data Sources',
		    region:'east',
		    xtype: 'panel',
		    margins: '0 0 0 0',
		    width: 250,
		    collapsible: true,   // make collapsible
		    id: 'east-region-container',
		    html:'<div id="treediv"></div>',
		    listeners:{
		    	'render':function(tab){
				var xmlD = new XMLDSParser();
				xmlD.getDSXml();

			}
		    }
		    //html:'Data Sources go here'
		}]
	    });
 		
	/*
		Main Tabs 
		Creates Search & Results Tabs with sub tab interface
	*/
	var tabs = new Ext.tab.Panel({
		id:'main-tabs',
		renderTo:'tabscontainer',
		height:650,
		width:900,
		activeTab:0,
		tools:[{
			id:'gear',
			handler:function(){
				Ext.create('Ext.window.Window', {
					title: 'DIG Settings',
					height: 200,
					width: 400,
					layout: 'fit',
					animateTarget:'gear',
					closeAction:'hide',
					items:[DIGGlobal.accMenu]					
				}).show();
			}
		}],		
		items:[{
			xtype:'tabpanel',
			title:'Search',
			activeTab:0,
			layoutOnTabChange:true,			
			items:[
				{title:'Global', id:'globaltab', autoScroll:true, minHeight:400,
					items:[globalLayoutPanel]},
				{title:'Fields', border:0, maxHeight:800, minHeight:600, autoScroll:true, id:'fieldtab', items:[fieldsLayoutPanel]},
				{title:'Batch', id:'batchtab'},
				{title:'Alerts', id:'alerttab'}
			],
			listeners:{
				'tabchange':function(panel,tab){
					if(tab.id == 'globaltab'){
						var pnl = Ext.getCmp('east-region-container');
						pnl.add(DIGGlobal.dsTree);
						pnl.doLayout();
					}else if(tab.id == 'fieldtab'){
						var pnl = Ext.getCmp('fields-east');
						pnl.add(DIGGlobal.dsTree);
						pnl.doLayout();
					}
				}
			}
		},
		{
			title:'Results',
			id:'resultstab'
		}]
	});

}
Ext.onReady(function(){
	DIG.bldSearchTabs();
	var xmlD = new XMLDSParser();
	xmlD.getDSXml();
	Ext.getCmp('dstree').render('treediv');	
});
