//You can edit ALL of the code here
const rootElem = document.getElementById ('root');
var season, episode;

function setup () {
  const allEpisodes = getAllEpisodes ();
  makePageForEpisodes (allEpisodes);
}

function makePageForEpisodes (episodeList) {
  for (let i = 0; i < episodeList.length; i++) {
    if (episodeList[i].season < 10) {
      season = '0' + episodeList[i].season;
    }
    if (episodeList[i].number < 10) {
      episode = '0' + episodeList[i].number;
    }
    div = document.createElement ('div');
    text = document.createElement ('h5');
    text.textContent = `${episodeList[i].name} - S${season}E${episode}`;
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
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  var select = document.getElementById ('select');
  for (let i = 0; i < episodeList.length; i++) {
    if (episodeList[i].season < 10) {
      season = '0' + episodeList[i].season;
    }
    // if (episodeList[i].number < 10) {
    //   episode = '0' + episodeList[i].number;
    // }
    var option = document.createElement ('option');
    text = document.createTextNode (
      ` S${season}E${episode} - ${episodeList[i].name} `
    );
    option.setAttribute ('value', episodeList[i].name);
    option.appendChild (text);
    select.insertBefore (option, select.lastChild);
  }
  let counter = document.getElementById('counter');
  counter.textContent = `${episodeList.length} Episodes`
}

window.onload = setup;

var inputBox = document.getElementById ('textBox');
inputBox.addEventListener ('keyup', function (e) {
  search (e.target.value.toLowerCase ());
});

var selectBox = document.getElementById ('select');
const allEpisodes = getAllEpisodes ();
selectBox.addEventListener ('change', function (e) {
  if (e.target.value === 'default') {
    makePageForEpisodes (allEpisodes);
  } else search (e.target.value.toLowerCase ());
});

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
    let counter = document.getElementById('counter');
  counter.textContent = `${filtered.length} Episodes`
  } else {
    rootElem.textContent = 'Sorry no match for your search .. ';
    let counter = document.getElementById('counter');
  counter.textContent = `0 Episodes`
  }
}
