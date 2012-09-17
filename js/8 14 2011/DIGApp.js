Ext.define('DIGApp',{
	extend:'Ext.panel.Panel',
	renderTo:'tabscontainer',
	width:960,
	height:600,
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
			}],		
			items:[
			        {
					title:'Search',
					xtype:'SearchTabs',
					id:'searchtab'
				},{
					title:'Results',
					id:'resultstab',
					xtype:'Results'
				}
			      ],
			listeners:{
				'tabchange':function(panel,tab){
					if(tab.id == 'searchtab'){
						var rpanel = Ext.getCmp('resultPanel');
						Ext.fly('summarydiv').update('');
						if(rpanel != null){
							var grid = Ext.getCmp('resultgrid');
							
							DIGGlobal.rcrdCount.length = 0;
							rpanel.remove('resultgrid');
							rpanel.doLayout();
						}
					}
				}
			}			      
		});
		return this.maintabs;
	},
	
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
	
});