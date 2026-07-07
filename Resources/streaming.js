const episodes_list = document.getElementById('episode_list');
const video_player = document.getElementById('video_player');
var video_sources = []
let currentVideoIndex = 0;

function Load() {
    console.log("LOADING...");
    fetch('./Resources/episodes.json')
        .then(response => response.json())
        .then(data => {
            // INIT
            content = "<table style=\"background-color:black;margin-left:20px;margin-right:20px;margin-top:50px;display:block;overflow:scroll;\"><tr>"
            // GET ALL EPISODES
            data["episodes"].forEach(episode => 
            {
                video_sources.push(episode.path);
                content += "<td style=\"padding:5px\"><button type=\"button\" style=\"border-color:#111;width:150px;height:150px;background-color:black;\">"
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
                    currentVideoIndex = i;
                    video_player.load();
                };
            };
        });
    return 0;
}

video_player.addEventListener('ended', function() {
    currentVideoIndex++;
    if (currentVideoIndex < video_sources.length) {
        video_player.src = video_sources[currentVideoIndex];
        video_player.play();
    }    
});

Load();const episodes_list = document.getElementById('episode_list');
const video_player = document.getElementById('video_player');

function Load() {
    console.log("LOADING...");
    video_sources = []
    fetch('./Resources/episodes.json')
        .then(response => response.json())
        .then(data => {
            // INIT
            content = "<table style=\"background-color:black;margin-left:20px;margin-right:20px;margin-top:50px;display:block;overflow:scroll;\"><tr>"
            // GET ALL EPISODES
            data["episodes"].forEach(episode => 
            {
                video_sources.push(episode.path);
                content += "<td style=\"padding:5px\"><button type=\"button\" style=\"border-color:#111;width:150px;height:150px;background-color:black;\">"
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
