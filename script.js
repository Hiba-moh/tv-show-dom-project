//You can edit ALL of the code here


const rootElem = document.getElementById ('root');
//const allEpisodes = getAllEpisodes ();
 var allEpisodes;
/******************************************SETUP STARTS**********************************************************/

function setup () {
  const allShows = getAllShows();
  selectShows(allShows);
  makePageForShows(allShows);
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
    img.setAttribute ('src', episodeList[i].image.medium);
    img.setAttribute ('class', 'imgClass');
    sumHeader=document.createElement('h5')
    sumHeader.setAttribute('class','sumClass');
    sumHeader.textContent ='Summary'
    desc = document.createElement ('p');
    desc.innerHTML = episodeList[i].summary;
    desc.setAttribute ('class', 'descClass');
    div.setAttribute ('class', 'divClass');
    div.appendChild (text);
    div.appendChild (img);
    div.appendChild(sumHeader)
    div.appendChild (desc);

    /*This code gives all of the div elements same id as the episode 
    (it makes it easy to grab the episode when it has been clicked)*/

    let keyId = `${episodeList[i].id}`;
    div.id = keyId;
    text.id = keyId;
    img.id = keyId;
    desc.id = keyId;
    desc.firstChild.id = keyId;
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

function select (episodeList) {
  for (let i = 0; i < allEpisodes.length; i++) {
    if (allEpisodes[i].season < 10) {
      allEpisodes[i].season = '0' + allEpisodes[i].season;
    }
    if (allEpisodes[i].number < 10) {
      allEpisodes[i].number = '0' + allEpisodes[i].number;
    }
  }
  var select = document.getElementById ('select');
  select.textContent='';
  for (let i = 0; i < episodeList.length; i++) {
    var option = document.createElement ('option');
    text = document.createTextNode (
      ` S${episodeList[i].season}E${episodeList[i].number} - ${episodeList[i].name} `
    );
    option.setAttribute ('value', episodeList[i].name);
    option.appendChild (text);
    select.insertBefore (option, select.lastChild);
  }
}

/*************************************************************************************************************** 
                                             Building the Shows select menu
  /***************************************************************************************************************/

  function selectShows (allShows) {
    var select = document.getElementById ('select-shows');
    for (let i = 0; i < allShows.length; i++) {
      var option = document.createElement ('option');
      text = document.createTextNode (
        `${allShows[i].name} `
      );
      option.setAttribute ('value', allShows[i].id);
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
selectBox.addEventListener ('change', function (e) {
  rootElem.textContent='';
 getLiveEpisodes(e.target.value);
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
  inputBox.value='';
  if (e.target.value === 'default') {
    rootElem.textContent = '';
    makePageForEpisodes (allEpisodes);
  } else {
    rootElem.textContent = '';
    let episodes = allEpisodes.filter (function (item) {
      return item.name === e.target.value;
    });
    makePageForEpisodes (episodes);
  }
});

/*************************************************************************************************************** 
                                     Making cards links to their original descriptions
/***************************************************************************************************************/

function myFunction (event) {
  let result = allEpisodes.find (function (item) {
    return event.target.id == item.id;
  });

  // window.location=result.url;
  window.open (result.url);
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

function getLiveEpisodes(showId){
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
  .then(response=>{
    return response.json();
  })
  .then(data=>{
    allEpisodes = data;
    makePageForEpisodes(allEpisodes);
    select(allEpisodes);
  })
  .catch(error=>{
    alert(error);
  })
}

/*****************************************************************************************************************
                                    Displaying All The Shows On The Page
/******************************************************************************************************************/
function makePageForShows(showsList) {
  rootElem.textContent='';
  for (let i = 0; i < showsList.length; i++) {
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

window.onload = setup;