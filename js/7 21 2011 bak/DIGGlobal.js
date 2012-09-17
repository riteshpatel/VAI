Ext.define('DIGGlobal', {
	singleton: true,
	//form initialization for Fields tab
	fieldForm:Ext.create('Ext.form.Panel',{		
		defaultType:'textfield',
		renderTo:Ext.getBody(),
		border:0
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
	//form initialization for Search tab
	searchFrm: Ext.create('Ext.form.Panel',{
		name:'SearchFrm',
		autoHeight:true,	
		bodyPadding: 5,
		autoScroll:true,
		border:0,
		defaults:{
			labelWidth:200
		}			
	}),	
	
	dsTree: Ext.create('Ext.tree.Panel', {
			height:500,
			autoHeight:true,
			autoRender:true,
			border:0,
			id:'dstree'
		})
	
});

