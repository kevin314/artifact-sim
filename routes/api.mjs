import express from 'express';
import bodyParser from 'body-parser';
import {artifactSchema, listArtifacts, rollArtifacts, levelArtifact, lockArtifacts, unlockArtifacts, deleteArtifact} from '../public/artifactModule.mjs';
import {refreshStats, compareStats} from '../public/statistics.mjs';
import {authGuest, authUser, checkAuth} from '../index.mjs';
import mongodb from 'mongodb';

import jwt from 'jsonwebtoken';
import session from 'express-session';
import passport from 'passport';
import '../passport.mjs';


import {createCompressionTable, compressObject} from 'jsonschema-key-compression';
import {decompressObject} from 'jsonschema-key-compression';

const compressionTable = createCompressionTable(artifactSchema);

const {MongoClient, ObjectId} = mongodb;

const router = express.Router();

router.use(express.urlencoded({extended: true}));
router.use(express.json());

const url = '';

MongoClient.connect(url, { useUnifiedTopology:
    true })
    .then(client => {
        const discorddb = client.db('discord');
        const guestdb = client.db('guest');
        const googledb = client.db('google');
        const usersdb = client.db('usersdb');
        const discordUsers = usersdb.collection('discord');

        function ensureUser (req, res, next, functionCall){
            const userid  = req.params['userid'];
                    if (req.params.userid == '@me'){
                        functionCall();
                    } else {
                        res.send("Unauthorized", 401)
                    }
        }

        function getArtifactsCol(provider, id) {
            try{
                let col;
                if(provider === 'discord') {
                    col = discorddb.collection(id);
                } else if (provider === 'google'){
                    col = googledb.collection(id);
                } else {
                    col = guestdb.collection(id);
                }
                return col;
            } catch {
                return undefined;
            }
        }

        function getUserColQuery(provider, id){
            let col;
            let query;
            if (provider === undefined) {
                col = usersdb.collection('guest');
                if (id === undefined) {
                    return [col, query];
                }
                query = {'_id': ObjectId(id)};
            } else if (provider === 'discord'){
                col = usersdb.collection('discord');
                query = {'userID': id};
            } else {
                col = usersdb.collection('google');
                query = {'email': id};
            }

            return [col, query];
        }

        router.get('/test', (req, res) => {
            res.send('test');
        });

        router.use('/', (req,res,next) => {
            if(req.user) {
                //authUser(req.user, res);
                if (req.user.provider === 'google') {
                    req.currID = req.user.emails[0].value;
                } else {
                    req.currID = req.user.id;
                }
            } else {
                let cookieid;
                if(req.signedCookies['guestCookie']){
                    cookieid = req.signedCookies['guestCookie']['_id'];
                    //authGuest(res, cookieid);
                } else {
                    res.locals.sendEmpty = true;
                }
                req.currID = cookieid;
            }
            next();
        })

        // Get user's artifacts
        router.get('/users/:userid/artifacts', (req, res, next) => {
            if(res.locals.sendEmpty === true){
                res.send([]);
            }
            next();
        }, function (req,res,next){ensureUser(req, res, next, ()=> {listArtifacts(res, getArtifactsCol(req.user && req.user.provider, req.currID), true)})});

        // Roll artifacts for a user
        router.post('/users/:userid/artifacts', async (req, res, next) => {
            const setName = req.body.domain;
            if(!setName) {
                res.status(400).send("No domain specified");
                return;
            }
            if(!req.user){
                let cookieid;
                if(req.signedCookies['guestCookie']){
                    cookieid = req.signedCookies['guestCookie']['_id'];
                } 
                cookieid = await authGuest(res, cookieid, true, false);
                req.currID = cookieid;
            }
            //res.locals.setName = setName;
            next();

        }, function (req,res,next){
            ensureUser(req, res, next, ()=> {rollArtifacts(res, req.body.domain, getArtifactsCol(req.user && req.user.provider, req.currID),
            ...getUserColQuery(req.user && req.user.provider, req.currID))})
        });

        // Level artifact
        router.put('/users/:userid/artifacts/level', (req, res, next) => {
            if(res.locals.sendEmpty === true){
                res.send({});
                return;
            }
            next();
        }, function (req,res,next){
            ensureUser(req, res, next, ()=> {levelArtifact(res, getArtifactsCol(req.user && req.user.provider, req.currID), req.body.target, req.body.fodder, ObjectId)})
        });

        router.delete('/users/:userid/artifacts/delete', (req, res, next) => {
            if(res.locals.sendEmpty === true){
                res.send('0 artifacts deleted');
                return;
            }
            var remove = req.body.deleteList;
            var removeIdArr = [];
            
            try{
                remove.forEach(id => {
                    removeIdArr.push(ObjectId(id));
                });
                req.removeIdArr = removeIdArr;
            } catch {
                res.status(400).send("Invalid artifact ID")
                return;
            }
            next();
            //deleteArtifact(res, removeIdArr, artifactsCollection);
        }, function (req,res,next){
            ensureUser(req, res, next, ()=> {deleteArtifact(res, req.removeIdArr, getArtifactsCol(req.user && req.user.provider, req.currID))})
        });

        //Lock artifacts
        router.put('/users/:userid/artifacts/lock', (req, res, next) => {
            if(res.locals.sendEmpty === true){
                res.send('0 artifacts locked');
                return;
            }
            next();
        }, function (req,res,next){
            ensureUser(req, res, next, ()=> {lockArtifacts(res, getArtifactsCol(req.user && req.user.provider, req.currID), req.body.lockList, ObjectId)})
        });

        //Unlock artifacts
        router.put('/users/:userid/artifacts/unlock', (req, res, next) => {
            if(res.locals.sendEmpty === true){
                res.send('0 artifacts unlocked');
                return;
            }
            next();
        }, function (req,res,next){
            ensureUser(req, res, next, ()=> {unlockArtifacts(res, getArtifactsCol(req.user && req.user.provider, req.currID), req.body.unlockList, ObjectId)})
        })

        function findUser(res, userCol, query) {
            userCol.findOne(query)
                .then(result => {
                    res.send(result);
                });
        }
        // Get user
        router.get('/users/:userid', (req, res, next) => {
            if(res.locals.sendEmpty === true){
                res.send({});
                return;
            }
            next();
        }, function (req,res,next){
            ensureUser(req, res, next, ()=> {findUser(res, ...getUserColQuery(req.user && req.user.provider, req.currID))})
        });

        router.delete('/users/:userid', (req, res, next) => {
            const userid  = req.params['userid'];
            const query = {'userID': userid};
            discordUsers.deleteOne(query)
                .then(result => {
                    res.send("Account deleted");
                })
        })

        router.get('/refresh', (req, res) => {
            refreshStats(discorddb);
        })

        router.post('/users/:userid/artifacts/compare', (req, res) => {
            const userid  = req.params['userid'];
            const list = req.body.list;
            compareStats(res, userid, list, discorddb, ObjectId);
        })

        router.get('/auth/google', 
            (req, res, next) => {
                let uri = req.get('origin')
                if(uri === undefined) {
                    next();
                    return;
                }
                res.cookie('googleRedirectURI', {URI: uri}, {signed: true, maxAge: 60000, httpOnly: true, secure: true, sameSite: "None"});
                next();
            },
            passport.authenticate('google', { scope: ['profile', 'email'] })
        );

        router.get('/auth/discord', 
            (req, res, next) => {
                let uri = req.get('origin')
                if(uri === undefined) {
                    uri = req.get('referer');
                    if(uri === undefined) {
                        next();
                        return;
                    }
                }
                res.cookie('discordRedirectURI', {URI: uri}, {signed: true, maxAge: 60000, httpOnly: false, secure: true, sameSite: "None"});
                next();
            },
            passport.authenticate('discord')
        );

        router.post('/logout', (req, res) => {
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
export {compressObject, decompressObject, compressionTable, router as discordAPI}

