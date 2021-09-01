import express from 'express';
import bodyParser from 'body-parser';
import {listArtifacts, rollArtifact, levelArtifact, deleteArtifact} from '../public/artifactModule.mjs';
import mongodb from 'mongodb';
const {MongoClient, ObjectId} = mongodb;
//import {getClient} from '../mongo.mjs';
//import clientPromise from '../index.mjs';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


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
        router.get('/users/:username/artifacts', (req, res) => {
            console.log('GET ARTIFACTS');
            console.log(req.params);
            const strArr = req.params['username'].split(':');
            const username = strArr[0];
            const disc = strArr[1];
            listArtifacts(res, discorddb.collection(username+'#'+disc));
            //res.send('get artifacts');
        })

        // Roll artifacts for a user
        router.post('/users/:username/artifacts', (req, res) => {
            console.log('ROLL');
            console.log(req.params);
            const strArr = req.params['username'].split(':');
            const username = strArr[0];
            const disc = strArr[1];
            const query = {'username':username, 'discriminator': disc};
            console.log(req.body);
            const setName = req.body.domain;
            rollArtifact(res, setName, discorddb.collection(username+'#'+disc), discordUsers, query);
            //res.send('roll artifacts');
        })

        // Level artifact
        router.put('/users/:username/artifacts/:artifactid', (req, res) => {
            console.log('LEVEL');
            console.log(req.params);
            const strArr = req.params['username'].split(':');
            const username = strArr[0];
            const disc = strArr[1];
            const id = req.params['artifactid'];
            levelArtifact(res, discorddb.collection(username+'#'+disc), ObjectId(id));
            //res.send('level artifact');
        })

        // Get user
        router.get('/users/:username', (req, res) => {
            console.log('USER');
            console.log(req.params);
            const strArr = req.params['username'].split(':');
            const username = strArr[0];
            const disc = strArr[1];
            const query = {'username':username, 'discriminator': disc};
            discordUsers.findOne(query)
                .then(result => {
                    res.send(result);
                });
        })
})
export {router as discordAPI}

