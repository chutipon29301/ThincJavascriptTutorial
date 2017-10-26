var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID

var app = express();

app.listen(3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req,res,next){
    // Allow access from other domain
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});

MongoClient.connect('mongodb://127.0.0.1:27017/ThincJavascriptWorkshop', function (err, db) {
    if (err) {
        console.log('Error');
        console.log(err);
        return;
    }
    console.log('Successful connect to database');

    app.post('/addUser', function (req, res) {
        if (req.body.studentID === undefined || req.body.firstName === undefined || req.body.lastName === undefined, req.body.major === undefined) {
            return res.status(400).send({
                err: 400,
                msg: 'Bad request'
            });
        }
        db.collection('User').insertOne({
            studentID: req.body.studentID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            major: req.body.major
        });
        res.status(200).send('OK');
    });

    app.post('/deleteUser', function(req,res){
        if(req.body.userID === undefined){
            return res.status(400).send({
                err: 400,
                msg: 'Bad request'
            });
        }
        db.collection('User').deleteOne({
            _id: ObjectID(req.body.userID)
        });
        res.status(200).send('OK');
    });

    app.post('/listUser', function(req,res){
        db.collection('User').find({}).toArray().then(users => {
            for(let i = 0; i < users.length; i++){
                users[i].userID = users._id;
                delete users[i]._id;
            }
            res.status(200).send(users);
        });
    })
});