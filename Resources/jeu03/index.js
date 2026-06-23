// INITIALISE INSTANCES
const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const bottomText = document.getElementById("bottomText");
frameCode = 0;
// input instance variables
let zPressed = false;
let sPressed = false;
let dPressed = false;
let qPressed = false;
let upPressed = false;
let downPressed = false;
let ePressed = false;
// scene instances
gameObjects = [];
class GameObject {
    constructor(_name, _x, _y, _xScale, _yScale, _spritePath) {
        this._name_ = _name;
        this.x = _x;
        this.y = _y;
        this.xScale = _xScale;
        this.yScale = _yScale;
        this.spritePath = _spritePath;
        this.sprite = new Image();
        this.sprite.src = this.spritePath;
        this.isActive = true;
        console.log("new game object : " + this._name_);
        gameObjects.push(this);
    }
    SetActive(_isActive = true) {
        this.isActive = _isActive;
    }
}
function FindGameObjectByName(_name) {
    for (let i = 0; i < gameObjects.length; i++) {
        obj = gameObjects[i];
        if (obj._name_ == _name) {
            return obj;
        }
    }
    return null;
}
//player = new GameObject("Player", -910, 400, 40, 40, "./Resources/player.png", 100);
player = new GameObject("Player", -880, 400, 40, 40, "./Resources/player.png", 100);
function hitbox(xt, yt, x1, x2, y1, y2) {
    let hit =  xt > x1 
            && xt < x2 
            && yt > y1 
            && yt < y2;
    return hit;
}
// gameplay instances
ufo_mode = 0;
ufo_tick_count = 0;
quests = [];
let questID = 0;
class WorldTrigger {
    constructor(_type, _distance, _x, _y) {
        this._type_ = _type;
        this.distance = _distance;
        this.x = _x;
        this.y = _y;
        this.isActive = true;
    }
    GetState() {
        if (this.isActive == false) { return false; }
        if (this._type_ == "input") {
            if (ePressed) {
                if (hitbox(player.x,player.y,this.x-this.distance,this.x+this.distance,this.y-this.distance,this.y+this.distance)) {
                    return true;
                }
            }
        }
        if (this._type_ == "heading") {
            if (hitbox(player.x,player.y,this.x-this.distance,this.x+this.distance,this.y-this.distance,this.y+this.distance)) {
                return true;
            }
        }
        return false;
    }
}
class QuestPart {
    constructor(_description, startAction, _TAction_, _worldTrigger) {
        this._description_ = _description;
        this.startAction = startAction;
        this._TAction_ = _TAction_;
        this.worldTrigger = _worldTrigger;
        this.activated = false;
        quests.push(this);
    }
    Activate() {
        this.activated = true;
        if (this.startAction != "None") {
            InvokeActionByTag(this.startAction, this.worldTrigger);
        }
        bottomText.textContent = this._description_;
    }
    CheckQuestTrigger() {
        if (this.worldTrigger.GetState() == true) {
            if (this._TAction_ != "None") {
                InvokeActionByTag(this._TAction_, this.worldTrigger);
            }
            questID++;
        }
    }
}
function InvokeActionByTag(action_tag, trigger) {
    console.log(action_tag);
    if (action_tag == "init") {
        ufo_mode = 0;
    }
    if (action_tag == "take_off_jar") {
        jar = FindGameObjectByName("formol_arm");
        jar.isActive = false;
    }
    if (action_tag == "put_down_jar") {
        jar = FindGameObjectByName("formol_arm");
        jar.isActive = true;
        jar.x = -900;
        jar.y = 480;
    }
    if (action_tag == "wait_trigger_key_up") {
        trigger.isActive = false;
    }
    if (action_tag == "ufo_launch_fail") {
        ufo_mode = 1;
    }
    if (action_tag == "trigger_shierif_cinematic") {
        freezed = true;
        compass.SetActive(false);
        camera_zoom = 2;
        player.x = 1350;
        player.y = 315;
        s = FindGameObjectByName("shierif");
        s.x = 1200;
        s.y = 250;
        questID++;
    }
    if (action_tag == "start_formol_battle") {
        formol_battle = true;
        freezed = false;
        camera_zoom = 1;
    }
    if (action_tag == "ClotildeHeadUFO") {
        clothildeHeadUFO = true;
        compass.SetActive(true);
    }
    if (action_tag == "ufo_launch_pass") {
        ufo_tick_count = 0;
        ufo_mode = 4;
        compass.SetActive(false);
    }
}

// camera settings
let camera_x = 0.00;
let camera_y = 0.00;
let camera_smooth_speed = 0.2;
let camera_zoom = 1.00;
let camera_zoom_min = 1;
let camera_zoom_max = 8;
let camera_zoom_speed = 0.025;

// global player settings
let speed = 3;
let freezed = false;

// main loop
function GameInstance() {
    frameCode++;
    time = (performance.now() - START_TIME) / 1000;
    delta_time = time - last_time;
    last_time = time;
    requestAnimationFrame(GameInstance);
    clearScreen();
    Update();
    LateUpdate();
    drawScreen();
}

////////////////////
// GAME FUNCTIONS //
////////////////////
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
compass = new GameObject("compass", 0, 0, 20, 20, "./Resources/compass.png")
function Start() {
    console.log("LOADING...");
    fetch('./map.json')
        .then(response => response.json())
        .then(data => {
            data["GameObjects"].forEach(post => 
            {
                new GameObject(
                    post._name_, 
                    post.x, 
                    post.y, 
                    post.xScale, 
                    post.yScale, 
                    post.texture
                );
            });
            data["Quest"].forEach(post => 
            {
                new QuestPart(
                    post._description,
                    post.startAction,
                    post._TAction_,
                    new WorldTrigger(post._type_, post._distance, post._x, post._y)
                );
            });
        })
        .then(() => {
            s = FindGameObjectByName("shierif");
            s.lifes = 7;
        });
}
ufo_end = false;
function playerUpdate() {
    if (ufo_end) {
        var u2 = FindGameObjectByName("ufo2");
        player.x = u2.x;
        player.y = u2.y;
    }
    if (freezed) { return 0; }
    if(zPressed && player.y < 725) {
        player.y += speed;
    }
    if(sPressed && player.y > -330) {
        player.y -= speed;
    }
    if(dPressed && player.x < 1950) {
        player.x += speed;
    }
    if(qPressed && player.x > -1060) {
        player.x -= speed;
    }
    if(upPressed && camera_zoom < camera_zoom_max) {
        camera_zoom += camera_zoom_speed * camera_zoom;
    }
    if(downPressed && camera_zoom > camera_zoom_min) {
        camera_zoom -= camera_zoom_speed * camera_zoom;
    }
    return 0;
}
function questUpdate() {
    if (quests.length > questID) {
        if (!quests[questID].activated) {
            quests[questID].Activate();
        } else {
            quests[questID].CheckQuestTrigger();
        }
    }
}
function ufoUpdate() {
    var u1 = FindGameObjectByName("ufo");
    var u2 = FindGameObjectByName("ufo2");
    var u3 = FindGameObjectByName("ufo3");
    if (u1 != null && u2 != null && u3 != null) {
        if (ufo_mode == 0) {
            u1.SetActive(true);
            u2.SetActive(false);
            u3.SetActive(false);
        }
        if (ufo_mode == 1 || ufo_mode == 2) {
            if (frameCode % 50 == 0) {
                if (ufo_mode == 2) {
                    ufo_tick_count++;
                    ufo_mode = 1;
                    u1.SetActive(false);
                    u2.SetActive(true);
                    u3.SetActive(false);
                } else {
                    ufo_mode = 2;
                    u1.SetActive(true);
                    u2.SetActive(false);
                    u3.SetActive(false);
                }
            }
            if (ufo_tick_count >= 3) {
                ufo_mode = 3;
                questID++;
            }
        }
        if (ufo_mode == 3) {
            u1.SetActive(false);
            u2.SetActive(false);
            u3.SetActive(true);
        }
        if (ufo_mode == 4 || ufo_mode == 5) {
            if (frameCode % 50 == 0) {
                if (ufo_mode == 5) {
                    ufo_tick_count++;
                    ufo_mode = 4;
                    u1.SetActive(false);
                    u2.SetActive(true);
                    u3.SetActive(false);
                    if (ufo_tick_count > 4) {
                        camera_zoom = 1;
                        freezed = true;
                        ufo_end = true;
                        ufo_mode = 6;
                    }
                } else {
                    ufo_mode = 5;
                    u1.SetActive(true);
                    u2.SetActive(false);
                    u3.SetActive(false);
                }
            }
        }
        if (ufo_end) {
            u2.y++;
        }
    }
}
formol_battle = false;
battle_frame = 0;
shierif_dir = 0;
shierif_speed = 5;
bullets = []
bullet_speed = 8;
function UpdateBullet(bullet) {
    if (bullet.isActive == false) { return; }
    bullet.x += bullet.dirX;
    bullet.y += bullet.dirY;
    bullet.timer += delta_time;
    if (bullet.timer > 5) {
        bullet.SetActive(false);
    }
    s = FindGameObjectByName("shierif");
    if (s.isActive == false) {
        bullet.targetmode = 2;
    }
    if (bullet.targetmode == 0 && hitbox(bullet.x, bullet.y, player.x - 10, player.x + 10, player.y - 10, player.y + 10)) {
        let equX = s.x - player.x;
        let equY = s.y - player.y;
        let dist = Math.sqrt(equX * equX + equY * equY);
        bullet.dirX = (equX) / dist * bullet_speed;
        bullet.dirY = (equY) / dist * bullet_speed;
        bullet.targetmode = 1;
    }
    if (bullet.targetmode == 1 && hitbox(bullet.x, bullet.y, s.x - 10, s.x + 10, s.y - 10, s.y + 10)) {
        bullet.SetActive(false);
        s.lifes--;
        if (s.lifes <= 0) {
            s.SetActive(false);
            new GameObject("DeadShierif", s.x, s.y, 60, 60, "./Resources/DeadShierif.png");
            formol_battle = false;
            questID++;
        }
    }
}
function battleUpdate() {
    if (formol_battle) {
        battle_frame++;
        // shierif movements
        s = FindGameObjectByName("shierif");
        if (battle_frame % 100 == 0) {
            shierif_dir = battle_frame / 1.71;
        }
        if (battle_frame % 100 > 50) {
            if (s.y > 400) {
                shierif_dir = 1.5*Math.PI;
            }
            if (s.y < 300) {
                shierif_dir = 0.5*Math.PI;
            }
            if (s.x < 1400) {
                shierif_dir = 0;
            }
            if (s.x > 1800) {
                shierif_dir = Math.PI;
            }
            s.x += Math.cos(shierif_dir) * shierif_speed;
            s.y += Math.sin(shierif_dir) * shierif_speed * 0.5;
        }
        // shierif shoots
        if (battle_frame > 250 && battle_frame%30 == 0 && getRandomInt(0, 1) == 0) {
            bullet = new GameObject("bullet", s.x, s.y, 10, 10, "./Resources/bullet.png");
            let equX = player.x - s.x;
            let equY = player.y - s.y;
            let dist = Math.sqrt(equX * equX + equY * equY);
            bullet.dirX = (equX) / dist * bullet_speed;
            bullet.dirY = (equY) / dist * bullet_speed;
            bullet.timer = 0;
            bullet.targetmode = 0;
            bullets.push(bullet);
        }
        bullets.forEach(UpdateBullet);
    }
} 
clothildeHeadUFO = false;
function UpdateClothilde() {
    c = FindGameObjectByName("mystic_girl");
    if (formol_battle) {
        c.x = player.x;
        c.y = player.y+35;
    }
    if (clothildeHeadUFO) {
        let equX = (-75) - c.x;
        let equY = (-215) - c.y;
        let dist = Math.sqrt(equX * equX + equY * equY);
        let dirX = (equX) / dist * 5;
        let dirY = (equY) / dist * 5;
        c.x += dirX;
        c.y += dirY;
        if (dist < 10) {
            clothildeHeadUFO = false;
        }
    }
}
let ccx = 0;
let ccy = 0;
function compassUpdate() {
    t = quests[questID].worldTrigger;
    ccx = t.x; //canvas.width
    if (ccx > camera_x + canvas.width * 0.5 - 20) { ccx = camera_x + canvas.width * 0.5 - 20; }
    if (ccx < camera_x - canvas.width * 0.5 + 20) { ccx = camera_x - canvas.width * 0.5 + 20; }
    ccy = t.y; //canvas.height
    if (ccy > camera_y + canvas.height * 0.5 - 20) { ccy = camera_y + canvas.height * 0.5 - 20; }
    if (ccy < camera_y - canvas.height * 0.5 + 20) { ccy = camera_y - canvas.height * 0.5 + 20; }
    compass.x = ccx;
    compass.y = ccy;
}
function Update() {
    playerUpdate();
    questUpdate();
    ufoUpdate();
    battleUpdate();
    UpdateClothilde();
    compassUpdate();
}
function LateUpdate() {
    camera_x += (player.x - camera_x)*camera_smooth_speed;
    camera_y += (player.y - camera_y)*camera_smooth_speed;
}
const DATE = new Date();
const START_TIME = performance.now();
let time = ((performance.now()) - START_TIME) / 1000;
let last_time = time;
let deltaTime = 0;
/////////////////////////////
// MAIN INSTANCE FUNCTIONS //
/////////////////////////////
function drawGameObject(gameObject) {
    if (!gameObject.isActive) {return;}
    let x_screen_pos = +camera_zoom*(gameObject.x-camera_x)+canvas.width*0.5-gameObject.xScale*camera_zoom*0.5;
    let y_screen_pos = -camera_zoom*(gameObject.y-camera_y)+canvas.height*0.5-gameObject.yScale*camera_zoom*0.5;
    let do_draw =    x_screen_pos > -gameObject.xScale * camera_zoom 
                  && x_screen_pos < canvas.width + gameObject.xScale * camera_zoom
                  && y_screen_pos > -gameObject.yScale * camera_zoom 
                  && y_screen_pos < canvas.height + gameObject.yScale * camera_zoom;
    if(do_draw) {
        ctx.fillStyle = gameObject.color;
        ctx.drawImage(
            gameObject.sprite, 
            x_screen_pos, 
            y_screen_pos, 
            gameObject.xScale * camera_zoom, 
            gameObject.yScale * camera_zoom
        );
    }
}
function drawScreen() {
    gameObjects.forEach(drawGameObject);
}
function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvas.width, canvas.height);
}
// INPUT INSTANCE FUNCTIONS
document.body.addEventListener('keydown', keyDown);
document.body.addEventListener('keyup', keyUp);
function keyDown(event) {
    //console.log(event.keyCode);
    if(event.keyCode == 90) { zPressed = true; }
    if(event.keyCode == 83) { sPressed = true; }
    if(event.keyCode == 68) { dPressed = true; }
    if(event.keyCode == 81) { qPressed = true; }
    if(event.keyCode == 38) { upPressed = true; }
    if(event.keyCode == 40) { downPressed = true; }
    if(event.keyCode == 69) { ePressed = true; }
}
function keyUp(event) {
    if(event.keyCode == 90) { zPressed = false; }
    if(event.keyCode == 83) { sPressed = false; }
    if(event.keyCode == 68) { dPressed = false; }
    if(event.keyCode == 81) { qPressed = false; }
    if(event.keyCode == 38) { upPressed = false; }
    if(event.keyCode == 40) { downPressed = false; }
    if(event.keyCode == 69) { ePressed = false; if (quests[questID].startAction == "wait_trigger_key_up") {quests[questID].worldTrigger.isActive = true;} }
}

// application
Start();
GameInstance();
