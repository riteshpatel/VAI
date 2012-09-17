/*
@class Results.js
@author Ritesh Patel for VAI
@version 1.0
@last-modified 01/26/2012
* Results Class: Builds tabs required for the Search Results ** Obsolete **
*/
Ext.define('Results', {
	//extend:'Ext.panel.Panel',
	alias:'widget.Results',
	layout:'border',
	id:'ResultsPanel',
	initComponent:function(){
		Ext.apply(this, {
			items:[{
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
			       		layout:'fit'
			       }]
		});
		this.callParent(arguments);
	
	}
});//end Class