const divList = document.querySelectorAll('.choice-grid div');
const selList = document.querySelectorAll('.checkbox'); 
const factList = document.querySelectorAll('.fatti');
let presente1 = 0;
let presente2 = 0;
let presente3 = 0;
let risp = [3];
let token;
let song = '';
let q = -1;

for( let i=0; i<divList.length; i++){
    divList[i].classList.add("grigio");
}

for(let t=0; t<factList.length; t++){
    fetch("https://api.aakhilv.me/fun/facts").then(onResponse).then(onJson);
}

function seleziona(event)
{
    const b = event.currentTarget;
    for(let i=0; i<divList.length; i++)
    {
        if(divList[i].dataset.questionId === b.dataset.questionId){
            
            if(divList[i].dataset.choiceId === b.dataset.choiceId){

                let current = selList[i];    
                current.classList.add("pos");
                current.classList.add("sel");
                current.classList.add("colore");
                divList[i].classList.add("colore");
                const image = document.querySelector('img.pos');
                
                image.src="images/checked.png";
                image.classList.add("checkbox");
                current.classList.remove("desele");
                divList[i].classList.remove("desele");
                current.classList.remove("pos");

                if(divList[i].dataset.questionId === 'one'){
                    presente1=1;
                    risp[0] = b.dataset.choiceId;
                }
                else if(divList[i].dataset.questionId === 'two'){
                    presente2=1;
                    risp[1] = b.dataset.choiceId;
                }
                else if(divList[i].dataset.questionId === 'three'){
                    presente3=1;
                    risp[2] = b.dataset.choiceId;
                }
                if(presente1===1 && (presente2===1 && presente3===1))
                {
                    for(let i of divList)
                    {
                        i.removeEventListener('click', seleziona);
                        risultato();
                    }        
                    fetch("https://api.spotify.com/v1/search?type=track&include_external=audio&q="+song+"&limit=1",
                    {
                        headers:
                    {
                        'Authorization': 'Bearer ' + token
                    }
                }
            ).then(onResponse1).then(onJson1);
                }
            }
            else if(divList[i].dataset.choiceId !== b.dataset.choiceId){
                let current = selList[i]; 
                current.classList.add("pos");
                const image = document.querySelector('img.pos');
                current.classList.remove("sel");
                image.src="images/unchecked.png";
                image.classList.add("checkbox");
                current.classList.add("desele");
                divList[i].classList.add("desele");
                current.classList.remove("pos");
                current.classList.remove("colore");
                divList[i].classList.remove("colore");
            }
            
        } 
    }
}

for(let i of divList)
{
    i.addEventListener('click', seleziona);
}

const s = document.querySelector("button");
s.addEventListener('click', reset);

function reset(event)
{
    q=-1;
    document.querySelector('#canzone').textContent = '';
    for(let t=0; t<factList.length; t++){
            
        fetch("https://api.aakhilv.me/fun/facts").then(onResponse).then(onJson);
    }
    for(let k=0; k<selList.length; k++)
    {
        selList[k].innerHTML='';
        selList[k].src="images/unchecked.png";
        selList[k].classList.remove("desele");
        selList[k].classList.remove("sel");
        selList[k].classList.remove("colore");
    }
    for(let t=0; t<divList.length; t++)
    {
        divList[t].classList.add("grigio");
        divList[t].classList.remove("desele");
        divList[t].classList.remove("sel");
        divList[t].classList.remove("colore");
    }
    for(let i of divList)
    {
        presente1=0;
        presente2=0;
        presente3=0;
        
        i.addEventListener('click', seleziona);
    }
    for (const j in risp) {
        delete risposte[j];
    }
    document.querySelector('#risp_h1').textContent = '';
    document.querySelector('#risp_p').textContent = '';
}

function risultato()
{
    if(risp[0] === risp[1] && risp[0] === risp[2])
    {
        document.querySelector('#risp_h1').textContent = RESULTS_MAP[risp[0]].title;
        document.querySelector('#risp_p').textContent = RESULTS_MAP[risp[0]].contents;
        song=risp[0];
    }
    else if(risp[1] === risp[2])
    {
        document.querySelector('#risp_h1').textContent = RESULTS_MAP[risp[1]].title;
        document.querySelector('#risp_p').textContent = RESULTS_MAP[risp[1]].contents;
        song=risp[1];
    }
    else if(risp[2] === risp[0])
    {
        document.querySelector('#risp_h1').textContent = RESULTS_MAP[risp[2]].title;
        document.querySelector('#risp_p').textContent = RESULTS_MAP[risp[2]].contents;
        song=risp[2];
    }
    else{
        document.querySelector('#risp_h1').textContent = RESULTS_MAP[risp[0]].title;
        document.querySelector('#risp_p').textContent = RESULTS_MAP[risp[0]].contents;
        song=risp[0];
    }
}

//////
function onResponse(response)
{
    return response.json();
}

function onJson(json)
{
    q++;
    factList[q].textContent = json;
}

//////SPOTIFY     

let client_id = "ddb83aae23e04d408feba1eed4c06ea8"; 
let client_secret = "115b8ff903144b079503856b78712135";

fetch("https://accounts.spotify.com/api/token",{ 
    method: "post", 
    body: 'grant_type=client_credentials', 
    headers: 
    { 
     'Content-Type': 'application/x-www-form-urlencoded', 
     'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret) 
    }  
}).then(onTokenResponse).then(onTokenJson);

function onTokenResponse(response)
{
    return response.json(); 
}

function onTokenJson(json)
{
    token=json.access_token;
    console.log(token);
}


function onResponse1(response)
{
    return response.json();
}

function onJson1(json)
{
    document.querySelector('#canzone').textContent = "La canzone adatta a te è: "+json.tracks.items[0].name;
    console.log(json);
}