import {decodeSubstatOrder, stringToNumStats} from './artifactModule.mjs';

const statsObjectTemplate = {
    'HP': [],
    'ATK': [],
    'DEF': [],
    'HP%': [],
    'ATK%': [],
    'DEF%': [],
    'Elemental Mastery': [],
    'Energy Recharge%': [],
    'CRIT Rate%': [],
    'CRIT DMG%': [],
}

function refreshStats(database){
    const statsObject = JSON.parse(JSON.stringify(statsObjectTemplate));
    database.listCollections().toArray((err, obj) => {
        obj.forEach(result => {
            if(result.name === 'statistics') {
                return;
            }
            const artifactCol = database.collection(result.name);
            var aggObj = artifactCol.aggregate([
                {$facet: {
                    "HP": [
                        {$match: {$and: [{'rarity': 5}, {'1': {$exists: true}}]}},
                        {$group: {'_id': null, 'values': {$push: '$1'}}},
                        {$project: {'_id': 0}},
                    ],
                    "ATK": [
                        {$match: {$and: [{'rarity': 5}, {'2': {$exists: true}}]}},
                        {$group: {'_id': null, 'values': {$push: '$2'}}},
                        {$project: {'_id': 0}},
                    ],
                    "DEF": [
                        {$match: {$and: [{'rarity': 5}, {'3': {$exists: true}}]}},
                        {$group: {'_id': null, 'values': {$push: '$3'}}},
                        {$project: {'_id': 0}},
                    ],
                    "HP%": [
                        {$match: {$and: [{'rarity': 5}, {'4': {$exists: true}}]}},
                        {$group: {'_id': null, 'values': {$push: '$4'}}},
                        {$project: {'_id': 0}},
                    ],
                    "ATK%": [
                        {$match: {$and: [{'rarity': 5}, {'5': {$exists: true}}]}},
                        {$group: {'_id': null, 'values': {$push: '$5'}}},
                        {$project: {'_id': 0}},
                    ],
                    "DEF%": [
                        {$match: {$and: [{'rarity': 5}, {'6': {$exists: true}}]}},
                        {$group: {'_id': null, 'values': {$push: '$6'}}},
                        {$project: {'_id': 0}},
                    ],
                    "Elemental Mastery": [
                        {$match: {$and: [{'rarity': 5}, {'7': {$exists: true}}]}},
                        {$group: {'_id': null, 'values': {$push: '$7'}}},
                        {$project: {'_id': 0}},
                    ],
                    "Energy Recharge%": [
                        {$match: {$and: [{'rarity': 5}, {'8': {$exists: true}}]}},
                        {$group: {'_id': null, 'values': {$push: '$8'}}},
                        {$project: {'_id': 0}},
                    ],
                    "CRIT Rate%": [
                        {$match: {$and: [{'rarity': 5}, {'9': {$exists: true}}]}},
                        {$group: {'_id': null, 'values': {$push: '$9'}}},
                        {$project: {'_id': 0}},
                    ],
                    "CRIT DMG%": [
                        {$match: {$and: [{'rarity': 5}, {'10': {$exists: true}}]}},
                        {$group: {'_id': null, 'values': {$push: '$10'}}},
                        {$project: {'_id': 0}},
                    ],
                }}
            ])
            aggObj.forEach(elem => {
                for(const stat in elem) {
                    if(elem[stat][0]) {
                        statsObject[stat].push(...(elem[stat][0]['values']));
                    }
                }
            })
        })

        for(const stat in statsObject){
            database.collection('statistics').updateOne(
                {'stat': stat},
                {$set: {'values': statsObject[stat]}},
                {upsert: true}
            )
        }
    })
}

async function compareStats(res, userid, list, database, ObjectId){
    var mongoList = [];
    list.forEach(id => {
        mongoList.push(ObjectId(id));
    })

    const statsCol = database.collection('statistics');
    const statsObj = {};

    await database.collection(userid).find({_id: {$in: mongoList}}).toArray()
        .then(async(arr) => {
            if (arr == null) {
                res.status(400).send("Bad request");
            }
            for(const artifact of arr) {
                var artifactID = artifact['_id'].toString();
                var stats = decodeSubstatOrder(artifact.subOrder, true);
                await statsCol.find({'stat': {$in: stats}}).toArray()
                    .then(docArr => {
                        statsObj[artifactID] = {};
                        docArr.forEach(statsDoc => {
                            const statName = statsDoc.stat;
                            const statVals = statsDoc.values;
                            statsObj[artifactID][statName] = {}
                            var sum = 0;
                            var lower = 0;
                            for(var i = 0; i < statVals.length; i++) {
                                sum += statVals[i];
                                if(statVals[i] < artifact[stringToNumStats[statName]]){
                                    lower++;
                                }
                            }

                            var percentile = Math.round(((lower/statVals.length)*100) * 100) / 100;
                            statsObj[artifactID][statName]['percentile'] = percentile;
                            statsObj[artifactID][statName]['count'] = statVals.length;
                            statsObj[artifactID][statName]['average'] = Math.round((sum/statVals.length)*100) /100;
                        })
                    })
            }
        })

    res.status(200).send(statsObj);
}

export {refreshStats, compareStats};
