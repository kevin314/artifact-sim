import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import {artifactSchema, artifacts, artifactSets, numToStringSets,  numToStringSlots, stringToNumStats, convertArtifacts, decodeSubstatOrder, encodeSubstatOrder, main_percentages, sub_percentages, getRandInt, weightedRand, listArtifacts, rollArtifacts, levelArtifact, deleteArtifact, syncResinCount} from './public/artifactModule.mjs';
import {discordAPI} from './routes/api.mjs';
import express from 'express'
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';

//import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import cookieSession from 'express-session';
import './passport.mjs';

import session from 'express-session';
import passport from 'passport';

import mongodb from 'mongodb';
const {ObjectId} = mongodb;
const {MongoClient} = mongodb;
import assert from 'assert';

//import {createCompressionTable, compressObject, decompressObject} from 'jsonschema-key-compression';


//const compressionTable = createCompressionTable(artifactSchema);

const router = express.Router();
const port = 3000;

const app = express();

app.set('trust proxy', 1);
app.all('*', (req, res, next) => {
	let origin = req.get('origin');
    //console.log("origin: " + origin)
	if (!origin) {
		origin = "*";
	}
	res.header("Access-Control-Allow-Origin", origin);
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT"); 
	res.header("Access-Control-Allow-Credentials", "true");
	req.headers["x-forwarded-proto"] = "https";
	next();
});

app.use(favicon(__dirname + '/public/favicon.ico'))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cookieParser('secretstring'));

app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    //This line breaks login for users
    //cookie: {sameSite: "none", secure: true},
}));

app.use((req, res, next)=>{
	//console.log(req.headers);
	req["session"].secure = true;
	next();

});

app.use(passport.initialize());
app.use(passport.session());
app.use('/api/discord', discordAPI);

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

        regularUsersCollection = usersdb.collection('regular');
        discordUsers = usersdb.collection('discord');
        googleUsers = usersdb.collection('google');
        guestUsers = usersdb.collection('guest');

        app.get('/test', (req, res) => {
            console.log('yo');
        })

        app.get('/', (req, res) => {
            /*
            console.log("in main /")
            console.log(req.user);
            console.log(req.signedCookies)
            */
            //console.log(req.session);
            if(req.user) {
                authUser(req.user, res, true);
            } else {
                var cookieid;
                if(req.signedCookies['guestCookie']){
                    cookieid = req.signedCookies['guestCookie']['_id'];
                }
                authGuest(res, cookieid, false, true);
            }
        })

        app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
            function(req, res) {
                if(req.signedCookies['googleRedirectURI']){
                    let uri = req.signedCookies['googleRedirectURI']['URI'];
                    /*
                    console.log('---------------')
                    console.log(uri);
                    console.log('---------------')
                    */
                    res.redirect(uri);
                } else {
                    console.log("redirect")
                    res.redirect('/');
                }
            }
        );

        app.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }),
            function(req, res) {
                console.log("discord callback")
                console.log(req.signedCookies)
                if(req.signedCookies['discordRedirectURI']){
                    let uri = req.signedCookies['discordRedirectURI']['URI'];
                    console.log('---------------')
                    console.log(uri);
                    console.log('---------------')
                    res.redirect(uri);
                } else {
                    console.log("redirect")
                    res.redirect('/');
                }
            }
        );

        app.post('/artifacts', async (req, res) => {
            const idArr = await checkAuth(req, res, true);
            const artifactsdb = client.db(idArr[0]);
            console.log(idArr)
            const userCollection = usersdb.collection(idArr[0]);

            const artifactsCollection = artifactsdb.collection(idArr[2]);
            (async ()=> {
                await syncResinCount(userCollection, idArr[1])
                rollArtifacts(res, req.body.domain, artifactsCollection, userCollection, idArr[1]);
            })()
        });

        app.post('/delete', async (req, res) => {
            var remove = req.body.ids;
            const idArr = await checkAuth(req, res);
            const artifactsdb = client.db(idArr[0]);
            const artifactsCollection = artifactsdb.collection(idArr[2]);
            var removeIdArr = [];

            if (remove) {
                remove.forEach(id => {
                    removeIdArr.push(ObjectId(id));
                });
            }

            deleteArtifact(res, removeIdArr, artifactsCollection);
        });

        app.post('/level', async (req, res) => {
            const idArr = await checkAuth(req, res);
            const artifactsdb = client.db(idArr[0]);
            const artifactsCollection = artifactsdb.collection(idArr[2]);
            var selected = req.body.id;
            var fodder = req.body.fodder;

            levelArtifact(res, artifactsCollection, selected, fodder, ObjectId);
        })

        app.post('/logout', (req, res) => {
            //req.logout();
            //req.session = null;
            req.session.destroy(() => {
                res.redirect('/');
            })
        })
    });

async function checkAuth(req, res, createGuest=false) {
    if(req.user) {
        var user = req.user;
        if (user.provider == 'discord') {
            return ['discord', {'userID': user.id}, user.id];
        } else if (user.provider == 'google') {
            return ['google', {'email': user.emails[0].value}, user.emails[0].value];
        }
    } else {
        /*
        if(req.signedCookies['guestCookie'] == null) {
            authGuest();
            //res.send("Unauthorized");
            return;
        }
        */
        let cookieid;
        if(req.signedCookies['guestCookie']){
            cookieid = req.signedCookies['guestCookie']['_id'];
        } 
        if(createGuest === true) {
            cookieid = await authGuest(res, cookieid, true, false);
            //cookieid = req.signedCookies['guestCookie']['_id'];
        } else {
            res.locals.sendEmpty = true;
            console.log("Send empty")
        }
        var mongocookieid;
        try {
            mongocookieid = ObjectId(cookieid);
        } catch (error) {
            res.send(error);
            return;
        }
        return ['guest', {'_id': mongocookieid}, cookieid];
    }
}

function renderArtifacts(provider){
}

function authUser(user, res, isRender=false) {
    console.log("authUser")
    if(user.provider === 'discord') {
        const userid = user.id;
        const artifactsCollection = discorddb.collection(userid);
        let resin = 160;
        let resinDate = -1;
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
                    
                    if(isRender===true){
                        artifactsCollection.find().sort({$natural:-1}).toArray()
                            .then(results => {
                                var artifactsArr = convertArtifacts(results);
                                res.render('index', { artifacts: artifactsArr, username: user.username,
                                    resin: resin, resinDate: resinDate, loggedIn: true})
                            })
                            .catch(error => console.log(error))
                    }
                    
                } else {
                    (async ()=> {
                        var userObj = await syncResinCount(discordUsers, {'userID': userid})
                        
                        
                        resin = userObj['resin'];
                        resinDate = userObj['nextResinUpdate'];
                        if(isRender===true){
                            artifactsCollection.find().sort({$natural:-1}).toArray()
                                .then(results => {
                                    var artifactsArr = convertArtifacts(results);

                                    /*
                                    var compressedArr = []
                                    results.forEach(elem => {
                                        compressedArr.push(compressObject(compressionTable, elem));
                                    })
                                    console.log('Compressed Arr');
                                    console.log(compressedArr);
                                    console.log(compressedArr[0]['|c']);
                                    console.log('===========================');

                                    var decompressedArr = []
                                    compressedArr.forEach(elem => {
                                        decompressedArr.push(decompressObject(compressionTable, elem));
                                    })
                                    console.log('Decompressed Arr');
                                    console.log(decompressedArr);
                                    console.log(decompressedArr[0]['levelHistory']);
                                    console.log('===========================');
                                    */

                                    res.render('index', { artifacts: artifactsArr, username: user.username,
                                        resin: resin, resinDate: resinDate, loggedIn: true})
                                })
                                .catch(error => console.log(error))
                            }
                    })()
                }
            });
    }
    else if (user.provider == 'google') {
        const email = user.emails[0].value;
        const artifactsCollection = googledb.collection(email);
        let resin = 160;
        let resinDate = -1;
        googleUsers.findOne({'email': email})
            .then(result => {
                if(result == null) {
                    googleUsers.insertOne(
                        {
                            'email': email,
                            'resin': 160,
                            'nextResinUpdate': -1,
                        }
                    )
                    if(isRender===true){
                        artifactsCollection.find().sort({$natural:-1}).toArray()
                        .then(results => {
                            var artifactsArr = convertArtifacts(results);
                            res.render('index', { artifacts: artifactsArr, username: user.name.givenName, resin: resin, resinDate: resinDate, loggedIn: true})
                        })
                        .catch(error => console.log(error))
                    }
                } else {
                    (async ()=> {
                        var userObj = await syncResinCount(googleUsers, {'email': email})
                        if(isRender===true){
                            resin = userObj['resin'];
                            resinDate = userObj['nextResinUpdate'];
                            artifactsCollection.find().sort({$natural:-1}).toArray()
                                .then(results => {
                                    /*
                                    console.log("RENDERING VIEW");
                                    console.log("RESIN: " + resin);
                                    console.log("RESINDATE: " +  resinDate);
                                    */
                                    var artifactsArr = convertArtifacts(results);
                                    res.render('index', { artifacts: artifactsArr, username: user.name.givenName,
                                        resin: resin, resinDate: resinDate, loggedIn: true})
                                })
                                .catch(error => console.log(error))
                            }
                    })()
                }
            });
    }
}

async function authGuest(res, cookieid, createGuest=false, isRender=false) {
    return await new Promise((resolve, reject) => {
        //console.log("authGuest")
        var userid = cookieid;
        try {
            //console.log('1')
            userid = ObjectId(userid);
            guestUsers.findOne({'_id': userid})
            .then(result => {
                //console.log('1a')
                if(result == null) {
                    //console.log('2');
                    //console.log("No guest user with associated cookie")
                    if(createGuest === true){
                        insertGuest(resolve, res);
                    }
                    if(isRender===true){
                        var resin = 160;
                        var resinDate = -1;
                        if(cookieid === undefined){
                            res.render('index', { artifacts: [], username: 'Guest',
                                    resin: resin, resinDate: resinDate, loggedIn: false})
                        } else {
                            const artifactsCollection = guestdb.collection(cookieid);
                            artifactsCollection.find().sort({$natural:-1}).toArray()
                                .then(results => {
                                    var artifactsArr = convertArtifacts(results);
                                    res.render('index', { artifacts: artifactsArr, username: 'Guest',
                                        resin: resin, resinDate: resinDate, loggedIn: false})
                                })
                                .catch(error => console.log(error))
                        }
                    }
                } else {
                    //console.log('3');
                    (async ()=> {
                        var userObj = await syncResinCount(guestUsers, {'_id': userid})
                        resolve(userid.toString());
                        console.log("Resolved cookie")
                        if(isRender===true){
                            var resin = userObj['resin'];
                            var resinDate = userObj['nextResinUpdate'];
                            const artifactsCollection = guestdb.collection(userid.toString());
                            artifactsCollection.find().sort({$natural:-1}).toArray()
                                .then(results => {
                                    var artifactsArr = convertArtifacts(results);
                                    res.render('index', { artifacts: artifactsArr, username: 'Guest',
                                        resin: resin, resinDate: resinDate, loggedIn: false})
                                })
                                .catch(error => console.log(error))
                        }
                    })()
                }
            });
        } catch (error) {
            console.log("No usable userid cookie")
            insertGuest(res);
            if(isRender === true){
                const artifactsCollection = guestdb.collection(userid.toString());
                artifactsCollection.find().sort({$natural:-1}).toArray()
                    .then(results => {
                        var artifactsArr = convertArtifacts(results);
                        res.render('index', { artifacts: artifactsArr, username: 'Guest',
                            resin: resin, resinDate: resinDate, loggedIn: false})
                    })
                    .catch(error => console.log(error))
            }
        }
    })
}

function insertGuest(resolve, res) {
    guestUsers.insertOne(
        {
            'resin': 160,
            'nextResinUpdate': -1,
        }
    ).then(result => {
        const id = result.insertedId.toString();
        signCookie(res, id);
        console.log('signed')
        resolve(id);
        console.log("Resolved cookie")
        //const artifactsCollection = guestdb.collection(id);
    })
}

function signCookie(res, id) {
    res.cookie('guestCookie', {_id: id}, {signed: true, maxAge: 7776000000, httpOnly: true});
    //res.redirect('/');
}

export {app as genshinApp, authUser, authGuest, checkAuth, insertGuest};
