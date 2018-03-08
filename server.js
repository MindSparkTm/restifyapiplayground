var fs = require('fs');
var dateTime = require('node-datetime');
var express = require('express');
var uuid = require('uuid');
var FCM = require('fcm-node');

var app = express();
var path=require ('path');
app.set('view engine', 'ejs');
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://surajit001:mom12345@ds145868.mlab.com:45868/employee';
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

app.use(myParser.json());// parse application/json
var dbi;




app.get('/token',function(req,res) {
    var serverKey = 'AIzaSyAKrmH9--qdL591RBJflO_ARUu0j4TzmQ8';
    var fcm = new FCM(serverKey);
    var statsmes;
    dbi.collection("trial").find({apikey: retrieveapikey}).toArray(function (err, result) {
        console.log("result", result);
        for (var i = 0; i < result.length; i++) {
            delete result[i]._id;
            if (result[i].urlstatus != '200') {
                statsmes = 'One or more of your API returned a status other than 200'
                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: 'emUj2cuW8B8:APA91bGgVmyXcDYZpIK8rOo0F_aeeLN7CDd10b4_Qy1agGLB3_eZ5VDpZ6UeXt_um5ZyOvuQ8Kp5Q-XvXxwoUjXY2sb2HHYHTPK74looMctWmpVcDJ-LSLWkCNqLBeZiCQ19Ct0C2W46',
                    notification: {
                        title: 'Title of your push notification',
                        body: statsmes
                    },

                    data: {  //you can send only notification or only data(or include both)
                        my_key: 'my value',
                        my_another_key: 'my another value'
                    }
                };

                fcm.send(message, function (err, response) {
                    if (err) {
                        console.log("Something has gone wrong!");
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });

            }
        }


    });

});

app.post('/savetoken',function(req,res){
   var da = typeof (req.body);

   console.log("apikey",da);
    dbi.collection('tokenapp').save(da,function(err, result){
        console.log("error",err);

       console.log("result",result);
        if(result.length==0){
            res.send("failure");

        }
        else{
            res.send( 'success');
        }

    });

})

app.get('/restify', function (req, res) {
    if(req.query.sessionid==null){
        res.render('pages/restifylogin')
    }
    else{
        var sessionid = req.query.sessionid;

        if(sessionid.length==36) {
            res.render('pages/home');
        }

        else{
            res.render('pages/restifylogin')

        }
    }}
  );

app.get('/', function (req, res) {
    res.render('pages/restifylogin');});

app.post('/register', function (req, res) {
   // var apikey = req.body.Apikey;
  //  var email= req.body.Email;
    var loginbody = req.body;
    dbi.collection('loginrestify').insert(loginbody, {safe:true}, function(err, result){
        console.log("error",err);

          console.log("result",result);
        if(result.length==0){
            res.send("failure");

        }
        else{
            res.send( 'success');
        }

    });

   
});


app.post('/verify',function(req,res){
    console.log("Register");
    var registerbody=req.body.apikey;
    console.log(registerbody);
   dbi.collection("loginrestify").find({user_Apikey: req.body.apikey}).toArray(function(err,result){
       console.log("result",result);
       if(result.length==0){
           res.send("failure");

       }
       else{
           res.send( 'success');
       }

    });
})
app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
    MongoClient.connect(MONGO_URL, function(err,db ) {
        //console.log("Connect",db);

        if (err) {
            return console.log("error",err);
        }

        dbi = db;

    });

});



app.post('/test',function(req,res){
    console.log("Testing",req.body);
    var i = req.body;



    dbi.collection('trial').insert(i, {safe:true}, function(err, result){
        console.log("error",err);

      //  console.log("result",result);f


    });

});

app.get('/getdata',function(req,res){
    console.log("Entering here");

    var retrieveapikey = req.query.apiKey;
    console.log("retriever",retrieveapikey);
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');


    dbi.collection("trial").find({apikey: retrieveapikey}).toArray(function(err,result){
        console.log("result",result);
        for(var i=0;i<result.length;i++){
            delete result[i]._id;
            if(result[i].urlstatus!='200') {
                var data = "url:" + "    " + result[i].url + "  " + "urlstatus:" + "   " + result[i].urlstatus + "   " + "time:" + "   " + formatted + "\n";
                fs.exists(__dirname + '/public/errorlogs/' + retrieveapikey + '.txt', function(exists) {
                    if (exists) {
                        // do something
                        fs.appendFile(__dirname + '/public/errorlogs/' + retrieveapikey + '.txt', data, {encoding: 'utf8'});

                    }

                    else{
                        fs.writeFile(__dirname + '/public/errorlogs/' + retrieveapikey + '.txt', data, function (err) {
                            console.log("The file was succesfully saved!");

                        });


                    }
                });



            }
        }


        console.log(result);
        res.send(result);

    })
});



app.get('/currentrecord',function(req,res){
    var url = req.query.urldata;
    var urlstatus = req.query.urlstatus;
    var apikey = req.query.apikey;
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    console.log("url",url);
    console.log("urlstatus",urlstatus);
    console.log(__dirname);
    if(urlstatus!='200') {
        var data = "url:" + "    " + url + "  " + "urlstatus:" + "   " + urlstatus + "   " + "time:" + "   " + formatted + "\n";
        fs.appendFile(__dirname + '/public/errorlogs/' + apikey + '.txt', data, {encoding: 'utf8'});
    }

});


app.get("/readfile",function(req,res){

var datafromfile=[];
var filename = req.query.fname;

fs.readFile('/errorlogs/'+filename+".txt", 'utf8', function(err, data) {
if (err) throw err;
console.log('OK: ' + filename);
console.log(data)
datafromfile.push(data);

});

res.send("datafromfile",JSON.stringify(datafromfile));
})

function ensureExists(path, mask, cb) {
if (typeof mask == 'function') { // allow the `mask` parameter to be optional
cb = mask;
mask = 0777;
}
fs.mkdir(path, mask, function(err) {
if (err) {
if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
else cb(err); // something else went wrong
} else cb(null); // successfully created folder
});
}

app.get("/webworkers",function(req,res){
    res.render('pages/runscripts.ejs');
})


