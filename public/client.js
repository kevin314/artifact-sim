/*import * as artifacts from 'artifacts.js';*/
import {artifacts, main_percentages, sub_percentages, getRandInt, weightedRand} from './artifactModule.mjs';
//const {artifacts, sub_percentages, main_percentages} = artMod;
console.log("hi");


function rollArtifact(setName) {
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

    console.log(JSON.stringify(initialArtifact));

    var numSubs = parseInt(weightedRand({'3': {chance: 0.75}, '4': {chance: 0.25}}, []));
    var subStats = [];
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
        .then(res => res.json())
        .then(result => {
            //console.log(result)
            var rarityStr = "";
            var subsStr = `<span id="subs${result['_id']}">`;

            for(var i = 0; i < result['rarity']; i++){
                rarityStr += "<span>&#11088</span>"
            }
            for(var i = 1; i <= 4; i++){
                if(result['sub'+i]){
                    subsStr += `${result['sub'+i]}: ${Math.round(result['sub'+i+'Val']*10)/10}`+
                        `<br/>`
                }
            }
            const str =
                `<button type="button" id="button${result['_id']}"`+
                `<span><input type="checkbox" name="check" value="`+
                                   `${result['_id']}" autocomplete="off" form="deleteform"/></span>`+
                `${rarityStr}`+
                `<span><input type="radio" id= "radio${result['_id']}" name="pickArtifact"`+
                                                            `value="`+
                                                                    `${result['_id']}" autocomplete="off"`+
                                                            `form="levelform"></span><br/>`+
                `<span><label for= "radio${result['_id']}" <span> ${result.name}`+
                             `</span><br/>`+
                `<span id = "level${result['_id']}">+${result.level} ${result.slot}</span><br/>`+
                `<span style="font-weight:bold">${result.main}</span><br/>`+
                `<span id = "main${result['_id']}">${Math.round(result['mainVal']*10)/10}</span><br/>`+
                `${subsStr} </span>`+
                `</button>`

            const levelbutton = document.getElementById('levelform')
            levelbutton.insertAdjacentHTML('afterend', str)
            //location.reload();
            //window.location.href = "/";
        })
}

function levelUpdatePage(obj){
    const id = obj['_id'];
    console.log(id);
    const level = document.getElementById('level'+id);
    const main = document.getElementById('main'+id);
    const subs = document.getElementById('subs'+id);
    const numSubs = (Object.keys(obj).length-8)/2;

    var subsStr = "";
    for(var i = 1; i <= numSubs; i++){
        subsStr += obj['sub'+i] + ": " + Math.round(obj['sub'+i+'Val']*10)/10 + "<br/>";
    }
    level.innerHTML = "+" + obj['level'] + " " + obj['slot'];
    main.innerHTML = Math.round(obj['mainVal']*10)/10;
    subs.innerHTML = subsStr;

}


window.addEventListener('DOMContentLoaded', () => {
    const logoutbutton = document.getElementById('logout');
    logoutbutton.addEventListener('click', ()=> {
        fetch('/logout', {
            method: 'post',
        })
            .then(result => {
                window.location.href = "/login";
            })
    });

    const deleteform = document.getElementById('deleteform');
    deleteform.addEventListener('submit', event => {
        event.preventDefault();
        var data = new FormData(deleteform);
        var artifactIDs = [];
        for(const obj of data){
            artifactIDs.push(obj[1]);
        }
        console.log(artifactIDs);
        var objBody = {ids: artifactIDs};

        fetch('/delete', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objBody),
        })
            .then(() => {
                for(var i = 0; i < artifactIDs.length; i++){
                    var button = document.getElementById('button'+artifactIDs[i]);
                    button.remove();
                }
            })
    })

    const levelform = document.getElementById('levelform');
    levelform.addEventListener('submit', event => {
        event.preventDefault();
        var data = new FormData(levelform);
        var artifactID;
        for(const obj of data){
            artifactID = obj[1];
        }
        var objBody = {id: artifactID};
        fetch('/level', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objBody),
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                levelUpdatePage(result);
            })
    });

    const hidden_palace = document.getElementById('roll-hidden_palace')
    hidden_palace.addEventListener('click', () => {
        var randNum = getRandInt(2);
        var setName = "";
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
        var randNum = getRandInt(2);
        var setName = "";
        if(randNum == 0){
            setName = 'icebreaker'
        }
        else{
            setName = 'heart_of_depth';
        }

        rollArtifact(setName);
    })
})
