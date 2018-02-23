var fs = require('fs');
var dateTime = require('node-datetime');
var express = require('express');
var uuid = require('uuid');
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



app.get('/', function (req, res) {
    res.render('pages/home');});

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



    dbi.collection("trial").find({apikey: retrieveapikey}).toArray(function(err,result){
        console.log("result",result);
        for(var i=0;i<result.length;i++){
            delete result[i]._id;
            if(result[i].urlstatus!='200') {
                var data = "url:" + "    " + result[i].url + "  " + "urlstatus:" + "   " + result[i].urlstatus + "   " + "time:" + "   " + formatted + "\n";
                path.exists(__dirname + '/public/errorlogs/' + retrieveapikey + '.txt', function(exists) {
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