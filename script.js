//You can edit ALL of the code here
var selectedShowImg;
var selectedShow;
const rootElem = document.getElementById ('root');
var allEpisodes = [];
var allShows = [];
var selectBox = document.getElementById ('select-shows');
var showBtn = document.getElementById ('showBtn');
/******************************************SETUP STARTS**********************************************************/

function setup () {
  episodeSelector.hidden = true;
  showBtn.hidden = true;
  showSelector.hidden = false;
  getLiveShows ().then (data => {
    allShows = data;
    makePageForShows (data);
    selectShows (data);
  });

  updateVisitCount ();
}
/******************************************SETUP ENDS**********************************************************/

/**************************************************************************************************************
                                       Creating Page for show Episodes
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
  showBtn.hidden = false;
  showSelector.hidden = true;

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

  for (let j = 0; j < episodeList.length; j++) {
    var option = document.createElement ('option');
    text = document.createTextNode (
      ` S${episodeList[j].season}E${episodeList[j].number} - ${episodeList[j].name} `
    );
    option.setAttribute ('value', episodeList[j].name);
    option.appendChild (text);
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

var showSelector = document.getElementById ('select-shows');
showSelector.addEventListener ('change', function (event) {
  selectedShow = event.target.value;

  if (selectedShow == 'default') {
    var episodeSelector = document.getElementById ('select');
    episodeSelector.value = 'default';
    episodeSelector.textContent = '';
    episodeSelector.hidden = true;
    showBtn.hidden = true;

    getLiveShows ().then (data => {
      makePageForShows (data);
    });
  } else {
    for (let i = 0; i < allShows.length; i++) {
      if (allShows[i].id == selectedShow) {
        selectedShowImg = allShows[i].image.medium;
      }
    }

    rootElem.textContent = '';
    getLiveEpisodes (selectedShow).then (function (data) {
      selectEpisodes (data);
      makePageForEpisodes (data);
    });
  }
});

/****************************************************************************************************************
                                              Search Text Box 
/****************************************************************************************************************/

var inputBox = document.getElementById ('textBox');
inputBox.addEventListener ('keyup', function (e) {
  selectBox.value = 'default';

  if (!showSelector.hidden) {
    searchShows (e.target.value.toLowerCase ());
  } else {
    {
      searchEpisodes (e.target.value.toLowerCase ());
    }
  }
});

function searchShows (searchTerm) {
  getLiveShows ().then (data => {
    var allShows = data;
    console.log (data);
    let filtered = allShows.filter (show => {
      var sorted = [];
      for (var i = 0; i < show.genres.length; i++) {
        sorted.push (show.genres[i].toLowerCase ());
      }
      if (show.summary != null)
        return (
          show.name.toLowerCase ().includes (searchTerm) ||
          sorted.includes (searchTerm) ||
          show.summary.toLowerCase ().includes (searchTerm)
        );
      else
        return (
          show.name.toLowerCase ().includes (searchTerm) ||
          sorted.includes (searchTerm)
        );
    });

    if (filtered.length > 0) {
      rootElem.textContent = '';
      makePageForShows (filtered);
      let counter = document.getElementById ('counter');
      counter.textContent = `${filtered.length} SHOW(s)`;
    } else {
      rootElem.textContent = 'Sorry no match for your search .. ';
      let counter = document.getElementById ('counter');
      counter.textContent = `0 SHOW(s)`;
    }
  });
}

function searchEpisodes (searchTerm) {
  getLiveEpisodes (selectedShow).then (data => {
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
episodeSelector.addEventListener ('change', function (e) {
  inputBox.value = '';
  if (e.target.value === 'default') {
    rootElem.textContent = '';

    getLiveEpisodes (selectedShow).then (data => {
      console.log (selectedShow);
      makePageForEpisodes (data);
    });
  } else {
    getLiveEpisodes (selectedShow).then (data => {
      let episodes = data.filter (function (item) {
        return item.name === e.target.value;
      });
      rootElem.textContent = '';
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
}

/*****************************************************************************************************************
                                    All Shows using fetch()
/******************************************************************************************************************/
async function getLiveShows () {
  let response = await fetch (`https://api.tvmaze.com/shows`);
  let data = await response.json ();
  return data;
}

/*****************************************************************************************************************
                                    Displaying All The Shows On The Page
/******************************************************************************************************************/
function makePageForShows (showsList) {
  // document.getElementById ('secNav').style.justifyContent = 'center';
  counter.textContent = `${showsList.length} SHOW(S)`;
  var episodeSelector = document.getElementById ('select');
  episodeSelector.value = 'default';
  episodeSelector.textContent = '';
  var showSelector = document.getElementById ('select-shows');
  showSelector.value = 'default';

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
          selectedShow = event.target.id;
          getLiveEpisodes (selectedShow).then (data => {
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

        desc = document.createElement ('p');
        desc.innerHTML = `SUMMARY ${showsList[i].summary}`;
        desc.setAttribute ('class', 'descShowClass');
        div.setAttribute ('class', 'divShowClass');

        let aboutShow = document.createElement ('div');
        aboutShow.setAttribute ('class', 'divAboutShow');
        let genres = document.createElement ('div');
        genres.textContent = `GENRES :\t${showsList[i].genres
          .toString ()
          .replace (/,/g, ' | ')}`;
        genres.setAttribute ('class', 'aboutShow');
        let status = document.createElement ('div');
        status.textContent = `STATUS: ${showsList[i].status}`;
        status.setAttribute ('class', 'aboutShow');
        let rating = document.createElement ('div');
        rating.innerHTML = `RATING: ${showsList[i].rating.average}`;
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
        div.appendChild (desc);

        rootElem.appendChild (div);
      }
    }
  }
}

window.onload = setup;
