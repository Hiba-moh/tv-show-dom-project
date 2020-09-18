//You can edit ALL of the code here
var selectedShowImg;
var selectedShow;
const rootElem = document.getElementById ('root');
//const allEpisodes = getAllEpisodes ();
 var allEpisodes=[];
 var allShows= [];
/******************************************SETUP STARTS**********************************************************/

function setup () {
  // document.cookie = ".tvmaze.com/__qca ";
  // document.cookie = ".tvmaze.com/_gads";
  // function alertCookie() {
  //   alert(document.cookie);
  // }
  // allShows = getAllShows();
 
 
  getLiveShows().then(data=>{
  allShows=data;
    makePageForShows(data);
    selectShows(data);
  });
  
  
  // makePageForShows(allShows);
  //This code is to add Zero before each episode and season under 10
  // for (let i = 0; i < allEpisodes.length; i++) {
  //   if (allEpisodes[i].season < 10) {
  //     allEpisodes[i].season = '0' + allEpisodes[i].season;
  //   }
  //   if (allEpisodes[i].number < 10) {
  //     allEpisodes[i].number = '0' + allEpisodes[i].number;
  //   }
  // }
  //select (allEpisodes);

  // getLiveEpisodes(526);
  //  makePageForEpisodes (allEpisodes);
  updateVisitCount ();
}
/******************************************SETUP ENDS**********************************************************/

/**************************************************************************************************************
                                             creating my page HTML-elements
/**************************************************************************************************************/

function makePageForEpisodes (episodeList) {
  for (let i = 0; i < episodeList.length; i++) {
    div = document.createElement ('div');
    text = document.createElement ('h5');

    text.textContent = `${episodeList[i].name} - S${episodeList[i].season}E${episodeList[i].number}`;
    text.setAttribute ('class', 'h4class');
    img = document.createElement ('img');
  
if(episodeList[i].image){
    img.setAttribute ('src', episodeList[i].image.medium);
}else{
  img.setAttribute('src',`${selectedShowImg}`);
 
  // var selectBox = document.getElementById ('select-shows');
  // selectedShow = selectBox.value;
  // allShows.forEach(item=>{
  //   if(item.id===selectedShow){
  //     console.log('that is it')
  //     img.setAttribute('src',`${item.image.medium}`);
  //   }

  // })

  // getLiveShows().then(data=>{
  //   data.forEach(item=>{
  //     if(item.id===selectedShow){
  //       selectedShowImg=item.image.medium;
  //       img.setAttribute('src',selectedShowImg);
  //       console.log(selectedShowImg)
  //     }
  //   })
  // })

}
    
    img.setAttribute ('class', 'imgClass');
    sumHeader=document.createElement('h5')
    sumHeader.setAttribute('class','sumClass');
    sumHeader.textContent ='Summary'
    desc = document.createElement ('p');
    if(episodeList[i].summary!='' && episodeList[i].summary!=null){
    desc.innerHTML = episodeList[i].summary;
    }
    else
    desc.innerHTML=`We don't have a summary for ${episodeList[i].name} yet. Hang in there, or go ahead and contribute one.`;

    desc.setAttribute ('class', 'descClass');
    div.setAttribute ('class', 'divClass');
    div.appendChild (text);
    div.appendChild (img);
    div.appendChild(sumHeader)
    div.appendChild (desc);

    /*This code gives all of the div elements same id as the episode 
    (it makes it easy to grab the episode when it has been clicked)*/
    
    let keyId = `${episodeList[i].url}`;
    div.id = keyId;
    text.id = keyId;
    img.id = keyId;
    desc.id = keyId;
    if(desc.firstChild){
    desc.firstChild.id = keyId;}
    rootElem.appendChild (div);
  }

  /****************************************************************************************************************
                                             Episodes Counter Button
/****************************************************************************************************************/

  let counter = document.getElementById ('counter');
  counter.textContent = `${episodeList.length} Episode(s)`;
}

/*************************************************************************************************************** 
                                             Building the Episodes select menu
  /***************************************************************************************************************/

function selectEpisodes (episodeList) {
  // console.log(episodeList)
  for (let i = 0; i < episodeList.length; i++) {
    if (episodeList[i].season < 10) {
      episodeList[i].season = '0' + episodeList[i].season;
    }
    if (episodeList[i].number < 10) {
      episodeList[i].number = '0' + episodeList[i].number;
    }
  }
  var select = document.getElementById ('select');
  select.textContent='';

  var option = document.createElement ('option');
  text = document.createTextNode ('ALL EPISODES ...');
  option.setAttribute ('value','default');
    option.appendChild (text);
    select.insertBefore (option, select.firstChild);
    
  for (let j = 0; j < episodeList.length; j++) {
    var option = document.createElement ('option');
    text = document.createTextNode (` S${episodeList[j].season}E${episodeList[j].number} - ${episodeList[j].name} `);
    option.setAttribute ('value', episodeList[j].name);
    option.appendChild (text);
    select.insertBefore (option, select.lastChild);
  }
 
}

/*************************************************************************************************************** 
                                             Building the Shows select menu
  /***************************************************************************************************************/

  function selectShows (allShows) {
    names=[];
    allShows.forEach(element => {
      names.push(element.name);      
    });
    names=names.sort();
    var select = document.getElementById ('select-shows');
    for (let i = 0; i < allShows.length; i++) {
      var option = document.createElement ('option');
      text = document.createTextNode (
        `${names[i]} `
      );
        for(j=0;j<allShows.length;j++){
          if(names[i]===allShows[j].name){
      option.setAttribute ('value', allShows[j].id);
      
      }
    }
      option.appendChild (text);
      select.insertBefore (option, select.lastChild);
    }
  }

  /****************************************************************************************************************
                        Building The Episode Select menu Depends On The Selected Show 
                           And Displaying The Selected Show Episodes On the Page
/****************************************************************************************************************/

var selectBox = document.getElementById ('select-shows');
// const allEpisodes = getAllEpisodes ();
selectBox.addEventListener ('change', function (event) {
  selectedShow =event.target.value;
  // allShows = getAllShows();
  if(selectedShow=='default'){
    var select = document.getElementById ('select');
    select.value ='default';
    select.textContent='';
   
    getLiveShows().then(data=>{
      makePageForShows(data);
    })
  }else{

for(let i=0;i<allShows.length;i++){
  if(allShows[i].id==selectedShow){
    selectedShowImg=allShows[i].image.medium;
  }
}
  

    // select = document.getElementById ('select');
  rootElem.textContent='';
 getLiveEpisodes(selectedShow).then(function(data){
  selectEpisodes(data);
  makePageForEpisodes(data);
 })
 
  }
});


/****************************************************************************************************************
                                              Search Text Box 
/****************************************************************************************************************/

var inputBox = document.getElementById ('textBox');
inputBox.addEventListener ('keyup', function (e) {
  selectBox.value="default";
  search (e.target.value.toLowerCase ());
});
// search box function
function search (searchTerm) {
  let filtered = allEpisodes.filter (episode => {
    return (
      episode.name.toLowerCase ().includes (searchTerm) ||
      episode.summary.toLowerCase ().includes (searchTerm)
    );
  });
  if (filtered.length > 0) {
    rootElem.textContent = '';
    makePageForEpisodes (filtered);
    let counter = document.getElementById ('counter');
    counter.textContent = `${filtered.length} Episode(s)`;
  } else {
    rootElem.textContent = 'Sorry no match for your search .. ';
    let counter = document.getElementById ('counter');
    counter.textContent = `0 Episode(s)`;
  }
}

/****************************************************************************************************************
                        Select menu- Displaying the exact episode when choosing from the list
/****************************************************************************************************************/

var selectBox = document.getElementById ('select');
// const allEpisodes = getAllEpisodes ();
selectBox.addEventListener ('change', function (e) {
  selectBox = document.getElementById ('select-shows');
  inputBox.value='';
  if (e.target.value === 'default') {
    rootElem.textContent = '';
    getLiveEpisodes(selectBox.value).then(data=>{
      allEpisodes=data;
      makePageForEpisodes (allEpisodes);
    })
  } else {
  
    getLiveEpisodes(selectBox.value).then(data=>{
    rootElem.textContent = '';
    let episodes = data.filter (function (item) {
      return item.name === e.target.value;
    });
    makePageForEpisodes (episodes);
  })
  }
  
});

/*************************************************************************************************************** 
                                     Making cards links to their original descriptions
/***************************************************************************************************************/

function myFunction (event) {

  getLiveEpisodes(selectedShow).then(data=>{
    let result = data.find (function (item) {
      return event.target.id == item.url;
    });
  
    // window.location=result.url;
    window.open (result.url);
  })
  
}

/****************************************************************************************************************
                                     page viewers counter
/****************************************************************************************************************/

const countEl = document.getElementById ('visitors');

function updateVisitCount () {
  fetch ('https://api.countapi.xyz/update/cyf-hiba-moh-tv.netlify.app/netlify.app/?amount=1')
    .then (res => res.json ())
    .then (res => {
      countEl.innerHTML = `${res.value} Views`;
    });
}

/*****************************************************************************************************************
                                    Episodes using fetch()
/******************************************************************************************************************/

async function getLiveEpisodes(showId){

  let response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  let data= await response.json();
  return data;

  // fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
  // .then(response=>{
  //   return response.json();
  // })
  // .then(data=>{
  //   allEpisodes = data;
  //   makePageForEpisodes(allEpisodes);
  //   select(allEpisodes);
  // })
  // .catch(error=>{
  //   // allEpisodes.forEach(function(element,index){
  //   //   if(!element.image){
  //   //     delete element[index];
  //   //   }
  //   // })
  //   alert(error);
  // })
}

/*****************************************************************************************************************
                                    All Shows using fetch()
/******************************************************************************************************************/
async function getLiveShows(){
  let response = await fetch(`https://api.tvmaze.com/shows`);
  let data = await response.json();
  return data;

  // fetch(`https://api.tvmaze.com/shows`)
  // .then(response=>{
  //   if(!response.ok){
  //     throw Error('error');
  //   }
  //   return response.json();
  // })
  // .then(data=>{
  //   allShows = data;
  //   makePageForShows(allShows);
  //   selectShows(allShows);
  //   console.log(data)
  // })
  // .catch(error=>{
  //   alert(error);
  // })
}

/*****************************************************************************************************************
                                    Displaying All The Shows On The Page
/******************************************************************************************************************/
function makePageForShows(showsList) {
  // console.log(showsList);
  let names=[];
    showsList.forEach(element => {
      names.push(element.name);      
    });
    names=names.sort();
 
  rootElem.textContent='';
  for(j=0;j<names.length;j++){
  for (let i = 0; i < showsList.length; i++) {
      if(showsList[i].name===names[j])
      {
    div = document.createElement ('div');
    text = document.createElement ('h5');

    text.textContent = `${showsList[i].name} - S${showsList[i].season}E${showsList[i].number}`;
    text.setAttribute ('class', 'h4Showclass');
    img = document.createElement ('img');
    img.setAttribute ('src', showsList[i].image.medium);
    img.setAttribute ('class', 'imgShowClass');
    // sumHeader=document.createElement('h5')
    // sumHeader.setAttribute('class','sumShowClass');
    // sumHeader.textContent ='Summary'
    desc = document.createElement ('p');
    desc.innerHTML = `SUMMARY ${showsList[i].summary}`;
    desc.setAttribute ('class', 'descShowClass');
    div.setAttribute ('class', 'divShowClass');
    div.appendChild (text);
    div.appendChild (img);
    // div.appendChild(sumHeader)
    div.appendChild (desc);

    /*This code gives all of the div elements same id as the episode 
    (it makes it easy to grab the episode when it has been clicked)*/

    let keyId = `${showsList[i].id}`;
    div.id = keyId;
    text.id = keyId;
    img.id = keyId;
    desc.id = keyId;
    desc.firstChild.id = keyId;
    rootElem.appendChild (div);
      }
    }
  }
}

window.onload = setup;