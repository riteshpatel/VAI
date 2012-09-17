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
