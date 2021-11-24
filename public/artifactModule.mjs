const schemaStats = {
    1: {type: "number"},
    2: {type: "number"},
    3: {type: "number"},
    4: {type: "number"},
    5: {type: "number"},
    6: {type: "number"},
    7: {type: "number"},
    8: {type: "number"},
    9: {type: "number"},
    10: {type: "number"},
}

const artifactSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    properties: {
        _id: {type: "number"},
        set: {type: "number"},
        slot: {type: "number"},
        rarity: {type: "number"},
        level: {type: "number"},
        cumulativeXP: {type: "number"},
        requiredCumulativeXP: {type: "number"},
        requiredXP: {type: "number"},
        main: {type: "number"},
        mainVal: {type: "number"},
        locked: {type: "boolean"},
        levelHistory: {
            type: "object",
            properties: {
                4: {type: "object", properties: {...schemaStats}},
                8: {type: "object", properties: {...schemaStats}},
                12: {type: "object", properties: {...schemaStats}},
                16: {type: "object", properties: {...schemaStats}},
                20: {type: "object", properties: {...schemaStats}},
            }
        },
        subOrder: {type: "number"},
        ...schemaStats,
    },
    required: ["set", "slot", "rarity", "level", "cumulativeXP", "requiredCumulativeXP", "requiredXP", "main", "mainVal", "locked", "levelHistory", "subOrder"],
}

const rarityEnums = {
    3: 'three',
    4: 'four',
    5: 'five',
}

const baseXP = {
    3: 1260,
    4: 2520,
    5: 3780,
}

const cumulativeXPs = {
    5: {
        1: 3000,
        2: 6725,
        3: 11150,
        4: 16300,
        5: 22200,
        6: 28875,
        7: 36375,
        8: 44725,
        9: 53950,
        10: 64075,
        11: 75125,
        12: 87150,
        13: 100175,
        14: 115325,
        15: 132925,
        16: 153300,
        17: 176800,
        18: 203850,
        19: 234900,
        20: 270475,
        21: 270475,
    },
    4: {
        1: 2400,
        2: 5375,
        3: 8925,
        4: 13050,
        5: 17775,
        6: 23125,
        7: 29125,
        8: 35800,
        9: 43175,
        10: 51275,
        11: 60125,
        12: 69750,
        13: 80175,
        14: 92300,
        15: 106375,
        16: 122675,
        17: 122675,
    },
    3: {
        1: 1800,
        2: 4025,
        3: 6675,
        4: 9775,
        5: 13325,
        6: 17325,
        7: 21825,
        8: 26825,
        9: 32350,
        10: 38425,
        11: 45050,
        12: 52275,
        13: 52275,
    },
}

const reqXP = {
    5: {
        0: 3000,
        1: 3725,
        2: 4425,
        3: 5150,
        4: 5900,
        5: 6675,
        6: 7500,
        7: 8350,
        8: 9225,
        9: 10125,
        10: 11050,
        11: 12025,
        12: 13025,
        13: 15150,
        14: 17600,
        15: 20375,
        16: 23500,
        17: 27050,
        18: 31050,
        19: 35575,
        20: 35575,
    },
    4: {
        0: 2400,
        1: 2975,
        2: 3550,
        3: 4125,
        4: 4725,
        5: 5350,
        6: 6000,
        7: 6675,
        8: 7375,
        9: 8100,
        10: 8850,
        11: 9625,
        12: 10425,
        13: 12125,
        14: 14075,
        15: 16300,
        16: 16300,
    },
    3: {
        0: 1800,
        1: 2225,
        2: 2650,
        3: 3100,
        4: 3550,
        5: 4000,
        6: 4500,
        7: 5000,
        8: 5525,
        9: 6075,
        10: 6625,
        11: 7225,
        12: 7225,
    },
}

const artifactSets = {
    'Adventurer': {
        'Flower of Life': "Adventurer's Flower",
        'Plume of Death': "Adventurer's Tail Feather",
        'Sands of Eon': "Adventurer's Pocket Watch",
        'Goblet of Eonothem': "Adventurer's Golden Goblet",
        'Circlet of Logos': "Adventurer's Bandana",
    },
    'Lucky Dog': {
        'Flower of Life': "Lucky Dog's Clover",
        'Plume of Death': "Lucky Dog's Eagle Feather",
        'Sands of Eon': "Lucky Dog's Hourglass",
        'Goblet of Eonothem': "Lucky Dog's Goblet",
        'Circlet of Logos': "Lucky Dog's Silver Circlet",
    },
    'Traveling Doctor': {
        'Flower of Life': "Traveling Doctor's Silver Lotus",
        'Plume of Death': "Traveling Doctor's Owl Feather",
        'Sands of Eon': "Traveling Doctor's Pocket Watch",
        'Goblet of Eonothem': "Traveling Doctor's Medicine Pot",
        'Circlet of Logos': "Traveling Doctor's Handkerchief",
    },
    'Resolution of Sojourner': {
        'Flower of Life': "Heart of Comradeship",
        'Plume of Death': "Feather of Homecoming",
        'Sands of Eon': "Sundial of the Sojourner",
        'Goblet of Eonothem': "Goblet of the Sojourner",
        'Circlet of Logos': "Crown of Parting",
    },
    'Tiny Miracle': {
        'Flower of Life': "Tiny Miracle's Flower",
        'Plume of Death': "Tiny Miracle's Feather",
        'Sands of Eon': "Tiny Miracle's Goblet",
        'Goblet of Eonothem': "Tiny Miracle's Goblet",
        'Circlet of Logos': "Tiny Miracle's Earrings",
    },
    'Beserker': {
        'Flower of Life': "Berserker's Rose",
        'Plume of Death': "Berserker's Indigo Feather",
        'Sands of Eon': "Berserker's Timepiece",
        'Goblet of Eonothem': "Berserker's Bone Goblet",
        'Circlet of Logos': "Berserker's Battle Mask",
    },
    'Instructor': {
        'Flower of Life': "Instructor's Brooch",
        'Plume of Death': "Instructor's Feather Accessory",
        'Sands of Eon': "Instructor's Pocket Watch",
        'Goblet of Eonothem': "Instructor's Tea Cup",
        'Circlet of Logos': "Instructor's Cap",
    },
    'The Exile': {
        'Flower of Life': "Exile's Flower",
        'Plume of Death': "Exile's Feather",
        'Sands of Eon': "Exile's Pocket Watch",
        'Goblet of Eonothem': "Exile's Goblet",
        'Circlet of Logos': "Exile's Circlet",
    },
    'Defender\'s Will': {
        'Flower of Life': "Guardian's Flower",
        'Plume of Death': "Guardian's Sigil",
        'Sands of Eon': "Guardian's Clock",
        'Goblet of Eonothem': "Guardian's Vessel",
        'Circlet of Logos': "Guardian's Band",
    },
    'Brave Heart': {
        'Flower of Life': "Medal of the Brave",
        'Plume of Death': "Prospect of the Brave",
        'Sands of Eon': "Fortitude of the Brave",
        'Goblet of Eonothem': "Outset of the Brave",
        'Circlet of Logos': "Crown of the Brave",
    },
    'Martial Artist': {
        'Flower of Life': "Martial Artist's Red Flower",
        'Plume of Death': "Martial Artist's Feather Accessory",
        'Sands of Eon': "Martial Artist's Water Hourglass",
        'Goblet of Eonothem': "Martial Artist's Wine Cup",
        'Circlet of Logos': "Martial Artist's Bandana",
    },
    'Gambler': {
        'Flower of Life': "Gambler's Brooch",
        'Plume of Death': "Gambler's Feather Accessory",
        'Sands of Eon': "Gambler's Pocket Watch",
        'Goblet of Eonothem': "Gambler's Dice Cup",
        'Circlet of Logos': "Gambler's Earrings",
    },
    'Scholar': {
        'Flower of Life': "Scholar's Bookmark",
        'Plume of Death': "Scholar's Quill Pen",
        'Sands of Eon': "Scholar's Clock",
        'Goblet of Eonothem': "Scholar's Ink Cup",
        'Circlet of Logos': "Scholar's Lens",
    },
    'Prayers for Illumination': {
        'Circlet of Logos': "Tiara of Flame",
    },
    'Prayers for Destiny': {
        'Circlet of Logos': "Tiara of Torrents",
    },
    'Prayers for Wisdom': {
        'Circlet of Logos': "Tiara of Thunder",
    },
    'Prayers to Springtime': {
        'Circlet of Logos': "Tiara of Frost",
    },
    'Gladiator\'s Finale': {
        'Flower of Life': "Gladiator's Nostalgia",
        'Plume of Death': "Gladiator's Destiny",
        'Sands of Eon': "Gladiator's Longing",
        'Goblet of Eonothem': "Gladiator's Intoxication",
        'Circlet of Logos': "Gladiator's Triumphus",
    },
    'Wanderer\'s Troupe': {
        'Flower of Life': "Troupe's Dawnlight",
        'Plume of Death': "Bard's Arrow Feather",
        'Sands of Eon': "Concert's Final Hour",
        'Goblet of Eonothem': "Wanderer's String Kettle",
        'Circlet of Logos': "Conductor's Top Hat",
    },
    'Thundersoother': {
        'Flower of Life': "Thundersoother's Heart",
        'Plume of Death': "Thundersoother's Plume",
        'Sands of Eon': "Hour of Soothing Thunder",
        'Goblet of Eonothem': "Thundersoother's Goblet",
        'Circlet of Logos': "Thundersoother's Diadem",
    },
    'Thundering Fury': {
        'Flower of Life': "Thunderbird's Mercy",
        'Plume of Death': "Survivor of Catastrophe",
        'Sands of Eon': "Hourglass of Thunder",
        'Goblet of Eonothem': "Omen of Thunderstorm",
        'Circlet of Logos': "Thunder Summoner's Crown",
    },
    'Maiden Beloved': {
        'Flower of Life': "Maiden's Distant Love",
        'Plume of Death': "Maiden's Heart-stricken Infatuation",
        'Sands of Eon': "Maiden's Passing Youth",
        'Goblet of Eonothem': "Maiden's Fleeting Leisure",
        'Circlet of Logos': "Maiden's Fading Beauty",
    },
    'Viridescent Venerer': {
        'Flower of Life': "In Remembrance of Viridescent Fields",
        'Plume of Death': "Viridescent Arrow Feather",
        'Sands of Eon': "Viridescent Venerer's Determination",
        'Goblet of Eonothem': "Viridescent Venerer's Vessel",
        'Circlet of Logos': "Viridescent Venerer's Diadem",
    },
    'Crimson Witch of Flames': {
        'Flower of Life': "Witch's Flower of Blaze",
        'Plume of Death': "Witch's Ever-Burning Plume",
        'Sands of Eon': "Witch's End Time",
        'Goblet of Eonothem': "Witch's Heart Flames",
        'Circlet of Logos': "Witch's Scorching Hat",
    },
    'Lavawalker': {
        'Flower of Life': "Lavawalker's Resolution",
        'Plume of Death': "Lavawalker's Salvation",
        'Sands of Eon': "Lavawalker's Torment",
        'Goblet of Eonothem': "Lavawalker's Epiphany",
        'Circlet of Logos': "Lavawalker's Wisdom",
    },
    'Noblesse Oblige': {
        'Flower of Life': "Royal Flora",
        'Plume of Death': "Royal Plume",
        'Sands of Eon': "Royal Pocket Watch",
        'Goblet of Eonothem': "Royal Silver Urn",
        'Circlet of Logos': "Royal Masque",
    },
    'Bloodstained Chivalry': {
        'Flower of Life': "Bloodstained Flower of Iron",
        'Plume of Death': "Bloodstained Black Plume",
        'Sands of Eon': "Bloodstained Final Hour",
        'Goblet of Eonothem': "Bloodstained Chevalier's Goblet",
        'Circlet of Logos': "Bloodstained Iron Mask",
    },
    'Archaic Petra': {
        'Flower of Life': "Flower of Creviced Cliff",
        'Plume of Death': "Feather of Jagged Peaks",
        'Sands of Eon': "Sundial of Enduring Jade",
        'Goblet of Eonothem': "Goblet of Chiseled Crag",
        'Circlet of Logos': "Mask of Solitude Basalt",
    },
    'Retracing Bolide': {
        'Flower of Life': "Summer Night's Bloom",
        'Plume of Death': "Summer Night's Finale",
        'Sands of Eon': "Summer Night's Moment",
        'Goblet of Eonothem': "Summer Night's Waterballoon",
        'Circlet of Logos': "Summer Night's Mask",
    },
    'Blizzard Strayer': {
        'Flower of Life': "Snowswept Memory",
        'Plume of Death': "Icebreaker's Resolve",
        'Sands of Eon': "Frozen Homeland's Demise",
        'Goblet of Eonothem': "Frost-Weaved Dignity",
        'Circlet of Logos': "Broken Rime's Echo",
    },
    'Heart of Depth': {
        'Flower of Life': "Gilded Corsage",
        'Plume of Death': "Gust of Nostalgia",
        'Sands of Eon': "Copper Compass",
        'Goblet of Eonothem': "Goblet of Thundering Deep",
        'Circlet of Logos': "Wine-Stained Tricorne",
    },
    'Tenacity of the Millelith': {
        'Flower of Life': "Flower of Accolades",
        'Plume of Death': "Ceremonial War-Plume",
        'Sands of Eon': "Orichalceous Time-Dial",
        'Goblet of Eonothem': "Noble's Pledging Vessel",
        'Circlet of Logos': "General's Ancient Helm",
    },
    'Pale Flame': {
        'Flower of Life': "Stainless Bloom",
        'Plume of Death': "Wise Doctor's Pinion",
        'Sands of Eon': "Moment of Cessation",
        'Goblet of Eonothem': "Surpassing Cup",
        'Circlet of Logos': "Mocking Mask",
    },
    'Emblem of Severed Fate': {
        'Flower of Life': "Magnificent Tsuba",
        'Plume of Death': "Sundered Feather",
        'Sands of Eon': "Storm Cage",
        'Goblet of Eonothem': "Scarlet Vessel",
        'Circlet of Logos': "Ornate Kabuto",
    },
    'Shimenawa\'s Reminiscence': {
        'Flower of Life': "Entangling Bloom",
        'Plume of Death': "Shaft of Remembrance",
        'Sands of Eon': "Morning Dew's Moment",
        'Goblet of Eonothem': "Hopeful Heart",
        'Circlet of Logos': "Capricious Visage",
    },
}

const artifacts = {
    guyun: {
        'five': ['Archaic Petra', 'Retracing Bolide'],
        'four': ['Archaic Petra', 'Retracing Bolide', 'Brave Heart'],
        'three': ['Lucky Dog', 'Brave Heart'],
    },
    midsummer_courtyard: {
        'five': ['Thundering Fury', 'Thundersoother'],
        'four': ['Thundering Fury', 'Thundersoother', 'Resolution of Sojourner'],
        'three': ['Adventurer', 'Resolution of Sojourner'],
    },
    valley_remembrance: {
        'five': ['Viridescent Venerer', 'Maiden Beloved'],
        'four': ['Viridescent Venerer', 'Maiden Beloved', 'Tiny Miracle'],
        'three': ['Tiny Miracle', 'Traveling Doctor'],
    },
    hidden_palace: {
        'five': ['Crimson Witch of Flames', 'Lavawalker'],
        'four': ['Crimson Witch of Flames', 'Lavawalker', 'Defender\'s Will', 'Martial Artist'],
        'three': ['Defender\'s Will', 'Martial Artist'],
    },
    vindagnyr: {
        'five': ['Blizzard Strayer', 'Heart of Depth'],
        'four': ['Blizzard Strayer', 'Heart of Depth', 'Defender\'s Will', 'Gambler'],
        'three': ['Defender\'s Will', 'Gambler'],
    },
    ridge_watch: {
        'five': ['Tenacity of the Millelith', 'Pale Flame'],
        'four': ['Tenacity of the Millelith', 'Pale Flame', 'Brave Heart', 'Martial Artist'],
        'three': ['Brave Heart', 'Martial Artist'],
    },
    momiji_court: {
        'five': ['Shimenawa\'s Reminiscence', 'Emblem of Severed Fate'],
        'four': ['Shimenawa\'s Reminiscence', 'Emblem of Severed Fate', 'Resolution of Sojourner', 'Tiny Miracle'],
        'three': ['Resolution of Sojourner', 'Tiny Miracle']
    },
    clear_pool: {
        'five': ['Bloodstained Chivalry', 'Noblesse Oblige'],
        'four': ['Bloodstained Chivalry', 'Noblesse Oblige', 'Gambler', 'Scholar'],
        'three': ['Gambler', 'Scholar'],
    },
}

const main_percentages = {
    'Flower of Life': {
        'HP': {
            chance: 1,
            stats: {
                five: {0: 717, 20: 4780},
                four: {0: 645, 16: 3571},
                three: {0: 430, 12: 1893},
            }
        }
    },
    'Plume of Death': {
        'ATK': {
            chance: 1,
            stats: {
                five: {0: 47, 20: 311},
                four: {0: 42, 16: 232},
                three: {0: 28, 12: 123},
            }
        }
    },
    'Sands of Eon': {
        'HP%': {
            chance: 0.2668,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'ATK%': {
            chance: 0.2666,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'DEF%': {
            chance: 0.2666,
            stats: {
                five: {0: 8.7, 20: 58.3},
                four: {0: 7.9, 16: 43.5},
                three: {0: 6.6, 12: 28.8},
            }
        },
        'Energy Recharge%': {
            chance: .1,
            stats: {
                five: {0: 7.8, 20: 51.8},
                four: {0: 7, 16: 38.7},
                three: {0: 5.8, 12: 25.6},
            }
        },
        'Elemental Mastery': {
            chance: .1,
            stats: {
                five: {0: 28, 20: 187},
                four: {0: 25, 16: 139},
                three: {0: 21, 12: 92.3},
            }
        }
    },
    'Goblet of Eonothem': {
        'HP%': {
            chance: 0.2668,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'ATK%': {
            chance: 0.2666,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'DEF%': {
            chance: 0.2666,
            stats: {
                five: {0: 8.7, 20: 58.3},
                four: {0: 7.9, 16: 43.5},
                three: {0: 6.6, 12: 28.8},
            }
        },
        'Pyro DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'Electro DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'Cryo DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'Hydro DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'Anemo DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'Geo DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'Physical DMG Bonus%': {
            chance: 0.05,
            stats: {
                five: {0: 8.7, 20 :58.3},
                four: {0: 7.9, 16: 43.5},
                three: {0: 6.6, 12: 28.8},
            }
        },
        'Elemental Mastery': {
            chance: 0.025,
            stats: {
                five: {0: 28, 20: 187},
                four: {0: 25, 16: 139},
                three: {0: 21, 12: 92.3},
            }
        },
    },
    'Circlet of Logos': {
        'HP%': {
            chance: 0.2668,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'ATK%': {
            chance: 0.2666,
            stats: {
                five: {0: 7, 20: 46.6},
                four: {0: 6.3, 16: 34.8},
                three: {0: 5.2, 12: 23.1},
            }
        },
        'DEF%': {
            chance: 0.2666,
            stats: {
                five: {0: 8.7, 20: 58.3},
                four: {0: 7.9, 16: 43.5},
                three: {0: 6.6, 12: 28.8},
            }
        },
        'CRIT Rate%': {
            chance: 0.1,
            stats: {
                five: {0: 4.7, 20: 31.1},
                four: {0: 4.2, 16: 23.2},
                three: {0: 3.5, 12: 15.4},
            }
        },
        'CRIT DMG%': {
            chance: 0.1,
            stats: {
                five: {0: 9.3, 20: 62.2},
                four: {0: 8.4, 16: 46.4},
                three: {0: 7, 12: 30.8},
            }
        },
        'Healing Bonus%': {
            chance: 0.1,
            stats: {
                five: {0: 5.4, 20: 35.9},
                four: {0: 4.8, 16: 26.8},
                three: {0: 4, 12: 17.8},
            }
        },
        'Elemental Mastery': {
            chance: 0.04,
            stats: {
                five: {0: 28, 20: 187},
                four: {0: 25, 16: 139},
                three: {0: 21, 12: 92.3},
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
            three: [100.38, 114.72, 129.06, 143.40],
        }
    },
    'ATK': {
        chance: 0.1364,
        stats: {
            five: [13.62, 15.56, 17.51, 19.45],
            four: [10.89, 12.45, 14, 15.56],
            three: [6.54, 7.47, 8.4, 9.34],
        }
    },
    'DEF': {
        chance: 0.1364,
        stats: {
            five: [16.20, 18.52, 20.83, 23.15],
            four: [12.96, 14.82, 16.67, 18.52],
            three: [7.78, 8.89, 10, 11.11],
        }
    },
    'HP%': {
        chance: 0.0909,
        stats: {
            five: [4.08, 4.66, 5.25, 5.83],
            four: [3.26, 3.73, 4.2, 4.66],
            three: [2.45, 2.8, 3.15, 3.5],
        }
    },
    'ATK%': {
        chance: 0.0909,
        stats: {
            five: [4.08, 4.66, 5.25, 5.83],
            four: [3.26, 3.73, 4.2, 4.66],
            three: [2.45, 2.8, 3.15, 3.5],
        }
    },
    'DEF%': {
        chance: 0.0909,
        stats: {
            five: [5.1, 5.83, 6.56, 7.29],
            four: [4.08, 4.66, 5.25, 5.83],
            three: [3.06, 3.5, 3.93, 4.37],
        }
    },
    'Energy Recharge%': {
        chance: 0.0909,
        stats: {
            five: [4.53, 5.18, 5.83, 6.48],
            four: [3.63, 4.14, 4.66, 5.18],
            three: [2.72, 3.11, 3.5, 3.89],
        }
    },
    'Elemental Mastery': {
        chance: 0.0909,
        stats: {
            five: [16.32, 18.65, 20.98, 23.31],
            four: [13.06, 14.92, 16.79, 18.56],
            three: [9.79, 11.19, 12.59, 13.99],
        }
    },
    'CRIT Rate%': {
        chance: 0.0682,
        stats: {
            five: [2.72, 3.11, 3.5, 3.89],
            four: [2.18, 2.49, 2.8, 3.11],
            three: [1.63, 1.86, 2.1, 2.33],
        }
    },
    'CRIT DMG%': {
        chance: 0.0682,
        stats: {
            five: [5.44, 6.22, 6.99, 7.77],
            four: [4.35, 4.97, 5.6, 6.22],
            three: [3.26, 3.73, 4.2, 4.66],
        }
    },
}

const numStats_dist = {
    'five': {
        '3': {chance: 0.75},
        '4': {chance: 0.25},
    },
    'four': {
        '2': {chance: 0.75},
        '3': {chance: 0.25},
    },
    'three': {
        '1': {chance: 0.75},
        '2': {chance: 0.25},
    },
}

const stringToNumSets = {
    'Adventurer': 0,
    'Lucky Dog': 1,
    'Traveling Doctor': 2,
    'Resolution of Sojourner': 3,
    'Tiny Miracle': 4,
    'Berserker': 5,
    'Instructor': 6,
    'The Exile': 7,
    'Defender\'s Will': 8,
    'Brave Heart': 9,
    'Martial Artist': 10,
    'Gambler': 11,
    'Scholar': 12,
    'Prayer\'s for Illumination': 13,
    'Prayer\'s for Destiny': 14,
    'Prayer\'s for Wisdom': 15,
    'Prayer\'s to Springtime': 16,
    'Gladiator\'s Finale': 17,
    'Wanderer\'s Troupe': 18,
    'Thundersoother': 19,
    'Thundering Fury': 20,
    'Maiden Beloved': 21,
    'Viridescent Venerer': 22,
    'Crimson Witch of Flames': 23,
    'Lavawalker': 24,
    'Noblesse Oblige': 25,
    'Bloodstained Chivalry': 26,
    'Archaic Petra': 27,
    'Retracing Bolide': 28,
    'Blizzard Strayer': 29,
    'Heart of Depth': 30,
    'Tenacity of the Millelith': 31,
    'Pale Flame': 32,
    'Emblem of Severed Fate': 33,
    'Shimenawa\'s Reminiscence': 34,
}

var numToStringSets = {}
for(const key in stringToNumSets){
    numToStringSets[stringToNumSets[key]] = key;
}

const stringToNumSlots = {
    'Flower of Life': 0,
    'Plume of Death': 1,
    'Sands of Eon': 2,
    'Goblet of Eonothem': 3,
    'Circlet of Logos': 4,
}

var numToStringSlots = {}
for(const key in stringToNumSlots){
    numToStringSlots[stringToNumSlots[key]] = key;
}

const stringToNumStats = {
    'HP': 1,
    'ATK': 2,
    'DEF': 3,
    'HP%': 4,
    'ATK%': 5,
    'DEF%': 6,
    'Elemental Mastery': 7,
    'Energy Recharge%': 8,
    'CRIT Rate%': 9,
    'CRIT DMG%': 10,
    'Pyro DMG Bonus%': 11,
    'Electro DMG Bonus%': 12,
    'Cryo DMG Bonus%': 13,
    'Hydro DMG Bonus%': 14,
    'Anemo DMG Bonus%': 15,
    'Geo DMG Bonus%': 16,
    'Physical DMG Bonus%': 17,
    'Healing Bonus%': 18,
}

var numToStringStats = {}
for(const key in stringToNumStats){
    numToStringStats[stringToNumStats[key]] = key;
}

/*
var globalCountdown;
function getResinCountdown() {
    return globalCountdown;
}
*/

function convertArtifacts(objs) {
    var clientArr = [];
    objs.forEach(element => {
        var clientObj = {};
        clientObj['_id'] = element['_id'];
        clientObj['set'] = numToStringSets[element['set']];
        clientObj['slot'] = numToStringSlots[element.slot];
        /*
        console.log(element.set)
        console.log(numToStringSets[element.set]);
        console.log(element.slot)
        console.log(numToStringSlots[element.slot]);
        */
        clientObj['name'] = artifactSets[numToStringSets[element.set]][clientObj['slot']];
        clientObj['subOrder'] = decodeSubstatOrder(element.subOrder, true);

        //console.log(clientObj['subOrder']);

        clientObj['subOrder'].forEach(stat => {
            clientObj[stat] = element[stringToNumStats[stat]];
        })
        clientObj['rarity'] = element.rarity;
        clientObj['level'] = element.level;
        clientObj['requiredCumulativeXP'] = element.requiredCumulativeXP;
        clientObj['cumulativeXP'] = element.cumulativeXP;
        clientObj['requiredXP'] = element.requiredXP;
        clientObj['main'] = numToStringStats[element.main];
        clientObj['mainVal'] = element.mainVal;
        clientObj['locked'] = element.locked;
        clientObj['levelHistory'] = element.levelHistory;

        clientArr.push(clientObj);
    })
    return clientArr;
}

function syncResinCount(userCollection, userQuery){
    console.log("syncResinCount")
    return new Promise(resolve=> {
        userCollection.findOne(userQuery)
            .then(result => {
                var resincount = result['resin'];
                var elapsed = Math.floor(Date.now()/1000)-result['nextResinUpdate'];
                var resinInc = Math.floor(elapsed/30)

                if(resinInc < 0 || result['nextResinUpdate'] === -1 || result['resin'] == 160){
                    return resolve(result);
                }

                if (resincount + (resinInc+1) > 160) {
                    //console.log("RESINCOUNT EXCEEDED");
                    resinInc = 160 - (resincount+1);
                }

                //console.log("resinInc: " + resinInc);

                if (resincount > 160) {
                    console.log("Resin count exceeded 160");
                    userCollection.findOneAndUpdate(userQuery,
                        {
                            $set: {'resin': 160},

                        },
                        {returnDocument: "after"}
                    )
                }

                userCollection.findOneAndUpdate(userQuery,
                    {
                        $inc: {'resin': resinInc+1, 'nextResinUpdate': (resinInc+1)*30},
                        //$set: {'nextResinUpdate': resinInc*30 + result['nextResinUpdate']},

                    },
                    {returnDocument: "after"}
                )
                    .then(doc => {
                        return resolve(doc.value);
                    })
            })
    });
}

/*
function initiateResinCount(userCollection) {
    function updateResin() {
        userCollection.updateMany(
            {'resin': {$lt: 160}},
            {
                $inc: {'resin': 1},
                $set: {'lastResinUpdate': Math.floor(Date.now()/1000) + 30},
            }
        )
        globalCountdown = Date.now();
    }
    updateResin();
    setInterval(updateResin, 30000);
}
*/

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

function listArtifacts(res, artifactsCollection, compressionTable, compressObject){
    artifactsCollection.find().sort({$natural:-1}).toArray()
        .then(results => {
            if(compressionTable && compressObject) {
                var compressedArr = []
                results.forEach(elem => {
                    compressedArr.push(compressObject(compressionTable, elem));
                })
                res.status(200).send(compressedArr)
            } else {
                res.status(200).send(results)
            }
        })
        .catch(error => {
            console.log(error);
            res.send("ERROR")
        });
}

function encodeSubstatOrder(subStats, convert) {
    let subStatOrderEncode = 0;
    let len = subStats.length;
    for(var i = 0; i < len; i++){
        let statNum;
        if(convert == true) {
            statNum = stringToNumStats[subStats[i]];
        } else {
            statNum = subStats[i];
        }
        subStatOrderEncode += statNum * (32 ** (len-(i+1)));
    }
    return subStatOrderEncode;
}

function decodeSubstatOrder(value, convert){
    let subStats = [];
    let divisor = value;
    while(divisor > 0) {
        var remainder = divisor % 32;
        divisor = Math.floor(divisor/32);
        if(convert) {
            subStats.unshift(numToStringStats[remainder]);
        } else {
            subStats.unshift(remainder);
        }
    }
    return subStats;
}

function rollSingle(domainName, rarity){
    
    var possibleSetNames = artifacts[domainName][rarityEnums[rarity]];
    var pickedSetName = possibleSetNames[getRandInt(possibleSetNames.length)];
    var pickedSet = artifactSets[pickedSetName];

    var slotArray = Object.keys(pickedSet);
    var setIdx = getRandInt(slotArray.length);

    var randSlot = slotArray[setIdx];

    var mainstat = weightedRand(main_percentages[randSlot], []);
    var initialMainVal = main_percentages[randSlot][mainstat]['stats'][rarityEnums[rarity]]['0'];
    
    /*
    console.log('-----------------------')
    console.log('domainName: ' + domainName);
    console.log('pickedSetName: ' + pickedSetName);
    console.log('rarity: ' + rarity);
    console.log('randSlot: ' + randSlot);
    console.log('-----------------------')
    */

    var initialArtifact = {
        //name: pickedSet[randSlot],
        set: stringToNumSets[pickedSetName],
        slot: stringToNumSlots[randSlot],
        rarity: rarity,
        level: 0,
        cumulativeXP: 0,
        requiredCumulativeXP: cumulativeXPs[rarity][1],
        requiredXP: reqXP[rarity][0],
        main: stringToNumStats[mainstat],
        mainVal: initialMainVal,
        locked: false,
        levelHistory: {},
    }

    //console.log(JSON.stringify(initialArtifact));

    //var numSubs = parseInt(weightedRand({'3': {chance: 0.75}, '4': {chance: 0.25}}, []));
    var numSubs = parseInt(weightedRand(numStats_dist[rarityEnums[rarity]], []));
    var subStats = [];
    for(var i = 0; i < numSubs; i++){
        subStats[i] = weightedRand(sub_percentages, [mainstat].concat(subStats));
        var statRoll = sub_percentages[subStats[i]]['stats'][rarityEnums[rarity]][getRandInt(4)];
        //HP: 123, => 0: 123
        initialArtifact[stringToNumStats[subStats[i]]] = statRoll;
        /*
                    initialArtifact['sub'+ i] = subStats[i-1];
                    initialArtifact['sub'+ i + 'Val'] = statRoll;
                    */
    }

    var subStatOrderEncode = encodeSubstatOrder(subStats, true);

    initialArtifact['subOrder'] = subStatOrderEncode;
    return initialArtifact;
}

function rollArtifacts(res, domainName, artifactsCollection, userCollection, userQuery) {
    console.log('rollArtifacts');
    console.log(userQuery);
    console.log('=====')
    console.log(userCollection);
    console.log('=====')
    userCollection.findOne(userQuery)
        .then(result =>{
            if(result['resin'] < 5) {
                res.status(400).send("Insufficient resin");
                return;
            } else {
                if (result['resin'] === 160) {
                    userCollection.updateOne(
                        userQuery,
                        {
                            $inc: {'resin': -5},
                            $set: {'nextResinUpdate': Math.floor(Date.now()/1000) + 30}
                        }
                    )
                } else {
                    userCollection.updateOne(
                        userQuery,
                        {
                            $inc: {'resin': -5}
                        }
                    )
                }
                var artifactArr = [];

                // Roll 3 star artifacts
                for (let i = 0; i < parseInt(weightedRand({'3': {chance: 0.50}, '4': {chance: 0.50}}, [])); i++) {
                    artifactArr.push(rollSingle(domainName, 3));
                }
                // Roll 4 star artifacts
                for (let i = 0; i < parseInt(weightedRand({'2': {chance: 0.50}, '3': {chance: 0.50}}, [])); i++) {
                    artifactArr.push(rollSingle(domainName, 4));
                }
                // Roll 5 star artifacts
                for (let i = 0; i < parseInt(weightedRand({'1': {chance: 0.90}, '2': {chance: 0.10}}, [])); i++) {
                    artifactArr.push(rollSingle(domainName, 5));
                }

                artifactsCollection.insertMany(artifactArr)
                    .then(() => {
                        console.log(artifactArr);
                        res.status(200).send(artifactArr)
                        //res.end();
                    })
                    .catch(error => console.error(error))
            }
        })
}

function levelUpdateArtifact(res, artifactsCollection, artifactID, mongoObj) {
    //console.log('Level update');

    const obj = convertArtifacts([mongoObj])[0];

    var numSubs = obj['subOrder'].length;

    var mainPercentages = main_percentages[obj['slot']][obj['main']]['stats'][rarityEnums[obj['rarity']]];
    var mainKeys = Object.keys(mainPercentages);
    var mainInc = (mainPercentages[mainKeys[1]] - mainPercentages[mainKeys[0]])/ mainKeys[1];

    const level = obj['level'];
    if((level + 1) % 4 == 0){
        if(numSubs === 4){
            var randNum = getRandInt(4);
            //updateJson['sub'+randNum+'Val'] = sub_percentages[obj['sub'+randNum]]['stats']['five'][Math.floor(Math.random()*4)];
            var subStats = obj.subOrder;
            var subName = subStats[randNum];
            var increm  = sub_percentages[subName]['stats'][rarityEnums[obj['rarity']]][Math.floor(Math.random()*4)];

            var levelHistory = obj['levelHistory'];
            levelHistory[level+1] = {[stringToNumStats[subName]]: increm};
            //var valProp = 'sub'+randNum+'Val';
            artifactsCollection.findOneAndUpdate(
                {"_id": artifactID},
                {
                    $inc: {
                        'level': 1,
                        'mainVal': mainInc,
                        [stringToNumStats[subName]]: increm,
                    },
                    $set: {
                        'requiredXP': reqXP[obj['rarity']][level+1],
                        'requiredCumulativeXP': cumulativeXPs[obj['rarity']][level+2],
                        'levelHistory': levelHistory,
                    }
                },
                {returnDocument: "after"}
            )
                .then(result => result.value)
                .then(result =>{
                    if(result['level'] < result['rarity']*4  && result['cumulativeXP'] >= result['requiredCumulativeXP']){
                        return levelUpdateArtifact(res, artifactsCollection, artifactID, result);
                    }
                    res.status(200).send(result);
                    //res.redirect('/');
                });

        } else {
            // Decode substat order
            let subStats = obj.subOrder;
            let subStat = weightedRand(sub_percentages, [obj['main']].concat(subStats));
            let statRoll = sub_percentages[subStat]['stats'][rarityEnums[obj['rarity']]][Math.floor(Math.random()*4)];

            subStats = subStats.concat(subStat);
            let orderEncoded = encodeSubstatOrder(subStats, true);

            let levelHistory = obj['levelHistory'];
            levelHistory[level+1] = {[stringToNumStats[subStat]]: statRoll};

            artifactsCollection.findOneAndUpdate(
                {"_id": artifactID},
                {
                    $inc: {'level': 1,
                        'mainVal': mainInc},
                    $set: {
                        [stringToNumStats[subStat]]: statRoll,
                        'subOrder': orderEncoded,
                        'requiredXP': reqXP[obj['rarity']][level+1],
                        'requiredCumulativeXP': cumulativeXPs[obj['rarity']][level+2],
                        'levelHistory': levelHistory,
                    },
                },
                {returnDocument: "after"}
            )
                .then(result => result.value)
                .then(result =>{
                    if(result['level'] < result['rarity']*4  && result['cumulativeXP'] >= result['requiredCumulativeXP']){
                        return levelUpdateArtifact(res, artifactsCollection, artifactID, result);
                    }
                    res.status(200).send(result);
                });
        }
    } else {
        artifactsCollection.findOneAndUpdate(
            {"_id": artifactID},
            {
                $inc: {
                    'level': 1,
                    'mainVal': mainInc,
                },
                $set: {
                    'requiredXP': reqXP[obj['rarity']][level+1],
                    'requiredCumulativeXP': cumulativeXPs[obj['rarity']][level+2]
                },
            },
            {returnDocument: "after"}
        )
            .then(result => result.value)
            .then(result =>{
                if(result['level'] < result['rarity']*4  && result['cumulativeXP'] >= result['requiredCumulativeXP']){
                    return levelUpdateArtifact(res, artifactsCollection, artifactID, result);
                }
                res.status(200).send(result);
                //res.redirect('/');
            });
    }
}

function levelArtifact(res, artifactsCollection, selected, fodderIDArr, ObjectId){
    //console.log("In levelArtifact");
    //console.log(selected);
    if (selected === undefined || fodderIDArr === undefined || fodderIDArr.length === 0) {
        res.status(400).send("Missing selection");
        return;
    }
    if (fodderIDArr.includes(selected)){
        res.status(400).send("Artifact selected for leveling is included as its own fodder");
        return;
    }

    var artifactID = ObjectId(selected);
    var fodderIDs = [];
    fodderIDArr.forEach(id => {
        fodderIDs.push(ObjectId(id));
    });

    artifactsCollection.findOne({"_id": artifactID})
        .then(obj => {
            //console.log(obj);
            //console.log(obj['level']);
            if(obj['level'] >= obj['rarity']*4) {
                console.log("Max level");
                res.status(400).send('Max level reached');
                return;
            }

            var totalXP = 0;
            var XPArr = [];
            artifactsCollection.find({_id: {$in: fodderIDs}}).toArray()
                .then(arr => {
                    arr.forEach(artifact => {
                        if (artifact['locked'] === true) {
                            res.status(400).send("Selected fodder includes locked artifact, no fodder consumed");
                            return;
                        }
                        XPArr.push(Math.floor(baseXP[artifact.rarity] + (artifact.cumulativeXP * 0.8)));
                    })
                    XPArr.sort((a, b)=> {
                        return b-a;
                    })
                    for (var i = 0; i < arr.length; i++) {
                        totalXP += XPArr[i];
                        if (arr.length > 1 && i <= (arr.length - 2) && (obj['cumulativeXP'] + totalXP >= cumulativeXPs[obj['rarity']][obj['rarity']*4])){
                            // Excess fodder, abort leveling
                            res.status(400).send("Excess fodder, artifacts not consumed");
                            return;
                        }
                        //console.log(obj['cumulativeXP'] + totalXP)
                    }

                    artifactsCollection.findOneAndUpdate(
                        {"_id": artifactID},
                        {
                            $inc: {
                                'cumulativeXP': totalXP
                            },
                        },
                        {returnDocument: "after"}
                    )
                        .then(result => result.value)
                        .then(resultObj => {
                            if(resultObj['cumulativeXP'] >= resultObj['requiredCumulativeXP']){
                                levelUpdateArtifact(res, artifactsCollection, artifactID, resultObj);
                            } else {
                                res.status(200).send(resultObj);
                            }
                            deleteArtifact(res, fodderIDs, artifactsCollection, false)
                        })
                });
        })
}

function deleteArtifact(res, removeList, artifactsCollection, sendResponse=true) {
    if (removeList.length === 0){
        if(sendResponse === true) {
            res.status(400).send("No items selected for deletion");
        }
        return;
    }

    artifactsCollection.deleteMany({"_id": {$in: removeList}})
        .then(result => {
            if(sendResponse === true){
                res.status(200).send(result.deletedCount + " artifacts deleted");
            }
        })
        .catch(error => console.error(error))
    /*
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
    */
}

function lockArtifacts(res, artifactsCollection, lockList, ObjectId) {
    console.log("in lockArtifacts")
    console.log(lockList);
    console.log(artifactsCollection)
    if (lockList === undefined || lockList.length === 0) {
        res.status(400).send("No selection for lock");
        return;
    }
    var lockIDs = [];
    lockList.forEach(id => {
        lockIDs.push(ObjectId(id));
    });

    artifactsCollection.updateMany(
        {"_id": {$in: lockIDs}, "locked": false},
        {$set: {"locked": true}},
    )
    .then(result => {
        console.log(result.modifiedCount + " artifacts locked")
        res.status(200).send(result.modifiedCount + " artifacts locked");
    })
    .catch(error => console.error(error))
}

function unlockArtifacts(res, artifactsCollection, unlockList, ObjectId) {
    if (unlockList === undefined || unlockList.length === 0) {
        res.status(400).send("No selection for unlock");
        return;
    }
    var unlockIDs = [];
    unlockList.forEach(id => {
        unlockIDs.push(ObjectId(id));
    });

    artifactsCollection.updateMany(
        {"_id": {$in: unlockIDs}, "locked": true},
        {$set: {"locked": false}},
    )
        .then(result => {
            res.status(200).send(result.modifiedCount + " artifacts unlocked");
        })
        .catch(error => console.error(error))
}

function deleteUser(){}

export{artifactSchema, artifacts, artifactSets, numToStringStats, numToStringSlots, numToStringSets, stringToNumStats, convertArtifacts, decodeSubstatOrder, encodeSubstatOrder, main_percentages, sub_percentages, getRandInt, weightedRand, listArtifacts, rollArtifacts, levelArtifact, deleteArtifact,syncResinCount, lockArtifacts, unlockArtifacts}
