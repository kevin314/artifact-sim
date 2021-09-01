const artifacts = {
    hidden_palace: {
        crimson_witch: {
            flower: "Witch's Flower of Blaze",
            plume: "Witch's Ever-Burning Plume",
            sands: "Witch's End Time",
            goblet: "Witch's Heart Flames",
            circlet: "Witch's Scorching Hat",
        },

        lavawalker: {
            flower: "Lavawalker's Resolution",
            plume: "Lavawalker's Salvation",
            sands: "Lavawalker's Torment",
            goblet: "Lavawalker's Epiphany",
            circlet: "Lavawalker's Wisdom",
        },
    },

    vindagnyr: {
        icebreaker: {
            flower: "Snowswept Memory",
            plume: "Icebreaker's Resolve",
            sands: "Frozen Homeland's Demise",
            goblet: "Frost-Weaved Dignity",
            circlet: "Broken Rime's Echo",
        },

        heart_of_depth: {
            flower: "Gilded Corsage",
            plume: "Gust of Nostalgia",
            sands: "Copper Compass",
            goblet: "Goblet of Thundering Deep",
            circlet: "Wine-Stained Tricorne",
        },
    },
}

const main_percentages = {
    flower: {
        'HP': {
            chance: 1,
            stats: {
                five: {0: 717, 20: 4780},
                four: {0: 645, 16: 3571},
            }
        }
    },
    plume: {
        'ATK': {
            chance: 1,
            stats: {
                five: {0: 47, 20: 311},
                four: {0: 42, 16: 232},
            }
        }
    },
    sands: {
        'HP%': {
            chance: 0.2668,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'ATK%': {
            chance: 0.2666,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'DEF%': {
            chance: 0.2666,
            stats: {
                five: {0: 8.7, 20: 58.3},
                four: {0: 7.9, 16: 43.5},
            }
        },
        'Energy Recharge%': {
            chance: .1,
            stats: {
                five: {0: 7.8, 20: 51.8},
                four: {0: 7, 16: 38.7},
            }
        },
        'Elemental Mastery': {
            chance: .1,
            stats: {
                five: {0: 28, 20: 187},
                four: {0: 25, 16: 139},
            }
        }
    },
    goblet: {
        'HP%': {
            chance: 0.2668,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'ATK%': {
            chance: 0.2666,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'DEF%': {
            chance: 0.2666,
            stats: {
                five: {0: 8.7, 20: 58.3},
                four: {0: 7.9, 16: 43.5},
            }
        },
        'Pyro DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'Electro DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'Cryo DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'Hydro DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'Anemo DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'Geo DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'Physical DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 8.7, 20 :58.3},
                four: {0: 7.9, 16: 43.5},
            }
        },
        'Elemental Mastery': {
            chance: 0.025,
            stats: {
                five: {0: 28, 20: 187},
                four: {0: 25, 16: 139},
            }
        },
    },
    circlet: {
        'HP%': {
            chance: 0.2668,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'ATK%': {
            chance: 0.2666,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
            }
        },
        'DEF%': {
            chance: 0.2666,
            stats: {
                five: {0: 8.7, 20: 58.3},
                four: {0: 7.9, 16: 43.5},
            }
        },
        'CRIT Rate%': {
            chance: 0.1,
            stats: {
                five: {0: 4.7, 20: 31.1},
                four: {0: 4.2, 16: 23.2},
            }
        },
        'CRIT DMG%': {
            chance: 0.1,
            stats: {
                five: {0: 9.3, 20: 62.2},
                four: {0: 8.4, 16: 46.4},
            }
        },
        'Healing Bonus%': {
            chance: 0.1,
            stats: {
                five: {0: 5.4, 20: 35.9},
                four: {0: 4.8, 16: 26.8},
            }
        },
        'Elemental Mastery': {
            chance: 0.04,
            stats: {
                five: {0: 28, 20: 187},
                four: {0: 25, 16: 139},
            }
        },
    }
}

const sub_percentages = {
    'HP': {
        chance: 0.1364,
        stats: {
            five: [209.13, 239, 269.88, 299.75],
            four: [167.3, 191.2, 215.1, 239],
        }
    },
    'ATK': {
        chance: 0.1364,
        stats: {
            five: [13.62, 15.56, 17.51, 19.45],
            four: [10.89, 12.45, 14, 15.56],
        }
    },
    'DEF': {
        chance: 0.1364,
        stats: {
            five: [16.20, 18.52, 20.83, 23.15],
            four: [12.96, 14.82, 16.67, 18.52],
        }
    },
    'HP%': {
        chance: 0.0909,
        stats: {
            five: [4.08, 4.66, 5.25, 5.83],
            four: [3.26, 3.73, 4.2, 4.66],
        }
    },
    'ATK%': {
        chance: 0.0909,
        stats: {
            five: [4.08, 4.66, 5.25, 5.83],
            four: [3.26, 3.73, 4.2, 4.66],
        }
    },
    'DEF%': {
        chance: 0.0909,
        stats: {
            five: [5.1, 5.83, 6.56, 7.29],
            four: [4.08, 4.66, 5.25, 5.83],
        }
    },
    'Energy Recharge%': {
        chance: 0.0909,
        stats: {
            five: [4.53, 5.18, 5.83, 6.48],
            four: [3.63, 4.14, 4.66, 5.18],
        }
    },
    'Elemental Mastery': {
        chance: 0.0909,
        stats: {
            five: [16.32, 18.65, 20.98, 23.31],
            four: [13.06, 14.92, 16.79, 18.56],
        }
    },
    'CRIT Rate%': {
        chance: 0.0682,
        stats: {
            five: [2.72, 3.11, 3.5, 3.89],
            four: [2.18, 2.49, 2.8, 3.11],
        }
    },
    'CRIT DMG%': {
        chance: 0.0682,
        stats: {
            five: [5.44, 6.22, 6.99, 7.77],
            four: [4.35, 4.97, 5.6, 6.22],
        }
    },
}

function getRandInt(max){
    return Math.floor(Math.random() * max);
}
function weightedRand(spec, skipArr) {
    var skipPerc = 0;
    skipArr.forEach(stat => {
        if(sub_percentages[stat]) {
            skipPerc += sub_percentages[stat]['chance'];
        }
    });

    var i, sum=0, r=Math.random() * (1-skipPerc);
    for (i in spec) {
        if(skipArr.includes(i)){
            continue;
        }
        sum += spec[i].chance;
        if (r <= sum) {
            return i;
        }
    }
}
function listArtifacts(res, artifactsCollection){
    artifactsCollection.find().sort({$natural:-1}).toArray()
        .then(results => {
            res.send(results)
        })
        .catch(error => console.log(error))
}
function rollArtifact(res, domainName, artifactsCollection, userCollection, userQuery) {
    userCollection.findOne(userQuery)
        .then(result =>{
            if(result['resin'] < 5) {
                res.send("Insufficient resin");
                return;
            } else {
                userCollection.updateOne(
                    userQuery,
                    {$inc: {'resin': -5}}
                )

                var pickedDomain = artifacts[domainName];
                var keys = Object.keys(pickedDomain);
                var setName = keys[keys.length*Math.random() << 0];
                var pickedSet = pickedDomain[setName];

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
        })
}

function levelArtifact(res, artifactsCollection, artifactID){
    var selectedDoc = artifactsCollection.findOne({"_id": artifactID})
        .then(obj => {
            //console.log(obj);
            //console.log(obj['level']);
            if(obj['level'] >= 20) {
                return;
            } else {
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
                            {"_id": artifactID},
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
                            {"_id": artifactID},
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
                        {"_id": artifactID},
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
        })
}

function deleteArtifact(res, removeList, artifactsCollection, ObjectId) {
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
}

export{artifacts, main_percentages, sub_percentages, getRandInt, weightedRand, listArtifacts, rollArtifact, levelArtifact, deleteArtifact}
