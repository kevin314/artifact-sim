import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import {artifacts, main_percentages, sub_percentages, getRandInt, weightedRand} from './public/artifactModule.mjs';
import express from 'express'
import bodyParser from 'body-parser';

const app = express();
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

app.use(express.static('public'));

//import subdomain from 'express-subdomain'
/*
router.get('/', (req, res) => {
    res.send('subdomain!');
});
*/
//app.use(subdomain('subdomain', router));

//import vhost from 'vhost'
//import {genshinApp} from './subdomains/genshin/index.mjs';
//app.use(vhost('subdomain.wewe1234.com', genshinApp))

/*
app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
});
*/

const {MongoClient} = mongodb

import assert from 'assert';

const url = 'mongodb+srv://kevin314:kevin3.141592@cluster0.un2qo.mongodb.net/testproj?retryWrites=true&w=majority';

const client = new MongoClient(url);

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
            regularUsersCollection.updateMany(
                {'resin': {$lt: 160}},
                {$inc: {'resin': 1}}
            )
        }, 480000)

        app.post('/artifacts', (req, res) => {
            rollAuth(req.user, res, req);
        });

        /*
        app.get('/home', (req, res) => {
            console.log(req);
            res.send("yo");
        });
        */

        app.get('/failed', (req, res) => {
            res.send('<h1>Log in Failed :</h1>')
        });


        app.get('/test', (req, res) => {
                res.send('yo');
        })
        app.get('/', (req, res) => {
            /*
            res.send('main dom')
            res.end();
            */
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

        /*
        app.get('/auth/discord', (req, res) => {
            res.redirect('https://discord.com/api/oauth2/authorize?client_id=877069301578870814&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fhome&response_type=token&scope=identify');
        })
        */

        /*
        const checkUserLoggedIn = (req, res, next) => {
            req.user ? next(): res.redirect('/auth/google');
        }

        app.get('/home', checkUserLoggedIn, (req, res) => {
            const email = req.user.emails[0].value;
            const artifactsCollection = db.collection(email);

            var resin;
            regularUsersCollection.findOne({'email': email})
                .then(result => {
                    if(result == null) {
                        regularUsersCollection.insertOne(
                            {
                                'email': email,
                                'resin': 160
                            }
                        )
                        resin = 160;
                    } else {
                        resin = result.resin;
                    }
                    artifactsCollection.find().sort({$natural:-1}).toArray()
                        .then(results => {
                            res.render('index', { artifacts: results, username: req.user.displayName, resin: resin})
                        })
                        .catch(error => console.log(error))
                });

        });
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
            req.session = null;
            req.logout();
            res.redirect('');
        })
        /*
        app.get('/home', (req, res) => {
            const user = req.signedCookies;
            console.log('Signed cookies:')
            console.log(user);

            if(user.ck == null){
                res.redirect('/login');
            } else {
                regularUsersCollection.findOne(
                    {username: user.ck.username}
                )
                    .then(result => {
                        console.log("User is logged in");
                        console.log(typeof result._id);
                        console.log(result._id);

                        artifactsCollection = db.collection(JSON.stringify(result._id));
                        artifactsCollection.find().sort({$natural:-1}).toArray()
                            .then(results => {
                                //console.log(results)
                                res.render('index', { artifacts: results, username: result.username})
                            })
                            .catch(error => console.log(error))
                    });
            }

        });

        app.get('/', (req, res) => {
            res.redirect('/home');
        });

        app.get('/register', (req, res) => {
            const user = req.signedCookies;
            console.log('Register Signed cookies:')
            console.log(user);

            if(user.ck != null){
                res.redirect('/home');
            } else {
                res.render('register');
            }
        });

        app.post('/register', (req, res) => {
            const obj = req.body;
            obj['token'] = '';
            //console.log(obj);
            regularUsersCollection.findOne(
                {'username': obj.username,
                }
            )
                .then(result => {
                    if(result != null){
                        console.log("Username already in use");
                        res.render('register');
                    }
                    else{
                        regularUsersCollection.insertOne(obj).
                            then(result => {
                                db.createCollection
                                res.redirect('/login');
                            })
                    }
                })
        });

        app.get('/login', (req, res) => {
            const user = req.signedCookies;
            console.log('LOGIN Signed cookies:')
            console.log(user);

            if(user.ck != null){
                res.redirect('/home');
            } else {
                res.render('login');
            }
        });

        app.post('/login', (req, res) => {
            const obj = req.body;
            regularUsersCollection.findOne(
                {'username': obj.username}
            )
                .then(result => {
                    if(result == null){
                        console.log("Username not found");
                        res.redirect('/login');
                    }
                    else {
                        console.log("login id: " + result._id);
                        console.log("login user: " + result.username);
                        const token = jwt.sign({_id: result._id}, 'secretstring', {expiresIn: '50000'},(err, token)=> {
                                console.log('token: ');
                                console.log(token);
                                res.cookie('ck', {token: token, username: result.username}, {signed: true,maxAge: 50000, httpOnly: true});
                                res.redirect('/home');
                            });
                    }
                })
        });

        app.post('/logout', (req, res) => {
            const user = req.signedCookies;
            console.log('Register Signed cookies:')
            console.log(user);

            if(user.ck == null){
                res.redirect('/login');
            } else {
                regularUsersCollection.findOneAndUpdate(
                    {"username": user.ck.username},
                    {
                        $set: {token: ''},
                    },
                )
                    .then(result =>{
                        res.clearCookie('ck');
                        res.redirect('/login');
                    });
            }
        });
        */


        app.post('/delete', (req, res) => {
            var removeList = req.body.ids;
            const idArr = checkAuth(req.user);
            const artifactsdb = client.db(req.user.provider);
            const artifactsCollection = artifactsdb.collection(idArr[1]);
            //console.log(removeList);
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
            var selected = req.body.id;
            const idArr = checkAuth(req.user);
            const artifactsdb = client.db(req.user.provider);
            const artifactsCollection = artifactsdb.collection(idArr[1]);
            if(selected == undefined){
                res.redirect('/');
                return;
            }

            var selectedDoc = artifactsCollection.findOne({"_id": ObjectId(selected)})
                .then(obj => {
                    //console.log(obj);
                    //console.log(obj['level']);
                    if(obj['level'] >= 20) {
                        return;
                    }
                    levelArtifact(obj, selected, res, artifactsCollection);
                })
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

    userCollection.findOne(idArr[0])
        .then(result =>{
            if(result['resin'] < 5) {
                return;
            } else {
                userCollection.updateOne(
                    idArr[0],
                    {$inc: {'resin': -5}}
                )
                rollArtifact(res, req.body.set, artifactsCollection);
            }
        })
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
function listArtifacts(artifactsCollection){
    artifactsCollection.find().sort({$natural:-1}).toArray()
        .then(results => {
            res.send(results)
        })
        .catch(error => console.log(error))
}

function rollArtifact(res,setName, artifactsCollection) {
    var pickedSet = artifacts[setName];

    var setArray = Object.keys(pickedSet);
    var setIdx = getRandInt(setArray.length);

    var randKey = setArray[setIdx];

    var mainstat = weightedRand(main_percentages[randKey], []);
    var initialMainVal = main_percentages[randKey][mainstat]['stats']['five']['0'];

    var initialArtifact = {
        name: pickedSet[randKey],
        set: setName,
        slot: randKey,
        rarity: 5,
        level: 0,
        main: mainstat,
        mainVal: initialMainVal,
    }

    //console.log(JSON.stringify(initialArtifact));

    var numSubs = parseInt(weightedRand({'3': {chance: 0.75}, '4': {chance: 0.25}}, []));
    var subStats = [];
    for(var i = 1; i <= numSubs; i++){
        subStats[i-1] = weightedRand(sub_percentages, [mainstat].concat(subStats));
        var statRoll = sub_percentages[subStats[i-1]]['stats']['five'][Math.floor(Math.random()*4)];
        initialArtifact['sub'+ i] = subStats[i-1];
        initialArtifact['sub'+ i + 'Val'] = statRoll;
    }

    artifactsCollection.insertOne(initialArtifact)
        .then(() => {
            res.send(initialArtifact)
            //res.end();
        })
        .catch(error => console.error(error))
}

function levelArtifact(obj, selected, res, artifactsCollection){
    var updateJson = {};
    var numSubs = (Object.keys(obj).length - 8) / 2;

    var mainPercentages = main_percentages[obj['slot']][obj['main']]['stats']['five'];
    var mainKeys = Object.keys(mainPercentages);
    var mainInc = (mainPercentages[mainKeys[1]] - mainPercentages[mainKeys[0]])/ mainKeys[1];

    if((obj['level'] + 1) % 4 == 0){
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
                    res.send(result.value);
                });
        }
    } else {
            artifactsCollection.findOneAndUpdate(
                {"_id": ObjectId(selected)},
                { $inc: {
                    'level': 1,
                    'mainVal': mainInc,
                }},
                {returnDocument: "after"}
            )
                .then(result =>{
                    res.send(result.value);
                    //res.redirect('/');
                });
    }
}

export {app as genshinApp};
