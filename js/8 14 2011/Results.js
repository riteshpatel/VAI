Ext.define('Results', {
	extend:'Ext.panel.Panel',
	alias:'widget.Results',
	layout:'border',
	id:'ResultsPanel',
	initComponent:function(){
		Ext.apply(this, {
			items:[{
					region:'east',
					collapsible:true,
					id:'results-east',
					width:250
			       },
			       {
			       		region:'center',
			       		collapsible:true,
			       		id:'resultscenter',
			       		html:'<div id="summarydiv"></div>',
			       		autoScroll:true,
			       		items:[{
			       			xtype:'panel',
			       			width:1000,
			       			autoHeight:true,
			       			autoScroll:true,
			       			html:'<div id=resultgriddiv></div>',
			       			id:'resultPanel',
			       			border:0
			       		}]
			       		
			       }]
		});
		this.callParent(arguments);
	
	}
});