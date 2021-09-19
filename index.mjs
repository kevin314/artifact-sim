import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import {artifacts, main_percentages, sub_percentages, getRandInt, weightedRand, listArtifacts, rollArtifacts, levelArtifact, deleteArtifact, syncResinCount} from './public/artifactModule.mjs';
import {discordAPI} from './routes/api.mjs';
import express from 'express'
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';

import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import cookieSession from 'express-session';
import './passport.mjs';

import session from 'express-session';
import passport from 'passport';

import mongodb from 'mongodb';
const {ObjectId} = mongodb;
const {MongoClient} = mongodb;
import assert from 'assert';


const router = express.Router();
const port = 3000;

const app = express();

app.use(favicon(__dirname + '/public/favicon.ico'))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser('secretstring'));

app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));

/*
app.use(session({
    name: 'guest.connect.sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));
*/
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/discord', discordAPI);

/*
app.use(cookieSession({
    name: 'genshin-session',
    keys: ['key1, key2'],
    secret: 'secret2'
}));
*/

const databases = {};
var discorddb, googledb, usersdb, guestdb;
var regularUsersCollection, discordUsers, googleUsers, guestUsers;

const url = 'mongodb+srv://kevin314:kevin3.141592@cluster0.un2qo.mongodb.net/testproj?retryWrites=true&w=majority';
MongoClient.connect(url, { useUnifiedTopology:
    true })
/*assert.equal(null, err);})*/
    .then(client => {
        console.log("Connected to Mongo server");
        discorddb = client.db('discord');
        googledb = client.db('google');
        guestdb = client.db('guest');
        usersdb = client.db('usersdb');
        databases['discord'] = discorddb;
        databases['google'] = googledb;

        var userid;

        regularUsersCollection = usersdb.collection('regular');
        discordUsers = usersdb.collection('discord');
        googleUsers = usersdb.collection('google');
        guestUsers = usersdb.collection('guest');

        //initiateResinCount(discordUsers);
        //initiateResinCount(googleUsers);

        app.post('/artifacts', (req, res) => {
            rollAuth(req.user, res, req);
        });

        app.get('/failed', (req, res) => {
            res.send('<h1>Log in Failed :</h1>')
        });

        app.get('/test', (req, res) => {
                res.send('yo');
        })
        app.get('/', (req, res) => {
            //console.log(req.session);
            if(req.user) {
                console.log("--------------------------");
                console.log("USER")
                console.log(req.cookies);
                console.log("--------------------------");
                authUser(req.user, res);
            } else {
                authGuest(res);
                console.log("--------------------------");
                console.log(req.cookies);
                console.log("--------------------------");
                //res.send("GUEST");
                /*
                res.render('index', { artifacts: result, username: 'Guest',
                    resin: resin, resinDate: resinDate, loggedIn: false})
                */
                //res.render('login');
            }
        })

        /*
        const checkUserLoggedIn = (req, res, next) => {
            req.user ? next(): res.redirect('/auth/google');
        }
        */

        app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

        app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
            function(req, res) {
                res.redirect('/');
            }
        );

        app.get('/auth/discord', passport.authenticate('discord'));

        app.get('/auth/discord/callback', passport.authenticate('discord', {failureRedirect: '/'}),
            function(req, res) {
                res.redirect('/');
            }
        );

        app.post('/logout', (req, res) => {
            //req.logout();
            //req.session = null;
            req.session.destroy(() => {
                res.redirect('/');
            })
        })

        app.post('/delete', (req, res) => {
            var remove = req.body.ids;
            const idArr = checkAuth(req.user);
            const artifactsdb = client.db(req.user.provider);
            const artifactsCollection = artifactsdb.collection(idArr[1]);
            var removeIdArr = [];

            remove.forEach(id => {
                removeIdArr.push(ObjectId(id));
            });

            deleteArtifact(res, removeIdArr, artifactsCollection);
        });

        app.post('/level', (req, res) => {
            const idArr = checkAuth(req.user);
            const artifactsdb = client.db(req.user.provider);
            const artifactsCollection = artifactsdb.collection(idArr[1]);
            var selected = req.body.id;
            var fodder = req.body.fodder;

            levelArtifact(res, artifactsCollection, selected, fodder, ObjectId);
        })
    });

function checkAuth(user) {
    if (user.provider == 'discord') {
        return [{'userID': user.id}, user.id];
    } else if (user.provider == 'google') {
        return [{'email': user.emails[0].value}, user.emails[0].value];
    }
}

function rollAuth(user, res, req) {
    console.log(user);
    const idArr = checkAuth(user);
    const artifactsdb = databases[user.provider];
    const userCollection = usersdb.collection(user.provider);

    const artifactsCollection = artifactsdb.collection(idArr[1]);
    (async ()=> {
        await syncResinCount(discordUsers, {'userID': user.id})
        rollArtifacts(res, req.body.domain, artifactsCollection, userCollection, idArr[0]);
    })()
}

function authUser(user, res) {
    /*
    console.log('---------------------------------------------------');
    console.log("CURRENT DATE: " + Math.floor(Date.now()/1000))
    */
    if(user.provider == 'discord') {
        const userid = user.id;
        const artifactsCollection = discorddb.collection(userid);
        var resin = 160;
        var resinDate = -1;
        discordUsers.findOne({'userID': userid})
            .then(result => {
                if(result == null) {
                    discordUsers.insertOne(
                        {
                            'userID': userid,
                            'username': user.username,
                            'discriminator': user.discriminator,
                            'resin': 160,
                            'nextResinUpdate': -1,
                        }
                    )
                    console.log("RESULT NULL")
                    artifactsCollection.find().sort({$natural:-1}).toArray()
                        .then(results => {
                            res.render('index', { artifacts: results, username: user.username,
                                resin: resin, resinDate: resinDate, loggedIn: true})
                        })
                        .catch(error => console.log(error))
                } else {
                    (async ()=> {
                        var userObj = await syncResinCount(discordUsers, {'userID': userid})
                        resin = userObj['resin'];
                        resinDate = userObj['nextResinUpdate'];
                        artifactsCollection.find().sort({$natural:-1}).toArray()
                            .then(results => {
                                /*
                                console.log("RENDERING VIEW");
                                console.log("RESIN: " + resin);
                                console.log("RESINDATE: " +  resinDate);
                                */
                                res.render('index', { artifacts: results, username: user.username,
                                    resin: resin, resinDate: resinDate, loggedIn: true})
                            })
                            .catch(error => console.log(error))
                    })()
                }
            });
    }
    else if (user.provider == 'google') {
        const email = user.emails[0].value;
        const artifactsCollection = googledb.collection(email);
        var resin;
        googleUsers.findOne({'email': email})
            .then(result => {
                if(result == null) {
                    googleUsers.insertOne(
                        {
                            'email': email,
                            'resin': 160
                        }
                    )
                } else {
                    resin = result.resin;
                }
                artifactsCollection.find().sort({$natural:-1}).toArray()
                    .then(results => {
                        res.render('index', { artifacts: results, username: user.name.givenName, resin: resin, loggedIn: true})
                    })
                    .catch(error => console.log(error))
            });
    }
}

function signCookie(id) {
    const token = jwt.sign({_id: id}, 'secretstring', {expiresIn: '50000'},(err, token)=> {
        console.log('token: ');
        console.log(token);
        res.cookie('guestCookie', {token: token}, {signed: true,maxAge: 50000, httpOnly: true});
        res.redirect('/home');
    });
}

function authGuest(res) {
    const userid = 'ok';
    var resin = 160;
    var resinDate = -1;
    guestUsers.findOne({'_id': ObjectId(userid)})
        .then(result => {
            if(result == null) {
                guestUsers.insertOne(
                    {
                        'resin': 160,
                        'nextResinUpdate': -1,
                    }
                ).then(result => {
                    const id = result.insertedId.toString();
                    console.log("Signing cookie");
                    signCookie(id);
                    const artifactsCollection = guestdb.collection(id);
                    artifactsCollection.find().sort({$natural:-1}).toArray()
                        .then(results => {
                            res.render('index', { artifacts: results, username: 'Guest',
                                resin: resin, resinDate: resinDate, loggedIn: false})
                        })
                        .catch(error => console.log(error))
                });
            } else {
                (async ()=> {
                    var userObj = await syncResinCount(guestUsers, {'userID': userid})
                    resin = userObj['resin'];
                    resinDate = userObj['nextResinUpdate'];
                    const artifactsCollection = guestdb.collection(userid);
                    artifactsCollection.find().sort({$natural:-1}).toArray()
                        .then(results => {
                            /*
                                console.log("RENDERING VIEW");
                                console.log("RESIN: " + resin);
                                console.log("RESINDATE: " +  resinDate);
                                */
                            res.render('index', { artifacts: results, username: user.username,
                                resin: resin, resinDate: resinDate, loggedIn: false})
                        })
                        .catch(error => console.log(error))
                })()
            }
        });
}
export {app as genshinApp};
