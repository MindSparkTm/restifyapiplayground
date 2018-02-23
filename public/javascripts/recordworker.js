addEventListener("message", function (evt) {
    var data = JSON.stringify(evt.data);
    console.log("You have called me",data);
    var senddata=[];
    var params = "apiKey="+evt.data+"";

    var url = 'http://188.166.102.61/getdata'+"?"+params;
    var url1 = 'https://httpbin.org';
    console.log("url",url);

    var http = new XMLHttpRequest();
    var res;
    http.open("GET", url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.send(null);
    http.onreadystatechange = function()
    {
        console.log("entered");
        if(http.readyState == 4 && http.status == 200) {
            //console.log("entered1",http.responseText);
            res = http.responseText;
            if(res!=null){
                console.log("res",res);
                postMessage(res);
            }
        }
    }




}, false);




