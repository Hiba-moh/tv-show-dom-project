//You can edit ALL of the code here
function setup () {
  const allEpisodes = getAllEpisodes ();
  makePageForEpisodes (allEpisodes);
}

function makePageForEpisodes (episodeList) {
  var season, episode;
  const rootElem = document.getElementById ('root');
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
    if (episodeList[i].number < 10) {
      episode = '0' + episodeList[i].number;
    }
    var option = document.createElement ('option');
    text = document.createTextNode (
      `${episodeList[i].name} - S${season}E${episode}`
    );
    option.setAttribute ('value', episodeList[i].name);
    option.appendChild (text);
    select.insertBefore (option, select.lastChild);
  }

//   var inputBox = document.getElementById('textBox');
//   for(i=0;i<episodeList.length;i++){
//  inputBox.addEventListener('keypress',function(e){
   
//   })

//   }
 
}

window.onload = setup;
