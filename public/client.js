/*import * as artifacts from 'artifacts.js';*/
import {artifactSets, convertArtifacts, main_percentages, sub_percentages, getRandInt, weightedRand} from './artifactModule.mjs';
//const {artifacts, sub_percentages, main_percentages} = artMod;
console.log("hi");


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
            const levelbutton = document.getElementById('levelform');
            const resin = document.getElementById('resincount');

            if (resin.innerHTML == 160){
                countDown();
            }

            resin.innerHTML = resin.innerHTML - 5

            for(var num = 0; num < resultArr.length; num++){
                const result = resultArr[num];
                var rarityStr = "";
                var subsStr = `<span id="subs${result['_id']}">`;

                for(var i = 0; i < result['rarity']; i++){
                    rarityStr += "<span>&#11088</span>"
                }
                for(var i = 0; i < result.subOrder.length; i++){
                    subsStr += `${result.subOrder[i]}: ${Math.round(result[result.subOrder[i]]*10)/10}`+`<br/>`
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
                    `<span id = "xp${result['_id']}">${Math.abs((result.requiredCumulativeXP-result.cumulativeXP)-result.requiredXP)}/${result.requiredXP} XP</span><br/>`+
                    `<span style="font-weight:bold">${result.main}</span><br/>`+
                    `<span id = "main${result['_id']}">${Math.round(result['mainVal']*10)/10}</span><br/>`+
                    `${subsStr} </span>`+
                    `</button>`

                levelbutton.insertAdjacentHTML('afterend', str)
                //location.reload();
                //window.location.href = "/";
            }
        })
        })
}

function levelUpdatePage(obj){
    const id = obj['_id'];
    //console.log(id);
    const xp = document.getElementById('xp'+id);
    const level = document.getElementById('level'+id);
    const main = document.getElementById('main'+id);
    const subs = document.getElementById('subs'+id);

    var subsStr = "";
    for(var i = 0; i < obj.subOrder.length; i++){
        subsStr += `${obj.subOrder[i]}: ${Math.round(obj[obj.subOrder[i]]*10)/10}`+`<br/>`
    }
    xp.innerHTML = Math.abs((obj.requiredCumulativeXP-obj.cumulativeXP)-obj.requiredXP) + "/" + obj.requiredXP + " XP";
    level.innerHTML = "+" + obj['level'] + " " + obj['slot'];
    main.innerHTML = Math.round(obj['mainVal']*10)/10;
    subs.innerHTML = subsStr;
}


function countDown(date) {
    const resintimer = document.getElementById('resintimer');
    if (date) {
        console.log(Math.floor(Date.now()/1000) - parseInt(date));
        //resintimer.innerHTML = Math.abs((Math.floor(Date.now()/1000) - parseInt(date)));
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
        console.log(fodderartifactIDs);

        var leveldata = new FormData(levelform);
        //console.log(data);
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
                    console.log(obj);
                    levelUpdatePage(obj);
                })
            })
    });

    const hidden_palace = document.getElementById('roll-hidden_palace')
    hidden_palace.addEventListener('click', () => {
        rollArtifact('hidden_palace');
    })
    const vindagnyr  = document.getElementById('roll-vindagnyr')
    vindagnyr.addEventListener('click', () => {
        rollArtifact('vindagnyr');
    })
})
