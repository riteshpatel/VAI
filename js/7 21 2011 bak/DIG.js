Ext.define('DIG.App', {
	extend: 'Ext.tab.Panel',    
	initComponent: function(){
		Ext.apply(this, {
			id:'main-tabs',
			renderTo:'tabscontainer',
			height:650,
			width:960,
			activeTab:0,
			items:[{
				xtype:'tabpanel',
				title:'Search',
				items:[
					{title:'Global', id:'globaltab', autoScroll:true, minHeight:400,items:[this.createGlobalPanel()]},
					{title:'Fields', border:0, maxHeight:800, minHeight:600, autoScroll:true, id:'fieldtab', items:[this.createFieldsPanel()]},
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
			},{
				title:'Results'
			}]

		});
		this.callParent(arguments);
    	},
    	
    	createFieldsPanel:function(){
		this.fieldsPanel = Ext.create('Ext.panel.Panel', {
			width:955,
			height: 590,
			layout: 'border',
			margin:'0 0 2 2',
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
			    	'render': function(){
					var xmlP = new ListParser();
					xmlP.getFormsListXML();
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
			    items:[DIGGlobal.dsTree]
			}]
	    });
	    return this.fieldsPanel;
    	},    	
    	
    	createGlobalPanel:function(){    		
    		this.globalPanel = Ext.create('Ext.panel.Panel', {
			width: 955,
			height: 590,
			anchor:'fit',
			layout: 'border',
			margin:'0 0 2 2',
			frame:true,		
			items: [{
			    title: '',
			    region: 'center',     // center region is required, no width/height specified
			    xtype: 'panel',
			    layout: 'fit',
			    margins: '0 0 0 0',
			    items:[this.createGlobalForm()]
			},{
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
					this.items.add(DIGGlobal.dsTree);
				}
			    }			    
			}]
    		
    		});
    		
    		return this.globalPanel;
    	},
    	
    	createGlobalForm: function(){
    		this.globalForm = new Ext.form.Panel({
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
				scope:this,
				style:{
					float:'right'
				},
				handler:function(){
					this.searchForm();					
				}
			}]
		});    	
    		return this.globalForm;
    	},
    	
    	searchForm:function(){
    		var srch = this.globalForm.getValues().search;
    		var digsearch = new DIGSearch();
    		digsearch.doSearch(srch);
    	}
    	
});