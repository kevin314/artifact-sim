import {artifacts, main_percentages, sub_percentages, getRandInt, weightedRand} from './public/artifactModule.mjs';
import express from 'express'
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import cookieSession from 'cookie-session';
import './passport.mjs';

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('secretstring'));

app.use(express.static('public'));
app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
});

const {MongoClient} = mongodb

import assert from 'assert';

const url = 'mongodb+srv://kevin314:kevin3.141592@cluster0.un2qo.mongodb.net/testproj?retryWrites=true&w=majority';

const dbName = 'testproj';

const client = new MongoClient(url);

MongoClient.connect(url, { useUnifiedTopology:
    true })
/*assert.equal(null, err);})*/
    .then(client => {
        console.log("Connected to server");
        const db = client.db(dbName);
        const usersdb = client.db('usersdb');

        var userid;

        const regularUsersCollection = usersdb.collection('regular');

        setInterval(()=> {
            regularUsersCollection.updateMany(
                {'resin': {$lt: 160}},
                {$inc: {'resin': 1}}
            )
        }, 480000)

        app.post('/artifacts', (req, res) => {
            const email = req.user.emails[0].value;
            const artifactsCollection = db.collection(email);

            const user = regularUsersCollection.findOne({email: email})
                .then(result =>{
                    if(result['resin'] < 5) {
                        return;
                    } else {
                        regularUsersCollection.updateOne(
                            {'email': email},
                            {$inc: {'resin': -5}}
                        )
                        rollArtifact(res, req.body.set,artifactsCollection);
                    }
                })
        });


        app.get('/', (req, res) => {
            res.redirect('/home');
        });

        app.get('/failed', (req, res) => {
            res.send('<h1>Log in Failed :(</h1>')
        });

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

        app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

        app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
            function(req, res) {
                res.redirect('/home');
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
            const email = req.user.emails[0].value;
            const artifactsCollection = db.collection(email);
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
            const email = req.user.emails[0].value;
            const artifactsCollection = db.collection(email);
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

