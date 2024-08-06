/*import * as artifacts from 'artifacts.js';*/
const artifacts = {
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
}


const main_percentages = {
    flower: {
        'HP': {
            chance: 1,
            stats: {
                five: {zero: 717, max: 4780}
            }
        }
    },
    plume: {
        'ATK': {
            chance: 1,
            stats: {
                five: {zero: 47, max: 311}
            }
        }
    },
    sands: {
        'HP%': {
            chance: 0.2668,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'ATK%': {
            chance: 0.2666,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'DEF%': {
            chance: 0.2666,
            stats: {
                five: {zero: 8.7, max: 58.3}
            }
        },
        'Energy Recharge%': {
            chance: .1,
            stats: {
                five: {zero: 7.8, max: 51.8}
            }
        },
        'Elemental Mastery': {
            chance: .1,
            stats: {
                five: {zero: 28, max: 187}
            }
        }
    },
    goblet: {
        'HP%': {
            chance: 0.2668,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'ATK%': {
            chance: 0.2666,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'DEF%': {
            chance: 0.2666,
            stats: {
                five: {zero: 8.7, max: 58.3}
            }
        },
        'Pyro DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'Electro DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'Cryo DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'Hydro DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'Anemo DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'Geo DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'Physical DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {zero: 8.7, max :58.3}
            }
        },
        'Elemental Mastery': {
            chance: 0.025,
            stats: {
                five: {zero: 28, max: 187}
            }
        },
    },
    circlet: {
        'HP%': {
            chance: 0.2668,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'ATK%': {
            chance: 0.2666,
            stats: {
                five: {zero: 7, max: 46.6}
            }
        },
        'DEF%': {
            chance: 0.2666,
            stats: {
                five: {zero: 8.7, max: 58.3}
            }
        },
        'CRIT Rate%': {
            chance: 0.1,
            stats: {
                five: {zero: 4.7, max: 31.1}
            }
        },
        'CRIT DMG%': {
            chance: 0.1,
            stats: {
                five: {zero: 9.3, max: 62.2}
            }
        },
        'Healing Bonus%': {
            chance: 0.1,
            stats: {
                five: {zero: 5.4, max: 35.9}
            }
        },
        'Elemental Mastery': {
            chance: 0.04,
            stats: {
                five: {zero: 28, max: 187}
            }
        },
    }
}

sub_percentages = {
    'HP': {
        chance: 0.1364,
        stats: {
            five: [209.13, 239, 269.88, 299.75]
        }
    },
    'ATK': {
        chance: 0.1364,
        stats: {
            five: [13.62, 15.56, 17.51, 19.45]
        }
    },
    'DEF': {
        chance: 0.1364,
        stats: {
            five: [16.20, 18.52, 20.83, 23.15]
        }
    },
    'HP%': {
        chance: 0.0909,
        stats: {
            five: [4.08, 4.66, 5.25, 5.83]
        }
    },
    'ATK%': {
        chance: 0.0909,
        stats: {
            five: [4.08, 4.66, 5.25, 5.83]
        }
    },
    'DEF%': {
        chance: 0.0909,
        stats: {
            five: [5.1, 5.83, 6.56, 7.29]
        }
    },
    'Energy Recharge%': {
        chance: 0.0909,
        stats: {
            five: [4.53, 5.18, 5.83, 6.48]
        }
    },
    'Elemental Mastery': {
        chance: 0.0909,
        stats: {
            five: [16.32, 18.65, 20.98, 23.31]
        }
    },
    'CRIT Rate%': {
        chance: 0.0682,
        stats: {
            five: [2.72, 3.11, 3.5, 3.89]
        }
    },
    'CRIT DMG%': {
        chance: 0.0682,
        stats: {
            five: [5.44, 6.22, 6.99, 7.77]
        }
    },
}

function getRandInt(max){
    return Math.floor(Math.random() * max);
}
function weightedRand(spec, skipArr) {
    skipPerc = 0;
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

function rollArtifact(setName) {
    pickedSet = artifacts[setName];

    setArray = Object.keys(pickedSet);
    setIdx = getRandInt(setArray.length);

    randKey = setArray[setIdx];

    mainstat = weightedRand(main_percentages[randKey], []);
    initialMainVal = main_percentages[randKey][mainstat]['stats']['five']['zero'];

    initialArtifact = {
        name: pickedSet[randKey],
        set: setName,
        slot: randKey,
        main: mainstat,
        mainVal: initialMainVal,
    }

    numSubs = parseInt(weightedRand({'3': {chance: 0.75}, '4': {chance: 0.25}}, []));
    subStats = [];
    for(var i = 1; i <= numSubs; i++){
        subStats[i-1] = weightedRand(sub_percentages, [mainstat].concat(subStats));
        var statRoll = sub_percentages[subStats[i-1]]['stats']['five'][Math.floor(Math.random()*4)];
        initialArtifact['sub'+ i] = subStats[i-1];
        initialArtifact['sub'+ i + 'Val'] = statRoll;
    }

    fetch('/artifacts', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialArtifact),
    })
        .then(()=> {
           // window.location.href = "/";
        })
}


window.addEventListener('DOMContentLoaded', () => {
    const hidden_palace = document.getElementById('roll-hidden_palace')
    hidden_palace.addEventListener('click', () => {
        randNum = getRandInt(2);
        setName = "";
        if(randNum == 0){
            setName = 'crimson_witch'
        }
        else{
            setName = 'lavawalker';
        }

        rollArtifact(setName);
    })
    const vindagnyr  = document.getElementById('roll-vindagnyr')
    vindagnyr.addEventListener('click', () => {
        randNum = getRandInt(2);
        setName = "";
        if(randNum == 0){
            setName = 'icebreaker'
        }
        else{
            setName = 'heart_of_depth';
        }

        rollArtifact(setName);
    })
})
