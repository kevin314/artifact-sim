import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import {artifacts, main_percentages, sub_percentages, getRandInt, weightedRand, listArtifacts, rollArtifact, levelArtifact, deleteArtifact} from './public/artifactModule.mjs';
import {discordAPI} from './routes/api.mjs';
import express from 'express'
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';

const app = express();
app.use(favicon(__dirname + '/public/favicon.ico'))

app.use('/api/discord', discordAPI);

const router = express.Router();
const port = 3000;

import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import cookieSession from 'cookie-session';
import './passport.mjs';

import session from 'express-session';
import passport from 'passport';


app.use(cookieSession({
    name: 'genshin-session',
    keys: ['key1, key2']
}));


app.use(passport.initialize());
app.use(passport.session());

import mongodb from 'mongodb';
const {ObjectId} = mongodb;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('secretstring'));

app.use(express.static(__dirname + '/public'));

//import subdomain from 'express-subdomain'
/*
router.get('/', (req, res) => {
    res.send('subdomain!');
});
*/
//app.use(subdomain('subdomain', router));

//import vhost from 'vhost'
//import {genshinApp} from './subdomains/genshin/index.mjs';
//app.use(vhost('subdomain.example.com', genshinApp))

const {MongoClient} = mongodb

import assert from 'assert';

const url = 'mongodb+srv://kevin314:kevin3.141592@cluster0.un2qo.mongodb.net/testproj?retryWrites=true&w=majority';

//const client = new MongoClient(url);

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

const databases = {};
var discorddb, googledb, usersdb;
var regularUsersCollection, discordUsers, googleUsers;

MongoClient.connect(url, { useUnifiedTopology:
    true })
/*assert.equal(null, err);})*/
    .then(client => {
        console.log("Connected to Mongo server");
        discorddb = client.db('discord');
        googledb = client.db('google');
        usersdb = client.db('usersdb');
        databases['discord'] = discorddb;
        databases['google'] = googledb;

        var userid;

        regularUsersCollection = usersdb.collection('regular');
        discordUsers = usersdb.collection('discord');
        googleUsers = usersdb.collection('google');

        setInterval(()=> {
            discordUsers.updateMany(
                {'resin': {$lt: 160}},
                {$inc: {'resin': 1}}
            )
            googleUsers.updateMany(
                {'resin': {$lt: 160}},
                {$inc: {'resin': 1}}
            )
        }, 300000)

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
            if(req.user) {
                //console.log(req.user);
                authUser(req.user, res);
            } else {
                res.render('login');
            }
        })
        const checkUserLoggedIn = (req, res, next) => {
            req.user ? next(): res.redirect('/auth/google');
        }

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
            req.session = null;
            req.logout();
            res.redirect('');
        })

        app.post('/delete', (req, res) => {
            var removeList = req.body.ids;
            const idArr = checkAuth(req.user);
            const artifactsdb = client.db(req.user.provider);
            const artifactsCollection = artifactsdb.collection(idArr[1]);
            //console.log(removeList);
            deleteArtifact(res, removeList, artifactsCollection, ObjectId);
        });

        app.post('/level', (req, res) => {
            var selected = req.body.id;
            const idArr = checkAuth(req.user);
            const artifactsdb = client.db(req.user.provider);
            const artifactsCollection = artifactsdb.collection(idArr[1]);
            if(selected == undefined){
                res.redirect('/');
                return;
            }
            levelArtifact(res, artifactsCollection, ObjectId(selected));
        })
    });

function checkAuth(user) {
    if (user.provider == 'discord') {
        return [{'username': user.username, 'discriminator': user.discriminator}, user.username+'#'+user.discriminator];
    } else if (user.provider == 'google') {
        return [{'email': user.emails[0].value}, user.emails[0].value];
    }
}

function rollAuth(user, res, req) {
    const idArr = checkAuth(user);
    const artifactsdb = databases[user.provider];
    const userCollection = usersdb.collection(user.provider);

    const artifactsCollection = artifactsdb.collection(idArr[1]);

    rollArtifact(res, req.body.domain, artifactsCollection, userCollection, idArr[0]);
}

function authUser(user, res) {
    if(user.provider == 'discord') {
        const id = user.username +'#'+ user.discriminator;
        const artifactsCollection = discorddb.collection(id);
        var resin;
        discordUsers.findOne({'username': user.username, 'discriminator': user.discriminator})
            .then(result => {
                if(result == null) {
                    discordUsers.insertOne(
                        {
                            'username': user.username,
                            'discriminator': user.discriminator,
                            'resin': 160
                        }
                    )
                } else {
                    resin = result.resin;
                }
                artifactsCollection.find().sort({$natural:-1}).toArray()
                    .then(results => {
                        res.render('index', { artifacts: results, username: user.username, resin: resin})
                    })
                    .catch(error => console.log(error))
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
                        res.render('index', { artifacts: results, username: user.name.givenName, resin: resin})
                    })
                    .catch(error => console.log(error))
            });
    }
}

export {app as genshinApp};
