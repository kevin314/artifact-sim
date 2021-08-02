/*var artifactModule = require('./public/client');*/
import {artifacts, main_percentages, sub_percentages, getRandInt, weightedRand} from './public/artifactModule.mjs';
import express from 'express'
import bodyParser from 'body-parser';
//const bodyParser= require('body-parser');
const app = express();
const port = 3000;

import mongodb from 'mongodb';
const {ObjectId} = mongodb;
//var ObjectId = require('mongodb').ObjectId;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
/*app.get('/', (req, res) => {*/
/*res.sendFile(__dirname + '/index.html');*/
/*});*/

app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
});

const {MongoClient} = mongodb
//const MongoClient = require('mongodb').MongoClient;

import assert from 'assert';
//const assert = require('assert');

/*const url = 'mongodb://localhost:27017';*/

const url = 'mongodb+srv://kevin314:kevin3.141592@cluster0.un2qo.mongodb.net/testproj?retryWrites=true&w=majority';

const dbName = 'testproj';

const client = new MongoClient(url);

var artifactsCollection;

MongoClient.connect(url, { useUnifiedTopology:
    true })
/*assert.equal(null, err);})*/
    .then(client => {
        console.log("Connected to server");
        const db = client.db(dbName);
        artifactsCollection = db.collection('artifacts');

        app.post('/artifacts', (req, res) => {
            console.log(req.body);
            artifactsCollection.insertOne(req.body)
                .then(() => {
                    res.send(req.body)
                    //res.end();
                })
                .catch(error => console.error(error))
        });

        app.get('/', (req, res) => {
           artifactsCollection.find().sort({$natural:-1}).toArray()
                .then(results => {
                    console.log(results)
                    res.render('index', { artifacts: results})
                })
                .catch(error => console.log(error))
        });


        app.post('/delete', (req, res) => {
            var removeList = req.body.ids;
            console.log(removeList);
            console.log(typeof removeList);
            if(typeof removeList === "string"){
               artifactsCollection.deleteOne({"_id": ObjectId(removeList)})
                   .then(result => {
                    })
                   .catch(error => console.error(error))
            } else if (typeof removeList === "object"){
                for(var i = 0; i < removeList.length; i++){
                    artifactsCollection.deleteOne({"_id": ObjectId(removeList[i])})
                        .then(result => {
                            res.send();
                        })
                       .catch(error => console.error(error))
                }
            } else {
                res.redirect('/');
            }
        });

        app.post('/level', (req, res) => {
            console.log("HERE");
            var selected = req.body.id;
            if(selected == undefined){
                res.redirect('/');
                return;
            }
            //console.log(selected);

            var selectedDoc = artifactsCollection.findOne({"_id": ObjectId(selected)})
                .then(obj => {
                    //console.log(obj);
                    levelArtifact(obj, selected, res);
                })
        })


            /*.then(result => {*/
            /*res.redirect('/');*/
            /*console.log(result);*/
            /*})*/
            /*.catch(error => console.error(error))*/
            /*if(typeof removeList === "string"){*/
            /*artifactsCollection.delete*/
    //client.close();
    });

function levelArtifact(obj, selected, res){
    var updateJson = {};
    var numSubs = (Object.keys(obj).length - 8) / 2;

    var mainPercentages = main_percentages[obj['slot']][obj['main']]['stats']['five'];
    var mainKeys = Object.keys(mainPercentages);
    var mainInc = (mainPercentages[mainKeys[1]] - mainPercentages[mainKeys[0]])/ mainKeys[1];

    if(numSubs === 4){
        var randNum = getRandInt(4) + 1;
        updateJson['sub'+randNum+'Val'] = sub_percentages[obj['sub'+randNum]]['stats']['five'][Math.floor(Math.random()*4)];

        var valProp = 'sub'+randNum+'Val';
        artifactsCollection.findOneAndUpdate(
            {"_id": ObjectId(selected)},
            { $inc: {
                'level': 1,
                'mainVal': mainInc,
                [valProp]: updateJson['sub'+randNum+'Val']
            }},
            {returnDocument: "after"}
        )
            .then(result =>{
                console.log(result.value);
                res.send(result.value);
                //res.redirect('/');
            });

    } else {
        var subStats = [];
        for(var i = 0; i < numSubs; i++){
            subStats[i] = obj['sub'+(i+1)];
        }
        var subStat = weightedRand(sub_percentages, [obj['main']].concat(subStats));
        var statRoll = sub_percentages[subStat]['stats']['five'][Math.floor(Math.random()*4)];
        updateJson['sub'+(numSubs+1)] = subStat;
        updateJson['sub'+(numSubs+1)+'Val'] = statRoll;

        var statProp = 'sub'+(numSubs+1);
        var valProp = 'sub'+(numSubs+1)+'Val';

        artifactsCollection.findOneAndUpdate(
            {"_id": ObjectId(selected)},
            {
                $inc: {'level': 1,
                        'mainVal': mainInc},
                $set: {[statProp]: subStat, [valProp]: statRoll},
            },
            {returnDocument: "after"}
        )
            .then(result =>{
                console.log(result.value);
                res.send(result.value);
            });
    }

}

