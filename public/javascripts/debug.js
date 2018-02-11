var ids=[];
var ids_data=[];
var i=0;
var headerdata=[];
var paramdata=[];
var s=[];
var datafromserver =[];
var iddata = [];
var flagforchecking = false;
localStorage.setItem('endpointid',"1" );
var validapikey=false;
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}




function checkdata(){

	if(headerdata.length>0){
		console.log("Header data",headerdata);
	}
	else{
		while(true){
			

		}
	}


}
function showHeaders() {
	showAuthHeaders();
	showHeaderHeaders();
	showParamHeaders();
}

function showAuthHeaders() {
	if ($("#authentication").find(".realinputvalue").length > 0) {
		$("#addauthbutton").hide();
		$("#authentication").show();
	} else {
		$("#addauthbutton").show();
		$("#authentication").hide();
	}
}

function showHeaderHeaders() {
	if ($("#allheaders").find(".realinputvalue").length > 0) {
		$("#allheaders").show();
	} else {
		$("#allheaders").hide();
	}
}

function showParamHeaders() {
	if ($("#allparameters").find(".realinputvalue").length > 0) {
		$("#allparameters").show();
	} else {
		$("#allparameters").hide();
	}
}

//this specifies the parameter names
$(".fakeinputname").blur(function() {
  var newparamname = $(this).val();
  $(this).parent().parent().parent().parent().find(".realinputvalue").attr("name", newparamname);
});
 

$(".close").click(function(e) {
  e.preventDefault();
  $(this).parent().remove();
	showHeaders();
});

$("#addauthbutton").click(function(e) {
  e.preventDefault();
	if ($("#authentication").find(".realinputvalue").length == 0) {
		$('.httpauth:first').clone(true).appendTo("#authentication");
	}
	showHeaders();
});

$("#addheaderbutton").click(function(e) {
  e.preventDefault();
	$('.httpparameter:first').clone(true).appendTo("#allheaders");
	showHeaders();
});

$("#addprambutton").click(function(e) {
  e.preventDefault();
	$('.httpparameter:first').clone(true).appendTo("#allparameters");
	showHeaders();
});

$("#addfilebutton").click(function(e) {
  e.preventDefault();
	$('.httpfile:first').clone(true).appendTo("#allparameters");
	showHeaders();
});

function postWithAjax(myajax) {
    console.log("Myajaxvalue", myajax);

    myajax = myajax || {};


    myajax.url = $("#urlvalue").val();
    myajax.type = $("#httpmethod").val();
    myajax.endpointid = $("#endpointid").val();

    if (checkForAuth()) {
        myajax.username = $("#authentication input:first").val();
        myajax.password = $("#authentication input").eq(1).val();
    }
    myajax.complete = function (jqXHR) {
        $("#statuspre").text(
            "HTTP " + jqXHR.status + " " + jqXHR.statusText);
        if (jqXHR.status == 0) {
            httpZeroError();
        } else if (jqXHR.status >= 200 && jqXHR.status < 300) {
            $("#statuspre").addClass("alert-success");
        } else if (jqXHR.status >= 400) {
            $("#statuspre").addClass("alert-error");
        } else {
            $("#statuspre").addClass("alert-warning");
        }
        $("#outputpre").text(jqXHR.responseText);
        $("#headerpre").text(jqXHR.getAllResponseHeaders());


      /*  $("#boxedtable").find('tbody')

            .append($('<tr>')
                .append($('<td>')
                    .text('Url:-')
                )

                .append($('<td>')
                    .text(myajax.url)
                )
                .append($('<td>')
                    .text('Live Status-')
                ).append($('<td>')
                    .text(jqXHR.status)
                )
            )


            .append($('<tr>')
                .append($('<td>')
                    .text('')
                )
            )*/


        //$("#boxed").text("THis thing just changed");
    }

    if (jQuery.isEmptyObject(myajax.data)) {
        myajax.contentType = 'application/x-www-form-urlencoded';
    }


    $("#outputframe").hide();
    $("#outputpre").empty();
    $("#headerpre").empty();
    $("#outputframe").attr("src", "")
    $("#ajaxoutput").show();
    $("#statuspre").text("0");
    $("#statuspre").removeClass("alert-success");
    $("#statuspre").removeClass("alert-error");
    $("#statuspre").removeClass("alert-warning");

    $('#ajaxspinner').show();
    var req = $.ajax(myajax).always(function () {
        $('#ajaxspinner').hide();
    });


     var apikey = $("#apikey").valueOf();
     if(apikey!='-999') {
         console.log('Saved to db');
         savedatatoserver();

     }

}


function postwithAjax2(myajax){
    $("#boxedtable").find('tbody').empty();

    console.log("Myajaxvalue", myajax.url);


    myajax = myajax || {};





    if (checkForAuth()) {
        myajax.username = $("#authentication input:first").val();
        myajax.password = $("#authentication input").eq(1).val();
    }
    myajax.complete = function (jqXHR) {
        $("#statuspre").text(
            "HTTP " + jqXHR.status + " " + jqXHR.statusText);
        if (jqXHR.status == 0) {
            httpZeroError();
        } else if (jqXHR.status >= 200 && jqXHR.status < 300) {
            $("#statuspre").addClass("alert-success");
        } else if (jqXHR.status >= 400) {
            $("#statuspre").addClass("alert-error");
        } else {
            $("#statuspre").addClass("alert-warning");
        }
        $("#outputpre").text(jqXHR.responseText);
        $("#headerpre").text(jqXHR.getAllResponseHeaders());


         $("#boxedtable").find('tbody')

              .append($('<tr>')
                  .append($('<td>')
                      .text('Url:-')
                  )

                  .append($('<td>')
                      .text(myajax.url)
                  )
                  .append($('<td>')
                      .text('Live Status-')
                  ).append($('<td>')
                      .text(jqXHR.status)
                  )
              )


              .append($('<tr>')
                  .append($('<td>')
                      .text('')
                  )
              )

        var apikey = $("#apikey").val();
        $.ajax({
            type: 'GET',
            url: 'currentrecord',
            dataType: "json",
            data: {"urldata":myajax.url,"urlstatus":jqXHR.status,"apikey":apikey},
            cache: false,
            contentType: "application/json",

            success: function (data) {
                console.log("success in pushing data to the server", data);

            }
        });


        //$("#boxed").text("THis thing just changed");
    }

    if (jQuery.isEmptyObject(myajax.data)) {
        myajax.contentType = 'application/x-www-form-urlencoded';
    }


    $("#outputframe").hide();
    $("#outputpre").empty();
    $("#headerpre").empty();
    $("#outputframe").attr("src", "")
    $("#ajaxoutput").show();
    $("#statuspre").text("0");
    $("#statuspre").removeClass("alert-success");
    $("#statuspre").removeClass("alert-error");
    $("#statuspre").removeClass("alert-warning");

    $('#ajaxspinner').show();
    var req = $.ajax(myajax).always(function () {
        $('#ajaxspinner').hide();
    });



}

function savedatatoserver(){
    console.log("ENtered in saving data");
 flagforchecking=true;
    var retrievedObject = localStorage.getItem('endpointid');
var endpointid = $("#endpointid").val();
var outputpres = $("#outputpress").val();
var apikey = $("#apikey").val();
if(apikey.length>0) {
    if (endpointid.length > 0) {
        console.log("Ok Job done");
        if (endpointid != retrievedObject) {
            console.log("Different endpoint id");
            localStorage.setItem('endpointid', endpointid);

            $("#outputpress").empty();

            var s = {
                "apikey": apikey,
                "url": $("#urlvalue").val(),
                "urltype": $("#httpmethod").val(),
                "endpointid": $("#endpointid").val(),
                "authusername": $("#authentication input:first").val(),
                "authpassword": $("#authentication input").eq(1).val(),
                "header": createHeaderData(),
                "data": createUrlData()
            };

            console.log("data", JSON.stringify(s));
            $.ajax({
                type: 'POST',
                url: 'test',
                dataType: "json",
                data: JSON.stringify(s),
                cache: false,
                contentType: "application/json",

                success: function (data) {
                    console.log("success in pushing data to the server", data);

                }
            });
        }

        else {
            $("#outputpress").text("Same Endpoint id,Cannot be added. Please enter a different id");
            console.log("Same endpoint id");
        }

    }
    else{
        $("#outputpress").text("Please enter an endpoint id before clicking submit");

    }

}
else{
    alert("You cannot save data without entering your APIKey");
}


}

$("#submitajax").click(function(e) {

    console.log("clicked");
    var uuid = guid();
    ids.push(uuid);




    e.preventDefault();
  if(checkForFiles()){
    postWithAjax({
      headers: createHeaderData(),
      data : createMultipart(), 
      cache: false,
      contentType: false,
      processData: false  
    });

  } else {
    postWithAjax({
      headers : createHeaderData(),
      data : createUrlData()
    });    
  }

    $("#apikey").val('-999');



});



$("#monitordata").click(function(e) {
    var apikey = $("#apikey").val();
    $("#apikeyval").val(apikey);

    $("#boxedtable").find('tbody').empty();


    console.log("You have clicked me");
    e.preventDefault();
    var apikey = $("#apikey").val();

 if(apikey!='-999') {
     requestdatafromserver();
     document.getElementById("monitordata").disabled = true;
     $("#continuous").append("Continous Monitoring in Progress.......")
     setInterval(requestdatafromserver, 60000);
 }
 else{
     alert("Please enter a valid api Key before clicking on Monitor data");

 }

});

$("#recordedata").click(function(e){
    e.preventDefault();

    var res = prompt("Enter your api key")
    console.log("result",res);
    window.open('errorlogs/'+res+".txt");




})
function requestdatafromserver(){

    var apikey = $("#apikeyval").val();
    validapikey=true;
        $.ajax({
            type: 'GET',
            url: 'getdata',
            data:{'apiKey':apikey},
            dataType: "json",
            cache: false,
            contentType: "application/json",

            success: function (data) {
                console.log("success in getting data from the server");

                $.each(data, function(i, $val)
                {
                    datafromserver.push($val);
                    //postwithAjax2($val);

                });

                console.log("datafromserver",datafromserver);


                keepmonitoringdatafromserver();
            }
        })



}

function repeatbuttonclick(){
    setInterval(function(){
        $("#submitajax").click();
    },20000);
}

function checkForFiles() {
	return $("#paramform").find(".input-file").length > 0;
}

function checkForAuth() {
	return $("#paramform").find("input[type=password]").length > 0;
}

function createUrlData(){
  var mydata = {};
	var parameters = $("#allparameters").find(".realinputvalue");
	for (i = 0; i < parameters.length; i++) {
		name = $(parameters).eq(i).attr("name");
		if (name == undefined || name == "undefined") {
			continue;
		}
		value = $(parameters).eq(i).val();
		mydata[name] = value
	}
	console.log("Parameter data",mydata);
  return(mydata);
}

function createMultipart(){
  //create multipart object
  var data = new FormData();
  
  //add parameters
  var parameters = $("#allparameters").find(".realinputvalue");
	for (i = 0; i < parameters.length; i++) {
		name = $(parameters).eq(i).attr("name");
		if (name == undefined || name == "undefined") {
			continue;
		}
    if(parameters[i].files){
  	  data.append(name, parameters[i].files[0]);      
    } else {
		  data.append(name, $(parameters).eq(i).val());
    }
	}
  return(data)  
}

function createHeaderData(){

  var mydata = {};
	var parameters = $("#allheaders").find(".realinputvalue");
	for (i = 0; i < parameters.length; i++) {
		name = $(parameters).eq(i).attr("name");
		if (name == undefined || name == "undefined") {
			continue;
		}
		value = $(parameters).eq(i).val();
		mydata[name] = value
	}
  return(mydata);
}

function httpZeroError() {
	//$("#errordiv").append('<div class="alert alert-error"> <a class="close" data-dismiss="alert">&times;</a> <strong>Oh no!</strong> Javascript returned an HTTP 0 error. One common reason this might happen is that you requested a cross-domain resource from a server that did not include the appropriate CORS headers in the response. Better open up your Firebug...</div>');
}

function keepmonitoringdatafromserver(){

    console.log("datafromserverfunction",datafromserver);
    for(var i=0;i<datafromserver.length;i++){

        postwithAjax2(datafromserver[i]);

        if(i == datafromserver.length-1){
            datafromserver=[];
        }


    }

}

