import express from 'express';
import bodyParser from 'body-parser';
import {artifactSchema, listArtifacts, rollArtifacts, levelArtifact, lockArtifacts, unlockArtifacts, deleteArtifact} from '../public/artifactModule.mjs';
import {refreshStats, compareStats} from '../public/statistics.mjs'
import mongodb from 'mongodb';

import jwt from 'jsonwebtoken';
import session from 'express-session';
import passport from 'passport';
import '../passport.mjs';

import {createCompressionTable, compressObject} from 'jsonschema-key-compression';
import {decompressObject} from 'jsonschema-key-compression';

const compressionTable = createCompressionTable(artifactSchema);

const {MongoClient, ObjectId} = mongodb;
//import {getClient} from '../mongo.mjs';
//import clientPromise from '../index.mjs';

const router = express.Router();

/*
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
*/



//const client = await getClient();

MongoClient.connect(url, { useUnifiedTopology:
    true })
    .then(client => {
        const discorddb = client.db('discord');
        const usersdb = client.db('usersdb');
        const discordUsers = usersdb.collection('discord');

        router.get('/test', (req, res) => {
            console.log('test');
            res.send('hi');
        })

        // Get user's artifacts
        router.get('/users/:userid/artifacts', (req, res) => {
            console.log('GET ARTIFACTS!!');
            console.log(req.params);
            const userid  = req.params['userid'];
            if (params.userid == '@me'){
                if (req.user) {
                    const user = req.user;
                    listArtifacts(res, discorddb.collection(user.id), compressionTable, compressObject);
                } else {
                    console.log("Unauth");
                    res.send("Unauthorized");
                }
            } else {
                listArtifacts(res, discorddb.collection(userid), compressionTable, compressObject);
            }
            //res.send('get artifacts');
        })

        // Roll artifacts for a user
        router.post('/users/:userid/artifacts', (req, res) => {
            console.log('ROLL');
            console.log(req.params);
            const userid  = req.params['userid'];
            const query = {'userID': userid};
            console.log(req.body);
            const setName = req.body.domain;
            if(!setName) {
                res.send("No domain specified");
                return;
            }
            rollArtifacts(res, setName, discorddb.collection(userid), discordUsers, query);
            //res.send('roll artifacts');
        })

        // Level artifact
        router.put('/users/:userid/artifacts/:artifactid', (req, res) => {
            console.log('LEVEL');
            console.log(req.params);
            const userid  = req.params['userid'];
            const artifactid = req.params['artifactid'];
            const fodderList = req.body.fodder;

            if(userid = '@me'){
                if(req.user){
                    levelArtifact(res, discorddb.collection(userid), artifactid, fodderList, ObjectId);
                } else {
                    res.send("Unauthorized", 401);
                }
            }
            //res.send('level artifact');
        })

        router.put('/users/:userid/artifacts/lock', (req, res) => {
            console.log('LOCK');
            console.log(req.params);
            const userid  = req.params['userid'];
            lockArtifacts(res, discorddb.collection(userid), req.body.lockList, ObjectId);
            //res.send('level artifact');
        })

        router.put('/users/:userid/artifacts/unlock', (req, res) => {
            console.log('UNLOCK');
            console.log(req.params);
            const userid  = req.params['userid'];
            unlockArtifacts(res, discorddb.collection(userid), req.body.unlockList, ObjectId);
            //res.send('level artifact');
        })

        // Get user
        router.get('/users/:userid', (req, res) => {
            if(!req.user){
                console.log("Not authorized");
                res.send("Unauthorized", 401);
                return;
            }
            console.log('USER');
            console.log(req.params);
            const userid  = req.params['userid'];
            const query = {'userID': userid};
            discordUsers.findOne(query)
                .then(result => {
                    res.send(result);
                });
        })

        router.delete('/users/:userid', (req, res) => {
            console.log('DELETE USER');
            console.log(req.params);
            const userid  = req.params['userid'];
            const query = {'userID': userid};
            discordUsers.deleteOne(query)
                .then(result => {
                    res.send("Account deleted");
                })
        })

        router.get('/refresh', (req, res) => {
            console.log("Refreshing stats...");
            refreshStats(discorddb);
        })

        router.post('/users/:userid/artifacts/compare', (req, res) => {
            console.log("Referencing stats");
            //console.log(req.params);
            const userid  = req.params['userid'];
            const list = req.body.list;
            //console.log(list);
            compareStats(res, userid, list, discorddb, ObjectId);
        })

        router.get('/auth/google', 
            (req, res, next) => {
                let uri = req.get('origin')
                if(uri === undefined) {
                    next();
                    return;
                }
                res.cookie('googleRedirectURI', {URI: uri}, {signed: true, maxAge: 60000, httpOnly: true});
                next();
            },
            passport.authenticate('google', { scope: ['profile', 'email'] })
        );

        router.get('/auth/discord', 
            (req, res, next) => {
                let uri = req.get('origin')
                if(uri === undefined) {
                    next();
                    return;
                }
                res.cookie('discordRedirectURI', {URI: uri}, {signed: true, maxAge: 60000, httpOnly: true});
                next();
            },
            passport.authenticate('discord')
        );

        router.post('/logout', (req, res) => {
            //req.logout();
            //req.session = null;
            req.session.destroy(() => {
                res.status(200);
            })
        })
        /*
        function parseParams(params) {
            const strArr = params['username'].split(':');
            const username = strArr[0];
            const disc = strArr[1];
            return {username: strArr[0], disc: strArr[1]};
        }
        */
})
export {router as discordAPI}

