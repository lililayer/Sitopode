// init declarations
const game_list = document.getElementById('store');
const highlighted = document.getElementById('highlighted');
games = []
class GameData {
    constructor(_title, _url, _preview, _release, _wiki, _tags, _resume, _compatibility) {
        this.title = _title
        this.url = _url
        this.preview = _preview
        this.release = _release
        this.wiki = _wiki
        this.tags = _tags
        this.resume = _resume
        this.compatibility = _compatibility
        games.push(this)
    }
}

// page load
function Load() {
    console.log("LOADING...");
    fetch('./Resources/games.json')
        .then(response => response.json())
        .then(data => {
            // get all episodes
            data["games"].forEach(game => 
            {
                new GameData(game.title, game.url, game.preview, game.release, game.wiki, game.tags, game.resume, game.compatibility)
            });
        })
        .then(() => {
            // generate game slots
            console.log("GENERATING...")
            const tr = document.createElement("tr");
            game_list.appendChild(tr)
            let i = 0
            games.forEach(game => {
                const td = document.createElement("td");
                tr.appendChild(td)
                td.style.width = "400px"
                td.style.height = "250px"
                td.style.paddingTop = "0px"
                td.style.zIndex = 1
                td.style.position = "relative"
                td.addEventListener("mouseover", (event) => { 
                    panel.style.visibility = "visible"
                })
                td.addEventListener("mouseout", (event) => { 
                    panel.style.visibility = "hidden"
                })
                
                const button = document.createElement("button");
                td.appendChild(button)
                button.style.width = "100%";
                button.style.height = "100%";
                button.style.background = "black"
                button.style.borderColor = "#111"
                button.type = "button"
                button.style.cursor = "pointer";
                button.addEventListener("click", () => { Highlight(game); });
                
                const img = document.createElement("img");
                button.appendChild(img)
                img.game = game
                img.src=game.preview
                img.style.width="80%"
                img.style.height="auto"
                
                const gtitle = document.createElement("h5");
                button.appendChild(gtitle)
                gtitle.textContent = game.title
                
                // make a panel on sticked on the right side of event.target which show us game title, release date and tags
                const panel = document.createElement("div")
                game.panel = panel
                td.appendChild(panel)
                panel.style.width = "90%"
                panel.style.height = "50px"
                panel.style.padding = "20px"
                panel.style.marin = "20px"
                panel.style.align = "center"
                panel.style.textAlign = "left"
                panel.style.backgroundColor = "#000"
                panel.style.visibility = "hidden"
                panel.style.position = "absolute"
                panel.style.zIndex = 100
                panel.style.inset = 0
                
                const ptitle = document.createElement("h5")
                panel.appendChild(ptitle)
                ptitle.textContent = game.title
                const prelease = document.createElement("p")
                panel.appendChild(prelease)
                prelease.textContent = game.release
                const ptags = document.createElement("p")
                panel.appendChild(ptags)
                ptags.textContent = "tags : "
                let tid = 0
                game.tags.forEach (tag => {
                    ptags.textContent += tag;
                    if (tid < game.tags.length - 1) {ptags.textContent += ', '}
                    tid++
                });
                i++
            });
            console.log("APPENDING...")
            console.log("DONE")
        })
        .then(() => {
            // highlight game preview
            Highlight(games[0]);
        });
    return 0;
}

function Highlight(game) {
    // clear children
    let child = document.getElementById('highlight_child');
    if (child != null)
        highlighted.removeChild(child);
    
    // append content
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

// main
Load();
