Ext.define('SearchTabs', {
	extend:'Ext.tab.Panel',
	alias:'widget.SearchTabs',
	initComponent:function(){
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
			       		title:'Alerts'
			       },
			       {
			       		title:'Batch'
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
	
	createFieldsPanel:function(){
		this.fldPanel = Ext.create('Ext.panel.Panel',{
			layout:'border',
			padding:5,
			frame:true,
			width:950,
			height:540,
			items:[
				{
					region:'west',
					collapsible:true,
					width:175,
					items:[this.createFieldsListing()]
				},
				{
					region:'center',
					collapsible:true,					
					html:'<div id="formdiv"></div>',
					autoScroll:true,
					items:[this.createRenderPanel()]
				},
				{
					region:'east',
					collapsible:true,
					width:250,
					id:'fields-east',
					items:[this.createDSTree()]
				}
			      ]
		});
		return this.fldPanel;
	},

	createDSTree:function(){
		return DIGGlobal.dsTree;
	},
	
	createGlobalPanel:function(){
		this.gbPanel = Ext.create('Ext.panel.Panel',{
			layout:'border',
			padding:5,
			frame:true,
			width:950,
			height:540,
			items:[
				{
					region:'center',
					collapsible:true,
					items:[this.createGlobalForm()]
				},
				{
					region:'east',
					collapsible:true,
					width:250,
					id:'global-east',					
					html:'<div id="treediv"></div>',
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
	
	createGlobalForm:function(){
		this.globalForm = Ext.create('Ext.form.Panel',{
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
					this.globalSearch();										
				}
			}]			
		});
		return this.globalForm;
	},
	
	globalSearch:function(){
		var chkNodes = DIGGlobal.dsTree.getView().getChecked();
		for(var n=0; n < chkNodes.length; n++){
			var selNode = chkNodes[n];			
			DIGGlobal.guidGrp.add(selNode.get('text'), selNode.get('id'));
		}

		var srch = this.globalForm.getValues().search;
		if(srch == '' || srch == null){
			Ext.Msg.alert('You must specify term to search');
		}else{
			var digsearch = new DIGSearch();
			digsearch.doSearch(srch);
		}
	},
	createFieldsListing:function(){
		this.flPanel = Ext.create('Ext.panel.Panel',{
			autoHeight:true,
			bodyPadding:10,
			border:0,
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
	
	createRenderPanel:function(){
		this.crPanel = Ext.create('Ext.panel.Panel',{
			autoHeight:true
		});
		return this.crPanel;
	}
	
});