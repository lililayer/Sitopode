const episodes_list = document.getElementById('episode_list');
const video_player = document.getElementById('video_player');

function Load() {
    console.log("LOADING...");
    video_sources = []
    fetch('./Resources/episodes.json')
        .then(response => response.json())
        .then(data => {
            // INIT
            content = "<table style=\"padding-top:50px;\"><tr>"
            // GET ALL EPISODES
            data["episodes"].forEach(episode => 
            {
                video_sources.push(episode.path);
                content += "<td><button type=\"button\" style=\"width:150px;height:150px;background-color:black;\">"
                content += "<h4 style=\"text-align:left;padding-bottom:0px;padding-top:5px\">" + episode.tag + "</h4>"
                content += "<p>" + episode._name + "</p>"
                content += "</button></td>"
            });
        })
        .then(() => {
            content += "</tr></table>"
            // INSERT IN HTML
            episodes_list.insertAdjacentHTML('beforeend', content);
            console.log(video_sources);
            buttons = Array.from(episodes_list.getElementsByTagName('button'));
            for (let i = 0; i < buttons.length; i++) {
                console.log(i);
                buttons[i].onclick = function() {
                    video_player.src=video_sources[i];
                    console.log(i);
                    video_player.load();
                };
            };
        });
    return 0;
}

Load();
