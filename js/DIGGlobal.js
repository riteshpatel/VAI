/**
@class DIGGlobal
@author Ritesh Patel for VAI
@version 1.0
@last-modified 01/26/2012
* Class to hold application wide global objects and variables
* This file is on GIT now.
*/
Ext.define('DIGGlobal', {
	rootUrl:'http://digdev.visualanalytics.com',
	singleton: true,
	//form initialization for Fields tab
	fieldForm:Ext.create('Ext.form.Panel',{		
		defaultType:'textfield',
		renderTo:Ext.getBody(),
		border:0
	}),
	
	summaryAcc: Ext.create('Ext.panel.Panel', {
	      	    id:'summaryacc',
		    title: 'Search Results Summary',
		    width: 600,
		    autoHeight:true,
		    maxWidth:600,		    
		    layout:'accordion',
		    style:'margin:0 auto;',		    
		    defaults: {
			// applied to each contained panel
			bodyStyle: 'padding:15px'
		    },
		    layoutConfig: {
			// layout-specific configs go here
			titleCollapse: false,
			animate: true,
			activeOnTop: true
		    }
		}),
	labelMap: new Ext.util.MixedCollection(),
	srchArray: new Array(),
	ctlArray: new Array(),
	fldMap: new Ext.util.MixedCollection(),
	formMap: new Ext.util.MixedCollection(),
	guidGrp: new Ext.util.MixedCollection(),
	rcrdCount:new Array(),
	rcrdView:new Array(),
	/* Data Source Collection Variables */	
	digServers: new Array(),//stores DIG Server Names
	//dsMap: new Array(),
	dsMap: new Ext.util.MixedCollection(),//stores DIG Data Sources	
	qryGrp: new Array(),//stores DIG Query Groups
	qryGrpNameArr: new Array(),//stores DIG Query Group Names
	ajaxArr: new Array(),
	//data source fields collection
	dsFields: new Ext.util.MixedCollection(),//stores fields by Data Source and Query Group	
	initGridLoad:false,
	searchSummary:'',
	digMask:'',
	srcCntr:0,
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
	noCheckTree: Ext.create('Ext.tree.Panel', {
			height:3000,
			autoHeight:true,
			autoRender:true,
			border:0,
			id:'nochecktree'
		}),
		
	dsTree: Ext.create('Ext.tree.Panel', {
			height:3000,	
			autoScroll:true,
			autoRender:true,
			folderSort:true,
			loadMask:true,
			border:0,
			id:'dstree'
		}),
	
	resultsWindow: Ext.create('Ext.window.Window',{
		title: 'DIG Search Summary',
		width: 700,
		height: 500,
		id:'summaryWindow',
		headerPosition: 'top',
		closable:false,
		closeAction:'hide',
		autoScroll:true,		
		scope:this,
		tbar:[{
				xtype:'button',
				text:'Close',
				handler:function(){
					Ext.getCmp('summaryWindow').hide();
				}

			}]
	})
	
});//end Class

