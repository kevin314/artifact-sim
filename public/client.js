/*import * as artifacts from 'artifacts.js';*/
//import {artifactSets, convertArtifacts, main_percentages, sub_percentages, getRandInt, weightedRand} from './artifactModule.mjs';
//const {artifacts, sub_percentages, main_percentages} = artMod;
//import {createCompressionTable, decompressObject} from 'jsonschema-key-compression';
//import { artifactSchema } from './artifactModule.mjs';

//const compressionTable = createCompressionTable(artifactSchema);

console.time('start bench');
fetch('/api/discord/users/@me/artifacts', {
    method: 'get',
    headers: {'Content-Type': 'application/json'},
})
    .then(res => {
        res.json()
    .then(resArr => {
        let decompArr = [];
        for (let obj in resArr) {
            decompArr.push(decompressObject(compressionTable, obj));
        }
        console.timeEnd('bench');
    })
    });


function toggle(source) {
    checkboxes = document.getElementsByName('check');
        for(var i=0, n=checkboxes.length;i<n;i++) {
            checkboxes[i].checked = source.checked;
        }
}
function addButton(obj) {
    artifactArrObj[obj._id] = obj;
    selectCard(obj);
    document.getElementById('button' + obj._id).onclick = function() {selectCard(artifactArrObj[obj._id])};
}
function selectCard(obj){
    var radio = document.getElementById('radio' + obj._id);
    if(radio.checked === false) {
        radio.checked = true;
        var cardheader = document.getElementById('cardheader');
        cardheader.innerHTML = obj.name;

        document.getElementById('cardimage').src = `images/artifactSets/${obj['set']}/${obj['slot']}.png`
        document.getElementById('cardmain').innerHTML = obj.main;
        document.getElementById('cardmainVal').innerHTML = Math.round(obj.mainVal*10)/10;
        var statsStr = `<ul>`;
        
        var cardstats = document.getElementById('cardstats');
        // Remove all children of the unordered list of sub-stats
        cardstats.children[0].textContent = '';
        for(var i = 0; i < obj.subOrder.length; i++){
            var li = document.createElement('li');
            li.textContent = `${obj.subOrder[i]}: ${Math.round(obj[obj.subOrder[i]]*10)/10}`;
            cardstats.children[0].appendChild(li);
        }
    } 
}
function rollArtifact(domainName) {
    const request = {domain: domainName}
    fetch('/artifacts', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(request),
    })
        .then(res => {
            res.json()
        .then(resArr => {
            const resultArr = convertArtifacts(resArr);
            const resin = document.getElementById('resincount');

            if (resin.innerHTML == 160){
                countDown();
            }
            resin.innerHTML = resin.innerHTML - 5

            addButtons(resultArr);
        })
        })
}

function addButtons(resultArr) {
    const levelbutton = document.getElementById('levelform');
    for(var num = 0; num < resultArr.length; num++){
        const result = resultArr[num];
        var rarityStr = "";
        var subsStr = `<span id="subs${result['_id']}">`;

        for(let i = 0; i < result['rarity']; i++){
            rarityStr += "&#11088"
        }
        for(let i = 0; i < result.subOrder.length; i++){
            subsStr += `${result.subOrder[i]}: ${Math.round(result[result.subOrder[i]]*10)/10}`+`<br/>`
        }
        const str =
            `<button type="button" id="button${result['_id']}" onclick="(()=>{addButton1(${JSON.stringify(result).replace(/'/g, "\\'").replace(/"/g, '\'')})})()">`+
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
            `<span id = "xp${result['_id']}">${Math.abs((result.requiredCumulativeXP-result.cumulativeXP)-result.requiredXP)}/${result.requiredXP} XP</span><br/>`+
            `<span style="font-weight:bold">${result.main}</span><br/>`+
            `<span id = "main${result['_id']}">${Math.round(result['mainVal']*10)/10}</span><br/>`+
            `${subsStr} </span>`+
            `</button>`

        levelbutton.insertAdjacentHTML('afterend', str)
        //location.reload();
        //window.location.href = "/";
    }
}
function levelUpdatePage(obj){
    artifactArrObj[obj._id] = obj;
    const id = obj['_id'];

    const xp = document.getElementById('xp'+id);
    const level = document.getElementById('level'+id);
    const main = document.getElementById('main'+id);
    const subs = document.getElementById('subs'+id);

    var subsStr = "";
    for(let i = 0; i < obj.subOrder.length; i++){
        subsStr += `${obj.subOrder[i]}: ${Math.round(obj[obj.subOrder[i]]*10)/10}`+`<br/>`
    }
    xp.innerHTML = Math.abs((obj.requiredCumulativeXP-obj.cumulativeXP)-obj.requiredXP) + "/" + obj.requiredXP + " XP";
    level.innerHTML = "+" + obj['level'] + " " + obj['slot'];
    main.innerHTML = Math.round(obj['mainVal']*10)/10;
    subs.innerHTML = subsStr;

    const cardmainVal = document.getElementById('cardmainVal');
    const cardstats = document.getElementById('cardstats');
                // Remove all children of the unordered list of sub-stats
                cardstats.children[0].textContent = '';
                for(let i = 0; i < obj.subOrder.length; i++){
                    var li = document.createElement('li');
                    li.textContent = `${obj.subOrder[i]}: ${Math.round(obj[obj.subOrder[i]]*10)/10}`;
                    cardstats.children[0].appendChild(li);
                }
    cardmainVal.innerHTML =  main.innerHTML;
}

function countDown(date) {
    const resintimer = document.getElementById('resintimer');
    if (date) {
        resintimer.innerHTML = parseInt(date) - Math.floor(Date.now()/1000);
    } else {
        resintimer.innerHTML = 30;
    }
    var countdown = setInterval(() => {
        if(resintimer.innerHTML == 0){
            var resin = document.getElementById('resincount');
            if(resin.innerHTML == 159) {
                resintimer.innerHTML = "Full resin";
                resin.innerHTML++;
                clearInterval(countdown);
            } else {
                resintimer.innerHTML = 29;
                resin.innerHTML++;
            }
        } else {
            resintimer.innerHTML -= 1;
        }
    }, 1000)
}

window.addEventListener('DOMContentLoaded', () => {
    const resindate = document.getElementById('resindate');
    const resintimer = document.getElementById('resintimer');
    const resincount = document.getElementById('resincount');
    const date = resindate.innerHTML;
    if(resincount.innerHTML != 160) {
        countDown(date);
    } else {
        resintimer.innerHTML = "Full resin";
    }

    const logoutbutton = document.getElementById('logout');
    if(logoutbutton != null){
        logoutbutton.addEventListener('click', ()=> {
            fetch('/logout', {
                method: 'post',
            })
                .then(result => {
                    window.location.href = "/";
                })
        });
    }

    const deleteform = document.getElementById('deleteform');
    deleteform.addEventListener('submit', event => {
        event.preventDefault();
        var data = new FormData(deleteform);
        var artifactIDs = [];
        for(const obj of data){
            artifactIDs.push(obj[1]);
        }
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
        //deleteform.submit();
        var deletedata = new FormData(deleteform);
        var fodderartifactIDs = [];
        for(const obj of deletedata){
            fodderartifactIDs.push(obj[1]);
        }

        var leveldata = new FormData(levelform);
        var artifactID;
        for(const obj of leveldata){
            artifactID = obj[1];
        }
        var objBody = {id: artifactID, fodder: fodderartifactIDs};
        fetch('/level', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objBody),
        })
            .then(res => {
                if (res.status === 200) {
                    for(var i = 0; i < fodderartifactIDs.length; i++){
                        var button = document.getElementById('button'+fodderartifactIDs[i]);
                        button.remove();
                    }
                }
                res.json().then(result => {
                    var obj = convertArtifacts([result])[0];
                    levelUpdatePage(obj);
                })
            })
    });

    const guyun  = document.getElementById('roll-guyun')
    guyun.addEventListener('click', () => {
        rollArtifact('guyun');
    })
    const midsummer_courtyard  = document.getElementById('roll-midsummer')
    midsummer_courtyard.addEventListener('click', () => {
        rollArtifact('midsummer_courtyard');
    })
    const valley_remembrance  = document.getElementById('roll-valley')
    valley_remembrance.addEventListener('click', () => {
        rollArtifact('valley_remembrance');
    })
    const hidden_palace = document.getElementById('roll-hidden_palace')
    hidden_palace.addEventListener('click', () => {
        rollArtifact('hidden_palace');
    })
    const vindagnyr  = document.getElementById('roll-vindagnyr')
    vindagnyr.addEventListener('click', () => {
        rollArtifact('vindagnyr');
    })
    const ridge_watch  = document.getElementById('roll-ridge_watch')
    ridge_watch.addEventListener('click', () => {
        rollArtifact('ridge_watch');
    })
    const momiji_court  = document.getElementById('roll-momiji_court')
    momiji_court.addEventListener('click', () => {
        rollArtifact('momiji_court');
    })
    const clear_pool  = document.getElementById('roll-clear_pool')
    clear_pool.addEventListener('click', () => {
        rollArtifact('clear_pool');
    })
})
