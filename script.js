//You can edit ALL of the code here
const rootElem = document.getElementById ('root');
function setup () {
  const allEpisodes = getAllEpisodes ();
  makePageForEpisodes (allEpisodes);
}

/**************************************************************************************************************
                                             creating my page HTML-elements
/**************************************************************************************************************/

function makePageForEpisodes (episodeList) {
  for (let i = 0; i < episodeList.length; i++) {
    if (episodeList[i].season < 10) {
      episodeList[i].season = '0' + episodeList[i].season;
    }
    if (episodeList[i].number < 10) {
      episodeList[i].number = '0' + episodeList[i].number;
    }
    div = document.createElement ('div');
    text = document.createElement ('h5');
    text.textContent = `${episodeList[i].name} - S${episodeList[i].season}E${episodeList[i].number}`;
    text.setAttribute ('class', 'h4class');
    img = document.createElement ('img');
    img.setAttribute ('src', episodeList[i].image.medium);
    img.setAttribute ('class', 'imgClass');
    desc = document.createElement ('div');
    desc.innerHTML = episodeList[i].summary;
    desc.setAttribute ('class', 'descClass');
    div.setAttribute ('class', 'divClass');
    div.appendChild (text);
    div.appendChild (img);
    div.appendChild (desc);
    rootElem.appendChild (div);
  }
  /*************************************************************************************************************** 
                                             Building the select menu
  /***************************************************************************************************************/
  var select = document.getElementById ('select');
  for (let i = 0; i < episodeList.length; i++) {
    var option = document.createElement ('option');
    text = document.createTextNode (
      ` S${episodeList[i].season}E${episodeList[i].number} - ${episodeList[i].name} `
    );
    option.setAttribute ('value', episodeList[i].name);
    option.appendChild (text);
    select.insertBefore (option, select.lastChild);
  }
  /****************************************************************************************************************
                                             Episodes Conter Button
/****************************************************************************************************************/

  let counter = document.getElementById ('counter');
  counter.textContent = `${episodeList.length} Episode(s)`;
}
/****************************************************************************************************************
                                              Search Text Box 
/****************************************************************************************************************/
var inputBox = document.getElementById ('textBox');
inputBox.addEventListener ('keyup', function (e) {
  search (e.target.value.toLowerCase ());
});
// search box function
function search (searchTerm) {
  const allEpisodes = getAllEpisodes ();
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
                                     Select menu- Displaying the exact episode from the list
/****************************************************************************************************************/
var selectBox = document.getElementById ('select');
const allEpisodes = getAllEpisodes ();
selectBox.addEventListener ('change', function (e) {
  if (e.target.value === 'default') {
    rootElem.textContent='';
    makePageForEpisodes (allEpisodes);
  } else {
    rootElem.textContent = '';
    let episodes = allEpisodes.filter (function (item) {
      return item.name === e.target.value;
    });
    makePageForEpisodes (episodes);
  }
});
/******************************************************************************************************************/
window.onload = setup;
