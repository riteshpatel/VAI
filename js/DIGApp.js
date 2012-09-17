/**
@class DIGApp
@author Ritesh Patel for VAI
@version 1.0
@last-modified 01/26/2012
* Class to initialize application (gets called from dig.html)
* This project is now on GIT (9/17/2012).
*/
Ext.define('DIGApp',{
	extend:'Ext.container.Viewport',
	renderTo:'tabscontainer',
	layout:'fit',
	initComponent:function(){
		Ext.apply(this,{
			padding:5,			
			items:[this.mainTabs()]			
		});
		this.callParent(arguments);
	},	
	mainTabs:function(){
		this.maintabs = Ext.create('Ext.tab.Panel',{
			id:'mainTabs',	
			layout:'fit',
			tools:[{
				id:'gear',
				scope:this,
				handler:function(){
					Ext.create('Ext.window.Window', {
						title: 'DIG Settings',
						height: 200,
						width: 400,
						layout: 'fit',
						animateTarget:'gear',
						closeAction:'hide',
						items:[this.createAccordionMenu()]					
					}).show();
				}
			},
				{
					id:'logout',
					scope:this,					
					handler:function(){
						if(confirm('You will be logged out of the system. Do you wish to proceed?')){						
							digLogout();
						}							
					}
				}],		
			
			items:[
			        {
					title:'Search',
					xtype:'SearchTabs',
					id:'searchtab'			
					
				},{
					title:'Results',
					id:'resultstab',
					//xtype:'Results'
					layout:'border',
					items:[
						{
							region:'east',
							collapsible:true,
							id:'results-east',
							autoScroll:true,
							title:'All Results',
							width:250,
							height:600,
							autoScroll:true

					       },
					       {
							region:'center',
							collapsible:false,
							id:'resultscenter',
							layout:'fit',
							autoHeight:true,
							autoScroll:true,							
							html:'<div id="summarydiv" style="margin:0 auto;text-align:center"></div>',
							items:[{
								xtype:'tabpanel',
								layout:'fit',
								tabPosition:'bottom',
								id:'resultsMainTabs',
								frameHeader:false,
								resizable:true,
								items:[{
									title:'Search Summary',
									id:'searchSummaryTab',
									autoScroll:true
								},{
									title:'Search Results',									
									id:'searchResultsTab',
									layout:'fit',
									html:'<div id="htmldiv"></div>'
								}]
								
							}]
					       }
						
					]
				}
			      ],
			listeners:{
				'tabchange':function(panel,tab){
					if(tab.id == 'searchtab'){
						var summaryTab = Ext.getCmp('searchSummaryTab');
						summaryTab.removeAll();
						
						
						var rsGrid = Ext.getCmp('resultgrid');						
						if(rsGrid){
							rsGrid.destroy();
						}
						Ext.fly('summarydiv').update('');
						
						var rscntr = Ext.getCmp('resultscenter');		
						rscntr.remove(Ext.getCmp('summaryacc'));
						DIGGlobal.rcrdCount = [];
						DIGGlobal.rcrdView = [];
						DIGGlobal.dsFields.clear();
					}
				}
			}			      
		});
		
		return this.maintabs;
	},
	
	/**
		createAccordionMen()
		Creates an accordion menu
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