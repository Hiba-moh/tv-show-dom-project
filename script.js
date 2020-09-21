//You can edit ALL of the code here
var selectedShowImg;
var selectedShow;
const rootElem = document.getElementById ('root');
//const allEpisodes = getAllEpisodes ();
var allEpisodes = [];
var allShows = [];
/******************************************SETUP STARTS**********************************************************/

function setup () {
  episodeSelector.hidden = true;
  showSelector.hidden = false;
  // document.cookie = ".tvmaze.com/__qca ";
  // document.cookie = ".tvmaze.com/_gads";
  // function alertCookie() {
  //   alert(document.cookie);
  // }
  // allShows = getAllShows();

  getLiveShows ().then (data => {
    allShows = data;
    makePageForShows (data);
    selectShows (data);
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
function WordCount (str) {
  let newStr = str.split (' ');
  let ourStr = [];
  for (i = 0; i < 40; i++) {
    ourStr.push (newStr[i]);
  }
  return ourStr.join (' ');
}

function makePageForEpisodes (episodeList) {
  episodeSelector.hidden = false;
  showSelector.hidden = true;

  if (showSelector.hidden) {
    //     searchBox=document.getElementById('nav-search');
    //     searchBox.style.marginRight='20rem'
    //       episodeSelector.style.marginRight='20rem';
    secondNav = document.getElementById ('secNav').style.justifyContent =
      'space-evenly';
  }
  for (let i = 0; i < episodeList.length; i++) {
    div = document.createElement ('div');
    text = document.createElement ('h5');

    text.textContent = `${episodeList[i].name} - S${episodeList[i].season}E${episodeList[i].number}`;
    text.setAttribute ('class', 'h4class');
    img = document.createElement ('img');

    if (episodeList[i].image) {
      img.setAttribute ('src', episodeList[i].image.medium);
    } else {
      img.setAttribute ('src', `${selectedShowImg}`);

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
    sumHeader = document.createElement ('h5');
    sumHeader.setAttribute ('class', 'sumClass');
    sumHeader.textContent = 'Summary';
    desc = document.createElement ('p');

    var newSummary = WordCount (episodeList[i].summary);

    if (episodeList[i].summary != '' && episodeList[i].summary != null) {
      desc.innerHTML = newSummary;
      if (episodeList[i].summary.length > newSummary.length)
        desc.innerHTML += 'Read More ';
    } else
      desc.innerHTML = `We don't have a summary for ${episodeList[i].name} yet. Hang in there, or go ahead and contribute one.`;

    desc.setAttribute ('class', 'descClass');
    div.setAttribute ('class', 'divClass');
    div.appendChild (text);
    div.appendChild (img);
    div.appendChild (sumHeader);
    div.appendChild (desc);

    /*This code gives all of the div elements same id as the episode 
    (it makes it easy to grab the episode when it has been clicked)*/

    let keyId = `${episodeList[i].url}`;
    div.id = keyId;
    text.id = keyId;
    img.id = keyId;
    desc.id = keyId;
    if (desc.firstChild) {
      desc.firstChild.id = keyId;
    }
    rootElem.appendChild (div);

    div.addEventListener ('click', function (event) {
      // window.location=event.target.id;
      window.open (event.target.id);
    });
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
  var EpisodeSelector = document.getElementById ('select');
  EpisodeSelector.textContent = '';

  var option = document.createElement ('option');
  text = document.createTextNode ('ALL EPISODES ...');
  option.setAttribute ('value', 'default');
  option.appendChild (text);
  EpisodeSelector.append (option);
  // select.insertBefore (option, select.firstChild);

  for (let j = 0; j < episodeList.length; j++) {
    var option = document.createElement ('option');
    text = document.createTextNode (
      ` S${episodeList[j].season}E${episodeList[j].number} - ${episodeList[j].name} `
    );
    option.setAttribute ('value', episodeList[j].name);
    option.appendChild (text);
    // select.insertBefore (option, select.lastChild);
    EpisodeSelector.append (option);
  }
}

/*************************************************************************************************************** 
                                             Building the Shows select menu
  /***************************************************************************************************************/

function selectShows (allShows) {
  var episodeSelector = document.getElementById ('select');
  episodeSelector.value = 'default';
  episodeSelector.textContent = '';

  names = [];
  allShows.forEach (element => {
    names.push (element.name);
  });
  names = names.sort ();
  var showSelector = document.getElementById ('select-shows');
  for (let i = 0; i < allShows.length; i++) {
    var option = document.createElement ('option');
    text = document.createTextNode (`${names[i]} `);
    for (j = 0; j < allShows.length; j++) {
      if (names[i] === allShows[j].name) {
        option.setAttribute ('value', allShows[j].id);
      }
    }
    option.appendChild (text);
    showSelector.insertBefore (option, select.lastChild);
  }
}

/****************************************************************************************************************
                        Building The Episode Select menu Depends On The Selected Show 
                           And Displaying The Selected Show Episodes On the Page
/****************************************************************************************************************/

// const allEpisodes = getAllEpisodes ();
var showSelector = document.getElementById ('select-shows');
showSelector.addEventListener ('change', function (event) {
  selectedShow = event.target.value;
  // allShows = getAllShows();
  if (selectedShow == 'default') {
    var episodeSelector = document.getElementById ('select');
    episodeSelector.value = 'default';
    episodeSelector.textContent = '';
    episodeSelector.hidden = true;

    getLiveShows ().then (data => {
      makePageForShows (data);
    });
  } else {
    for (let i = 0; i < allShows.length; i++) {
      if (allShows[i].id == selectedShow) {
        selectedShowImg = allShows[i].image.medium;
      }
    }

    // select = document.getElementById ('select');
    rootElem.textContent = '';
    getLiveEpisodes (selectedShow).then (function (data) {
      selectEpisodes (data);
      makePageForEpisodes (data);
    });
  }
});

/****************************************************************************************************************
                                             When Click Show Title
/****************************************************************************************************************/
// var clickedShow = document.querySelector('h4Showclass');
// clickedShow.addEventListener('click',function(event){
//   getLiveEpisodes(event.target.id).then(data=>{
//     console.log(data);
//        makePageForEpisodes(data);
//      })

// })

/****************************************************************************************************************
                                              Search Text Box 
/****************************************************************************************************************/

var inputBox = document.getElementById ('textBox');
inputBox.addEventListener ('keyup', function (e) {
  selectBox.value = 'default';
  search (e.target.value.toLowerCase ());
});
// search box function
function search (searchTerm) {
  var showSelector = document.getElementById ('select-shows');
  getLiveEpisodes (showSelector.value).then (data => {
    var allEpisodes = data;

    let filtered = allEpisodes.filter (episode => {
      if (episode.summary != null)
        return (
          episode.name.toLowerCase ().includes (searchTerm) ||
          episode.summary.toLowerCase ().includes (searchTerm)
        );
      else return episode.name.toLowerCase ().includes (searchTerm);
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
  });
}

/****************************************************************************************************************
                        Select menu- Displaying the exact episode when choosing from the list
/****************************************************************************************************************/

var episodeSelector = document.getElementById ('select');
// const allEpisodes = getAllEpisodes ();
episodeSelector.addEventListener ('change', function (e) {
  showSelector = document.getElementById ('select-shows');
  inputBox.value = '';
  if (e.target.value === 'default') {
    rootElem.textContent = '';
    getLiveEpisodes (showSelector.value).then (data => {
      var allEpisodes = data;
      makePageForEpisodes (allEpisodes);
    });
  } else {
    getLiveEpisodes (showSelector.value).then (data => {
      rootElem.textContent = '';
      let episodes = data.filter (function (item) {
        return item.name === e.target.value;
      });
      makePageForEpisodes (episodes);
    });
  }
});

/*************************************************************************************************************** 
                                     Making Episodes cards links to their original descriptions
/***************************************************************************************************************/

function myFunction (event) {
  getLiveEpisodes (selectedShow).then (data => {
    let result = data.find (function (item) {
      return event.target.id == item.url;
    });

    // window.location=result.url;
    window.open (result.url);
  });
}

/*************************************************************************************************************** 
                                     Making Shows cards Display their Episodes when Clicked
/***************************************************************************************************************/

// text.onclick = getLiveEpisodes(showsList[i].id).then(data=>{
//   console.log(data);
//      makePageForEpisodes(data);
//    })

/****************************************************************************************************************
                                     page viewers counter
/****************************************************************************************************************/

const countEl = document.getElementById ('visitors');

function updateVisitCount () {
  fetch (
    'https://api.countapi.xyz/update/cyf-hiba-moh-tv.netlify.app/netlify.app/?amount=1'
  )
    .then (res => res.json ())
    .then (res => {
      countEl.innerHTML = `|${res.value} PAGE VIEWS|`;
    });
}

/*****************************************************************************************************************
                                    Episodes using fetch()
/******************************************************************************************************************/

async function getLiveEpisodes (showId) {
  let response = await fetch (
    `https://api.tvmaze.com/shows/${showId}/episodes`
  );
  let data = await response.json ();
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
async function getLiveShows () {
  let response = await fetch (`https://api.tvmaze.com/shows`);
  let data = await response.json ();
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
function makePageForShows (showsList) {
  document.getElementById ('secNav').style.justifyContent = 'center';
  counter.textContent = `${showsList.length} SHOW(S)`;
  var episodeSelector = document.getElementById ('select');
  episodeSelector.value = 'default';
  episodeSelector.textContent = '';
  var showSelector = document.getElementById ('select-shows');
  showSelector.value = 'default';

  // console.log(showsList);
  let names = [];
  showsList.forEach (element => {
    names.push (element.name);
  });
  names = names.sort ();

  rootElem.textContent = '';
  for (j = 0; j < names.length; j++) {
    for (let i = 0; i < showsList.length; i++) {
      if (showsList[i].name === names[j]) {
        div = document.createElement ('div');
        text = document.createElement ('h5');

        text.textContent = `${showsList[i].name}`;
        text.setAttribute ('class', 'h4Showclass');
        text.setAttribute ('id', showsList[i].id);

        text.addEventListener ('click', function (event) {
          getLiveEpisodes (event.target.id).then (data => {
            selectEpisodes (data);
            showSelector.value = event.target.id;
            showSelector.hidden = true;
            rootElem.textContent = '';
            makePageForEpisodes (data);
          });
        });

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

        let aboutShow = document.createElement ('div');
        aboutShow.setAttribute ('class', 'divAboutShow');
        let genres = document.createElement ('div');
    genres.textContent = `GENRES :\t${showsList[i].genres.toString().replace(/,/g,' | ')}`;
            genres.setAttribute ('class', 'aboutShow');
        let status = document.createElement ('div');
        status.textContent = `STATUS: ${showsList[i].status}`;
        status.setAttribute ('class', 'aboutShow');
        let rating = document.createElement ('div');
        rating.innerHTML = `RATING: ${showsList[i].rating.average}`;
        console.log (showsList);
        rating.setAttribute ('class', 'aboutShow');
        let runTime = document.createElement ('div');
        runTime.textContent = `RUNTIME: ${showsList[i].runtime}`;
        runTime.setAttribute ('class', 'aboutShow');
        aboutShow.appendChild (genres);
        aboutShow.appendChild (status);
        aboutShow.appendChild (rating);
        aboutShow.appendChild (runTime);

        div.appendChild (text);
        div.appendChild (img);
        div.appendChild (aboutShow);
        // div.appendChild(sumHeader)
        div.appendChild (desc);

        /*This code gives all of the div elements same id as the episode 
    (it makes it easy to grab the episode when it has been clicked)*/
        // let keyId = `${showsList[i].id}`;
        // div.id = keyId;
        // text.id = keyId;
        // img.id = keyId;
        // desc.id = keyId;
        // desc.firstChild.id = keyId;
        rootElem.appendChild (div);
      }
    }
  }
}

window.onload = setup;
