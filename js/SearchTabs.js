/*
@class SearchTabs.js
@author Ritesh Patel for VAI
@version 1.0
@last-modified 02/12/2012
* SearchTabs Class: Builds tabs required for the Global Search / Forms Search / Alerts (disabled) / Batch (disabled)
*/
Ext.define('SearchTabs', {
	extend:'Ext.tab.Panel',
	alias:'widget.SearchTabs',
	layout:'fit',
	initComponent:function(){//initialize component
		//build Global Tabs
		Ext.apply(this, {
			items:[{
					title:'Global',
					id:'globaltab',
					items:[this.createGlobalPanel()]
			       },
			       {
			       		title:'Fields',
			       		id:'fieldstab',
			       		items:[this.createFieldsPanel()]
			       },
			       {
			       		title:'Alerts',
			       		disabled:true
			       },
			       {
			       		title:'Batch',
			       		disabled:true
			       }],			       
				listeners:{
					'tabchange':function(panel,tab){
						
						if(tab.id == 'globaltab'){
							var pnl = Ext.getCmp('global-east');
							pnl.add(DIGGlobal.dsTree);
							pnl.doLayout();
						}else if(tab.id == 'fieldstab'){
							var pnl = Ext.getCmp('fields-east');
							pnl.add(DIGGlobal.dsTree);
							pnl.doLayout();
						}
					}
				}
		});
		this.callParent(arguments);
	
	},
	
	/**
		createFieldsPanel()
		Create a Border Layout for Forms interface
		West: Listing of forms
		Center: Form fields
		East: Data Sources
	*/
	createFieldsPanel:function(){
		this.fldPanel = Ext.create('Ext.panel.Panel',{
			layout:'border',			
			width:'100%',
			height:'100%',
			autoScroll:true,
			items:[
				{
					region:'west',
					collapsible:true,
					split:true,
					title:'DIG Forms',
					width:'30%',
					items:[this.createFieldsListing()]
				},
				{
					region:'center',
					collapsible:false,						
					split:true,
					html:'<div id="formdiv"></div>',
					autoScroll:true,
					items:[this.createRenderPanel()]
				},
				{
					region:'east',
					collapsible:true,
					split:true,
					width:'30%',
					id:'fields-east',
					height:600,
					autoScroll:true,
					title:'All Data Sources',
					items:[this.createDSTree()]
				}
			      ]
		});
		return this.fldPanel;
	},

	/**
		createDSTree() -- should be returnDSTree (will change it in version 2.0)
		returns Data Source Tree
	*/
	createDSTree:function(){
		return DIGGlobal.dsTree;
	},
	
	/**
		createGlobalPanel()
		Function to create content for a Global Panel
		West: Search History (cookie based)
		Center: Actual Search Form
		East: Data Sources
	*/
	createGlobalPanel:function(){
		this.gbPanel = Ext.create('Ext.panel.Panel',{
			layout:'border',
			padding:0,						
			width:'100%',
			height:'100%',
			autoScroll:true,
			border:0,
			items:[
				{
					region:'west',
					collapsible:true,
					split:true,
					title:'Search History',
					width:'30%',
					layout:'fit',
					items:[this.bldHistory()]
				},{
					region:'center',
					collapsible:false,
					split:true,					
					bodyStyle:{
						"background-color":'#ffd622'
					},
					items:[this.createGlobalForm(),
					{				
						//html:'<div style="background-color:#FFD622;width:40%;height:200px;text-align:left;border:1px solid #fff;position:relative"><img src="images/fingerprint.png" align="absbottom" style="float:right;position:absolute;bottom:0"></div><div style="position:relative;background-color:#FFD622;float:left;width:30%;height:200px;text-align:right;border:1px solid #fff;"><img src="images/pagecorner.png" style="float:right;" align="absbottom"></div>',
						//html:'<table width="100%" style="position:relative"><tr><td align=left style="background-color:#FFD622"><img src="images/fingerprint.png" align="absbottom" style="float:left"><img src="images/pagecorner.png" align="absbottom" style="float:right"></td></tr></table>',
						border:0,
						html:'<div style="float:left;text-align:left;background-color:#FFD622;width:40%;height:130px;"><img src="images/fingerprint.png" border="0" style="background-color:#FFD622" align="absbottom"></div><div style="float:left;text-align:right;background-color:#FFD622;width:60%"><img src="images/pagecorner.png" border="0" style="background-color:#FFD622" align="absbottom"></div>',
						anchor:'100%'
					}]
				},
				{
					region:'east',
					collapsible:true,
					split:true,
					width:300,					
					height:600,
					autoScroll:true,
					id:'global-east',		
					loadMask:true,
					html:'<div id="treediv"></div>',
					title:'All Data Sources',
					listeners:{
					   'render':function(tab){					   	   
					   	   this.items.add(DIGGlobal.dsTree);					   					   	   
					    }
					}					    
				}
			      ]
		});
		
		return this.gbPanel;
	},
	
	/**
		bldHistory()
		Function to build cookie based search history
	*/
	bldHistory:function(){
		this.histVal = $.cookie('hist');
		var singleValue = false;
		if(this.histVal.indexOf(",") != -1){
			this.arrVal = this.histVal.split(',');
			
		}else{
			this.arrVal = this.histVal;
			singleValue = true;
		}
		
		//build JSON string for feeding it to the grid data source
		jsonData = '[';
		if(this.histVal == '0'){
			jsonData += '{"history":"No history found"}';
		}else{
			if(singleValue){
				jsonData += '{"history":' + this.histVal + '}';
			}else{
				for(var i=0; i < this.arrVal.length; i++){
					var tmpVal = this.arrVal[i];					
					if(i == 0){
						jsonData += '{"history":' + tmpVal + '}';
					}else{
						jsonData += ',{"history":' + tmpVal + '}';
					}
				}
			}
		}
		jsonData += ']';
		
		jsonData = jQuery.parseJSON(jsonData);
		
		this.histModel = Ext.define('History',{
			extend: 'Ext.data.Model',
				fields: [
					{name:'history'}
				]		
		});
		
		this.store = Ext.create('Ext.data.Store', {			
			model:'History',
			data:jsonData,
			autoDestroy:true
		});
	
		this.pnl = Ext.create('Ext.grid.Panel', {
			store: this.store,
			autoScroll:true,
			layout:'fit',
			frame:false,
			id:'histgrid',
			columns: [
				{
					flex     : 1,
					sortable : true,
					dataIndex: 'history'
				}
			],
			tbar:[{
				xtype:'button',
				text:'Clear History',
				scope:this,
				iconCls:'icon-clear',
				handler:function(){
					var row = this.pnl.getStore().getAt(0);					
					var val = row.get('history');
					if(val == 'No history found'){
						alert('No history found');
					}else{
						$.cookie('hist', '0', {expires:365, path:'/'});						
						this.store.removeAll();
						this.store.sync();
						var r = Ext.create('History',{
							'history':'No history found'
						});
						this.store.add(r);
						
						
					}
				}			
			}]
		});

		this.pnl.on('itemclick', function(view, record, item, index, event){
			var srchItem = record.get('history');
			var fld = Ext.getCmp('search');
			fld.setValue(srchItem);
		});
		return this.pnl;
	},
	
	/**
		createGlobalForm()
		Builds global search form
	*/
	createGlobalForm:function(){
		var win;
		var clarityCmp = new Ext.Component({
			autoEl:{tag:'img', src:'assets/dataclaritysearch.jpg'}
		});
		
		this.globalForm = Ext.create('Ext.form.Panel',{
			autoHeight:true,
			width:500,			
			bodyPadding:10,
			border: 0,
			height:'70%',
			id:'searchfrm',
			style:'margin: 5px auto 50px auto',
			defaults:{
				//anchor: '100%',
				labelWidth:100
			},
			bodyStyle:{
				"background-color":'#ffd622'
			},			
			items:[{
			
				//html:'<div style="width:500px;background-color:#FFD622;border:0;margin:0;padding:0"><font style="font-size:18pt;color:#000;background-color:#FFD622">Data Clarity Search</font></div>',
				html:'<div style="text-align:center;width:100%;background-color:#ffd622;"><img src="images/dataclaritysearch.jpg" style:"margin-left:auto;margin-right:auto;"></div>',				
				anchor:'102%',
				border:0,
				height:'50px',
				style:'background-color:#FFD622'
				
			},
			
			{
				xtype: 'textfield',
				name: 'search',
				id:'search',
				allowBlank: false,
				style:'font-weight:bold',
				size:'90%',
				anchor:'100%',
				style:'margin-top:60px',
				//anchor:'100%',
				listeners:{
					scope:this,
					specialkey:function(f,o){
					    if(o.getKey()==13){
					    	this.globalSearch();
					    }
					}
				}	
			},
			{
				xtype:'button',
				text:'SEARCH',
				anchor:'100%',
				
				scope:this,
				id:'srchbtn',
				cls:'x-btn-right',
				style:'font-weight:bold',
				handler:function(){
					this.globalSearch();										
					
				}
			},			
			
			/* advanced search */
			{
				
				xtype:'fieldset',
				id:'fldset',
				title:'Search Options',
				collapsible:true,
				style:'margin-top:70px',
				defaults: {
				    labelWidth: 89,
				    anchor: '100%',
				    layout: {
					type: 'hbox',
					defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
				    }
				},				
				items:[{
					xtype: 'checkboxgroup',					
					// Arrange radio buttons into two columns, distributed vertically
					vertical: false,
					id:'srchgrp',
					items: [
					    { boxLabel: 'Phonetic', id:'phonetic', name: 'rb', inputValue: '0'},
					    { boxLabel: 'Synonyms', id:'syn', name: 'rb', inputValue: '0'},				    
					    { boxLabel: 'Stemming', id:'stem', name: 'rb', inputValue: '0' },
					    { boxLabel: 'Fuzzy', id:'fuzzy', name: 'rb', inputValue: '0',
							handler:function(){										
									if(this.value){
										if(win == null){
											win = Ext.create('Ext.window.Window', {
												title:'You must select Fuzzy Value',
												closable:true,
												id:'fuzzywindow',
												closeAction:'hide',											
												width:100,
												height:260,
												xtype:'radiogroup',
												animateTarget:'fuzzy',
												items:[
													{xtype:'radio',name:'rdo',inputValue:'1',boxLabel:'1',style:'padding-left:5px',listeners:{change:function(cb,newval,oldval,opts){if(newval){Ext.getCmp('fuzzytxt').setValue(cb.inputValue);win.hide();}}}},
													{xtype:'radio',name:'rdo',inputValue:'2',boxLabel:'2',style:'padding-left:5px',listeners:{change:function(cb,newval,oldval,opts){if(newval){Ext.getCmp('fuzzytxt').setValue(cb.inputValue);win.hide();}}}},
													{xtype:'radio',name:'rdo',inputValue:'3',boxLabel:'3',style:'padding-left:5px',listeners:{change:function(cb,newval,oldval,opts){if(newval){Ext.getCmp('fuzzytxt').setValue(cb.inputValue);win.hide();}}}},
													{xtype:'radio',name:'rdo',inputValue:'4',boxLabel:'4',style:'padding-left:5px',listeners:{change:function(cb,newval,oldval,opts){if(newval){Ext.getCmp('fuzzytxt').setValue(cb.inputValue);win.hide();}}}},
													{xtype:'radio',name:'rdo',inputValue:'5',boxLabel:'5',style:'padding-left:5px',listeners:{change:function(cb,newval,oldval,opts){if(newval){Ext.getCmp('fuzzytxt').setValue(cb.inputValue);win.hide();}}}},
													{xtype:'radio',name:'rdo',inputValue:'6',boxLabel:'6',style:'padding-left:5px',listeners:{change:function(cb,newval,oldval,opts){if(newval){Ext.getCmp('fuzzytxt').setValue(cb.inputValue);win.hide();}}}},
													{xtype:'radio',name:'rdo',inputValue:'7',boxLabel:'7',style:'padding-left:5px',listeners:{change:function(cb,newval,oldval,opts){if(newval){Ext.getCmp('fuzzytxt').setValue(cb.inputValue);win.hide();}}}},
													{xtype:'radio',name:'rdo',inputValue:'8',boxLabel:'8',style:'padding-left:5px',listeners:{change:function(cb,newval,oldval,opts){if(newval){Ext.getCmp('fuzzytxt').setValue(cb.inputValue);win.hide();}}}},
													{xtype:'radio',name:'rdo',inputValue:'9',boxLabel:'9',style:'padding-left:5px',listeners:{change:function(cb,newval,oldval,opts){if(newval){Ext.getCmp('fuzzytxt').setValue(cb.inputValue);win.hide();}}}},
													{xtype:'radio',name:'rdo',inputValue:'10',boxLabel:'10',style:'padding-left:5px',listeners:{change:function(cb,newval,oldval,opts){if(newval){Ext.getCmp('fuzzytxt').setValue(cb.inputValue);win.hide();}}}}												
												],
												listeners:{
													change:function(cb,newval,oldval,opts){
														alert(newval);
													}
												}
											});
											win.setPosition(Ext.get('fuzzy').getX() + 30);
										}
										win.show(this);	
									}else{
										win.hide(this);										
										Ext.getCmp('fuzzytxt').setValue('');
									}
								}
							
					    },{
					    	xtype:'textfield', id:'fuzzytxt', size:'5',readOnly:true
					    },{
					    	xtype:'button', text:'Select Fuzzy', handler:function(){Ext.getCmp('fuzzywindow').show();}
					    }
					]
				},
				{

				            xtype:'splitbutton',
					    text: 'All of the Words',	
					    id:'phrasebtn',
					    anchor:'30%',					    
					    menu : {					    	
						items: [{
						    text: 'Any of the Words', handler: function(){var btn = Ext.getCmp('phrasebtn');btn.setText('Any of the Words');}
						}, {
						    text: 'Exact Phrase', handler: function(){var btn = Ext.getCmp('phrasebtn');btn.setText('Exact Phrase');}
						}, {
						    text: 'Boolean', handler: function(){var btn = Ext.getCmp('phrasebtn');btn.setText('Boolean');}
						}]
					    }
									
				}]	
			    }/*,

			    
			
			
			
			{
				xtype:'button',
				text:'Search',
				anchor:'10%',
				scope:this,
				id:'srchbtn',
				cls:'x-btn-right',
				handler:function(){
					this.globalSearch();										
					
				}
			}*/			
		     ]		
		});	
		Ext.getCmp('search').focus('', 10);
		
		return this.globalForm;
	},
	
	/**
		globalSearch()
		Perform the global search (with or without advanced parameters)
	*/
	globalSearch:function(){
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

		var srch = this.globalForm.getValues().search;
		if(srch == '' || srch == null){
			Ext.Msg.alert('You must specify term to search');
		}else{
			
			//add search item to the grid dynamically
			var histGrid = Ext.getCmp('histgrid');
			var histStore = histGrid.getStore();
			var firstRec = histStore.first().get('history');
			if(firstRec == 'No history found'){
				histStore.remove(histStore.findRecord('history','No history found'));
				histStore.sync();
			}
			
			if(histStore.findRecord('history',srch) == null){
				var r = Ext.create('History',{
					'history':srch
				});
				histStore.add(r);
				
				//add search item to the cookie
				var val = $.cookie('hist');
				if(val == 0){//replace value
					$.cookie('hist', '"' + srch + '"', { expires: 365, path:'/' });
				}else{//append value	
					val = val + ',"' + srch + '"';
					$.cookie('hist', val, { expires: 365, path:'/' });
				}
				
				
			}			
			
			var dsTreeCmp = Ext.getCmp('rsdstree');
			if(dsTreeCmp != null){
				var rpanel = Ext.getCmp('results-east');
				rpanel.remove(dsTreeCmp);
			}
			
			var digsearch = new DIGSearch();//instantiate DIGSearch instance
			digsearch.parallelSearch(srch);//perform asynchronous search
		}
	},
	
	/**
		createFieldsListing()
		Create forms listing for the West Region of the Border Layout
	*/
	createFieldsListing:function(){

		this.flPanel = Ext.create('Ext.panel.Panel',{
			autoHeight:true,
			bodyPadding:10,			
			border:0,
			frame:false,
			items:[DIGGlobal.fieldForm],
   		        listeners:{
			   'render': function(){
				var xmlP = new ListParser();
				xmlP.getFormsListXML();
			}
		    }
		});
		return this.flPanel;
	},
	
	/**
		createRenderPanel()
		Panel to hold actual form (look over this code in version 2.0, should not need a nested panel here
	*/	
	createRenderPanel:function(){
		this.crPanel = Ext.create('Ext.panel.Panel',{
			autoHeight:true,	
			width:'100%',
			border:0
		});
		return this.crPanel;
	},
	
	/**
		createAccordionMenu()
		Creates Accordion Menu for top right tools icon.
		This section is on a low priority and most likely will be implemented version 2.0 onwards
	*/
	createAccordionMenu:function(){
		this.acMenu = Ext.create('Ext.panel.Panel', {
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
		});
		return this.acMenu;
	}
	
	
});//end Class