const game_list = document.getElementById('store');
const highlighted = document.getElementById('highlighted');
games = []
class GameData {
    constructor(_title, _url, _preview, _release, _wiki, _resume, _compatibility) {
        this.title = _title
        this.url = _url
        this.preview = _preview
        this.release = _release
        this.wiki = _wiki
        this.resume = _resume
        this.compatibility = _compatibility
        games.push(this)
    }
}

function Load() {
    console.log("LOADING...");
    fetch('./Resources/games.json')
        .then(response => response.json())
        .then(data => {
            // GET ALL EPISODES
            data["games"].forEach(game => 
            {
                new GameData(game.title, game.url, game.preview, game.release, game.wiki, game.resume, game.compatibility)
            });
        })
        .then(() => {
            console.log("GENERATING...")
            const tr = document.createElement("tr");
            game_list.appendChild(tr)
            games.forEach(game => {
                const td = document.createElement("td");
                tr.appendChild(td)
                td.style.width = "400px"
                td.style.height = "350px"
                td.style.paddingTop = "0px"

                
                const button = document.createElement("button");
                td.appendChild(button)
                button.style.width = "100%";
                button.style.height = "250px";
                button.style.background = "black"
                button.style.borderColor = "#111"
                button.type = "button"
                button.addEventListener("click", () => { Highlight(game); });
                
                const img = document.createElement("img");
                button.appendChild(img)
                img.src=game.preview
                img.style.width="80%"
                img.style.height="auto"
                
                const gtitle = document.createElement("h5");
                button.appendChild(gtitle)
                gtitle.textContent = game.title
            });
            console.log("APPENDING...")
            console.log("DONE")
        })
        .then(() => {
            Highlight(games[0]);
        });
    return 0;
}

function Highlight(game) {
    // clear children
    let child = document.getElementById('highlight_child');
    if (child != null)
        highlighted.removeChild(child);
    
    let content = "<div id=\"highlight_child\">";
    content += "<a href = \""+game.url+"\" target=\"_blank\"><h2 style=\"padding-bottom:10px\">"+game.title+"</h2>";
    content += "<img src=\""+game.preview+"\" style=\"width:80%; height:auto;\"/></a>";
    content += "<br/><br/><p style=\"padding-left:10%; padding-right:5%;text-align:left;\">Released on "+game.release+"</p>"
    content += "<p style=\"padding-left:10%; padding-right:5%;text-align:left;\">Compatiblity : "+game.compatibility+"</p>";
    if (game.wiki != "") {
        content += "<a href=\""+game.wiki+"\"><p style=\"padding-left:10%; padding-right:5%;text-align:left;\">WIKI AVAILABLE</p></a>"
    }
    content += "<br/><p style=\"padding-left:15%; padding-right:5%;text-align:left;\">Trailer : "+game.resume+"</p>"
    content += "</div>";
    highlighted.insertAdjacentHTML("beforeend", content);
}

Load();
