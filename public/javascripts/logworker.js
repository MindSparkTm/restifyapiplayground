addEventListener("message", function (evt) {
    var data = (evt.data);
    console.log("You have called me",data);
    var params = data+'.txt';

    var url = 'https://cryptic-headland-94862.herokuapp.com/http://188.166.102.61/errorlogs/'+params;
    console.log("url",url);

    var http = new XMLHttpRequest();
    var res;
    http.open("HEAD", url, true);
    http.send(null);
    http.onreadystatechange = function()
    {
        console.log("entered");
        if(http.readyState == 4 && http.status == 200) {
            console.log("entered1",http.responseText);
            res = http.status;

            if(res!='404'){
                console.log("res",res);
                postMessage(res);
            }


        }
    }




}, false);