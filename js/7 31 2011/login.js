//rpatel rpatel1234
var securityToken = null;
function SoapCall(name,password){
    xmlHttpReq = new XMLHttpRequest();
	xmlHttpReq.open("post","/VAI.DIG.WEB.Client.WebServiceAPI/SecurityManager.asmx",true);
	xmlHttpReq.setRequestHeader("Content-Type","text/xml; charset=utf-8");
	xmlHttpReq.setRequestHeader("SOAPAction","http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/SecurityManager/DIGLogin");
	xmlHttpReq.onreadystatechange=doUpdate;
	var soapRequest = "<?xml version='1.0' encoding='utf-8'?>" +
						"<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'"+
						" xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>"+
						"<soap:Body>"+
						"<DIGLogin xmlns='http://dig.visualanalytics.com/VAI.DIG.WEB.Client.WebService/SecurityManager'>"+
						"<userName>"+ name +"</userName>"+
						"<password>" + password + "</password>"+
						"</DIGLogin>"+
						" </soap:Body>"+
						"</soap:Envelope>";
	xmlHttpReq.send(soapRequest);
	return false;
}

function doUpdate(){	
	if(xmlHttpReq.readyState == 4){		
		if(xmlHttpReq.status == 200){
			var responseXml=xmlHttpReq.XML;			
			//securityToken = responseXml.getElementsByTagName("DIGLoginResponse")[0].text;	
			//alert(xmlHttpReq.getResponseHeader("Content-Type"));
			var response = xmlHttpReq.responseXML.documentElement;
			var securityToken = response.getElementsByTagName('DIGLoginResult')[0].firstChild.data;
			//put security token in a cookie...
			Ext.util.Cookies.set('sessionToken', securityToken);			
			window.location.href="dig.html";
		}else{
			alert(xmlHttpReq.statusText);
			alert('Error logging into Digital Information Gateway');
		}

	}
}
Ext.onReady(function(){
	var nameCtl = {
			xtype:'textfield',
			fieldLabel:'User Name',
			name:'username',
			allowBlank:false	
	}
	
	var pwdCtl = {
			xtype:'textfield',
			fieldLabel: 'Password',
			name:'password',
			inputType:'password',
			allowBlank:false		
	}
	var loginForm = Ext.create('Ext.form.Panel', {
		title:'DIG Login',
		bodyPadding:5,
		width:350,
		url:'',
		layout:'anchor',
		defaults:{
			anchor:'100%'
		},
		style: {
		    "margin-left": "auto",
	            "margin-right": "auto"
		},		
		defaultType:'textfield',
		items:[nameCtl,pwdCtl],
		
		buttons: [{
			text: 'Login',
			handler: function(){
				var name = loginForm.getValues().username;
				var password = loginForm.getValues().password;	
				if(name == ''){
					Ext.Msg.alert('You must specify valid user name');
				}else if(password == ''){
					Ext.Msg.alert('You must specify valid password');
				}else{
					SoapCall(name,password);
				}
			}
		}],
		renderTo: 'formdiv'
	});	
	loginForm.show();
	
});
