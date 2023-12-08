var canvas = document.querySelector('canvas') //selects the canvas in the html
const c = canvas.getContext('2d') //canvas context

canvas.width = 1024
canvas.height = 576

playerWalk = 2;
playerRun = 4;

KeysPressed = [];

hash_input = ''

const collisionsMap = []
//puts every 70 element into an array and pushes it into the collisionsMap list
for( let i = 0; i < collisions.length; i+=70){
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZoneMap = []
//puts every 70 element into an array and pushes it into the battlezoneMap list
for( let i = 0; i < battleZoneData.length; i+=70){
    battleZoneMap.push(battleZoneData.slice(i, 70 + i))
}

const offset = {
    //offset of where the map is starting 
    x:-760,
    y:-650
}

const boundaries = []
const battleZones = []

//loops through the row of collisionsMap
collisionsMap.forEach((row,i) => {
    //loops through the column of each row of collisionsMap
    row.forEach((symbol, j) => {
        //if the element is 125 then we make a new boundary with the posistions the 
        if(symbol === 1025){
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

battleZoneMap.forEach((row,i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025){
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

c.fillRect(0,0, canvas.width, canvas.height)

const image = new Image()//creates a new image, of the pellet town
image.src='./images/Pellet Town.png'

const foregroundImg = new Image() //creates a image of the foreground
foregroundImg.src='./images/foregroundObjects.png'

const playerDown = new Image() //creates a new image of the player
playerDown.src='./images/playerDown.png'

const playerUp = new Image() 
playerUp.src='./images/playerUp.png'

const playerLeft = new Image() 
playerLeft.src='./images/playerLeft.png'

const playerRight = new Image() 
playerRight.src='./images/playerRight.png'

const player = new Character({
    position: {
        x:canvas.width / 2 - (192 / 4),
        y:canvas.height/2 - 68 / 2
    },
    image: playerDown,
    frames:{
        max:4, 
        hold: 10
    },
    sprites: {
        up:playerUp,
        down:playerDown,
        left:playerLeft,
        right:playerRight
    },
    collisions: {
        top:{pressed:false},
        bottom:{pressed:false},
        left:{pressed:false},
        right:{pressed:false}
    },
    rectangle:
    {
        width: 48,
        height: 28,
        position: 
        {
            x:canvas.width / 2 - (192 / 4),
            y:canvas.height/2 - 68 / 2 + 40
        }
    }
})
const background = new Sprite({
    position:{
        x:offset.x,
        y:offset.y
    },
    image: image

})
const foreground = new Sprite({
    position:{
        x:offset.x,
        y:offset.y
    },
    image: foregroundImg

})

const keys={
    w:{pressed:false},
    a:{pressed:false},
    s:{pressed:false},
    d:{pressed:false},
    shift:{pressed:false}
}



const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({rectangle1, rectangle2}){
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y&&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height)
}

//is the battle active
const battle = {
    initiated: false
}

/*
document.getElementById('hash_value').addEventListener("keyup", (e) => {    

    if(e.key == 'Enter')
    {
        hash_input = document.getElementById('hash_value').value
        game_analyzeHash(hash_input)
    }
})
*/

// BUTTON INPUTS

upButton = document.getElementById("UpButton")
downButton = document.getElementById("DownButton")
leftButton = document.getElementById("LeftButton")
rightButton = document.getElementById("RightButton")

function ButtonPressed(button) {
    console.log(button + " Button Pressed")        
    KeysPressed.push(button);}
function ButtonPReleased(button) {
    console.log(button + " Button Released")
    index = KeysPressed.indexOf(button);
    if (index > -1) 
    {
        KeysPressed.splice(index, 1); // 2nd parameter means remove one item only
    }
}

//UpButton
upButton.addEventListener("mousedown", function() {
    ButtonPressed('w')
});
upButton.addEventListener("touchstart", function() {
    ButtonPressed('w')
});
upButton.addEventListener("mouseup", function() {
    ButtonPReleased('w')
});
upButton.addEventListener("mouseleave", function() {
    ButtonPReleased('w')
});
upButton.addEventListener("touchend", function() {
    ButtonPReleased('w')
});
upButton.addEventListener("touchcancel", function() {
    ButtonPReleased('w')
});
//Down Button
downButton.addEventListener("mousedown", function() {
    ButtonPressed('s')
});
downButton.addEventListener("touchstart", function() {
    ButtonPressed('s')
});
downButton.addEventListener("mouseup", function() {
    ButtonPReleased('s')
});
downButton.addEventListener("mouseleave", function() {
    ButtonPReleased('s')
});
downButton.addEventListener("touchend", function() {
    ButtonPReleased('s')
});
downButton.addEventListener("touchcancel", function() {
    ButtonPReleased('s')
});

//Left Button
leftButton.addEventListener("mousedown", function() {
    ButtonPressed('a')
});
leftButton.addEventListener("touchstart", function() {
    ButtonPressed('a')
});
leftButton.addEventListener("mouseup", function() {
    ButtonPReleased('a')
});
leftButton.addEventListener("mouseleave", function() {
    ButtonPReleased('a')
});
leftButton.addEventListener("touchend", function() {
    ButtonPReleased('a')
});
leftButton.addEventListener("touchcancel", function() {
    ButtonPReleased('a')
});

//Right Button
rightButton.addEventListener("mousedown", function() {
    ButtonPressed('d')
});
rightButton.addEventListener("touchstart", function() {
    ButtonPressed('d')
});
rightButton.addEventListener("mouseup", function() {
    ButtonPReleased('d')
});
rightButton.addEventListener("mouseleave", function() {
    ButtonPReleased('d')
});
rightButton.addEventListener("touchend", function() {
    ButtonPReleased('d')
});
rightButton.addEventListener("touchcancel", function() {
    ButtonPReleased('d')
});

// END OF BUTTON INPUTS

async function getRandomHash()
{
    await fetch(`https://claratheprogrammer.github.io/Antivirusmon/random`)
    .then(response => response.json())
    .then(json => {
        return json.md5
    }).catch(error =>{})
}

async function game_analyzeHashNoPrompt()
{
    var obj
    const keys = Object.keys(fakeDataBase)
        
    obj = fakeDataBase[keys[Math.floor(Math.random() * keys.length)]]

    battle.initiated = true

    //do battle transition
    gsap.to('#ArrowKeyHolders', {height: 0})
    gsap.to('#battle_transition', {opacity: 1, repeat:2, onComplete(){startBattleNoPrompt(obj)}})        
}

async function game_analyzeHash(hash_input)
{
    if(hash_input === null){
        return
    }

    if(hash_input == 'Cardboardian')
    {
        battle.initiated = true
        gsap.to('#prompt_overlay', {opacity: 0})
        startBattle(null, hash_input)
        return
    }
    
    console.log(hash_input)
    await fetch(`https://claratheprogrammer.github.io/Antivirusmon/search/${hash_input}`)
    .then(response => {
        if(response.ok) {
            return response.json()
        }
        return response.text().then(text => {throw new Error(text)})
    })
    .then(json => {
        battle.initiated = true
        gsap.to('#prompt_overlay', {opacity: 0})
        startBattle(json)     
    }).catch(error =>{
        console.log(error)
        gsap.to('#prompt_overlay', {opacity: 0,
        onComplete(){
            gsap.to('#prompt_response', {opacity: 1,
                onComplete(){
                //display error
                document.getElementById('prompt_response_elaborate').innerHTML = error.message
                gsap.to('#prompt_response', {opacity: 1, duration: 3,
                    onComplete(){
                        gsap.to('#battle_transition', {opacity: 0,
                        onComplete(){
                            gsap.to('#prompt_response', {opacity: 0})
                        }})
                        animate()
                }})
            }})
        }})
    })
}

// changing a bit so not really prompting user :( )
async function promptUser()
{
    gsap.to('#battle_transition', {opacity: 1, repeat:2, 
        onComplete(){ gsap.to('#battle_transition', {opacity: 1})},
        onComplete(){gsap.to('#prompt_overlay', {opacity: 1})}})

    document.getElementById('hash_value').value = 'd3c1b641665589473f07587befb949c4'
    
    
}

async function WorldToBattleTransition()
{
    game_analyzeHashNoPrompt()    
}

function animate(){
    const animationID = window.requestAnimationFrame(animate)
    //console.log(animationID)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleZones.forEach(battleZone =>{
        battleZone.draw()
    })

    player.draw()
    foreground.draw()

    let moving = true
    //player.animate = false

    //if we are currently in a battle then there is no reason to animate the overworld
    if(battle.initiated) 
        return

    if(KeysPressed.includes("w") || KeysPressed.includes("s") || KeysPressed.includes("a") || KeysPressed.includes("d")){
        for(let i = 0; i< battleZones.length; i++){
            const battleZone = battleZones[i]
            const overlappingArea = 
            (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) 
            - Math.max(player.position.x, battleZone.position.x)) 
            * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height)
            - Math.max(player.position.y, battleZone.position.y))

            if(rectangularCollision({
                rectangle1 : player,
                rectangle2: battleZone
                 
            })&& overlappingArea > ((player.width * player.height) /2) && Math.random()<.05) {
                console.log('battling')
                
                let hash;
                
                let valid = false
                window.cancelAnimationFrame(animationID)
                KeysPressed = []
                
                //promptUser();
                WorldToBattleTransition()
    
                break
            }
        }
    }

    if(KeysPressed.length > 0)
    {
        lastKeyPressed = KeysPressed[KeysPressed.length - 1]
        player.collisions.top = false
        player.collisions.bottom = false
        player.collisions.left = false
        player.collisions.right = false

        if(lastKeyPressed ==='w'){
            player.animate = true
            player.image = player.sprites.up
            for(let i = 0; i< boundaries.length; i++){
                const boundary = boundaries[i]

                player.collisions.top = false
                if(rectangularCollision({
                    rectangle1 : player.rectangle,
                    rectangle2: {...boundary, position:{
                        x: boundary.position.x,
                        y:  boundary.position.y+2
                    }}
                })){
                    console.log('colliding')
                    player.collisions.top = true
                    break
                }
            }

            if(!player.collisions.top){
                movables.forEach((movable) =>{
                    if(keys.shift.pressed)
                        movable.position.y += playerRun;
                    else
                        movable.position.y += playerWalk;
                })
            }
        }else if(lastKeyPressed ==='a'){
            player.animate = true
            player.image = player.sprites.left
            for(let i = 0; i< boundaries.length; i++){
                const boundary = boundaries[i]

                player.collisions.left = false
                if(rectangularCollision({
                    rectangle1 : player.rectangle,
                    rectangle2: {...boundary, position:{
                        x: boundary.position.x+2,
                        y:  boundary.position.y
                    }}
                })){
                    console.log('colliding')
                    player.collisions.left = true
                    break
                }
            }
            if(!player.collisions.left){
                movables.forEach((movable) =>{
                    if(keys.shift.pressed)
                        movable.position.x += playerRun;
                    else
                        movable.position.x += playerWalk;
                })
            }
        }else if(lastKeyPressed ==='s'){
            player.animate = true
            player.image = player.sprites.down
            for(let i = 0; i< boundaries.length; i++){
                const boundary = boundaries[i]

                player.collisions.bottom = false
                if(rectangularCollision({
                    rectangle1 : player.rectangle,
                    rectangle2: {...boundary, position:{
                        x: boundary.position.x,
                        y:  boundary.position.y-2
                    }}
                })){
                    console.log('colliding')
                    player.collisions.bottom = true
                    break
                }
            }
            if(!player.collisions.bottom){
                movables.forEach((movable) =>{
                    if(keys.shift.pressed)
                        movable.position.y -=playerRun
                    else
                        movable.position.y -=playerWalk
                })
            }
        }else if(lastKeyPressed ==='d'){
            player.animate = true
            player.image = player.sprites.right
            for(let i = 0; i< boundaries.length; i++){
                const boundary = boundaries[i]

                player.collisions.right = false
                if(rectangularCollision({
                    rectangle1 : player.rectangle,
                    rectangle2: {...boundary, position:{
                        x: boundary.position.x-2,
                        y:  boundary.position.y
                    }}
                })){
                    console.log('colliding')
                    player.collisions.right = true
                    break
                }
            }
            if(!player.collisions.right){
                movables.forEach((movable) =>{
                    if(keys.shift.pressed)
                        movable.position.x -= playerRun
                    else
                        movable.position.x -=playerWalk
                })
            }
        }
    }
}

animate()
//listens to the keyboard
window.addEventListener('keydown', (e) =>{
    switch(e.key){
        case 'w':
            index = KeysPressed.indexOf('w');
            if (index === -1) 
            {
                KeysPressed.push('w');
            }
            keys.w.pressed = true
            break

        case 'a':
            index = KeysPressed.indexOf('a');
            if (index === -1) 
            {
                KeysPressed.push('a');
            }
            keys.a.pressed = true
            break

        case 's':
            index = KeysPressed.indexOf('s');
            if (index === -1) 
            {
                KeysPressed.push('s');
            }
            keys.s.pressed = true
            break

        case 'd':
            index = KeysPressed.indexOf('d');
            if (index === -1) 
            {
                KeysPressed.push('d');
            }
            keys.d.pressed = true
            break

        case 'e':
            keys.shift.pressed = true
            break

    }
 
})
window.addEventListener('keyup', (e) =>{
    switch(e.key){
        case 'w':
            //removes key
            index = KeysPressed.indexOf('w');
            if (index > -1) 
            {
                KeysPressed.splice(index, 1); // 2nd parameter means remove one item only
            }
            keys.w.pressed = false
            break

        case 'a':
            //removes key
            index = KeysPressed.indexOf('a');
            if (index > -1) 
            {
                KeysPressed.splice(index, 1); // 2nd parameter means remove one item only
            }
            keys.a.pressed = false
            break

        case 's':
            //removes key
            index = KeysPressed.indexOf('s');
            if (index > -1) 
            {
                KeysPressed.splice(index, 1); // 2nd parameter means remove one item only
            }
            keys.s.pressed = false
            break

        case 'd':
            //removes key
            index = KeysPressed.indexOf('d');
            if (index > -1) 
            {
                KeysPressed.splice(index, 1); // 2nd parameter means remove one item only
            }
            keys.d.pressed = false
            break

        case 'e':
            keys.shift.pressed = false
            break
        default:
            KeysPressed = []

    }
})



fakeDataBase = {
    "3054eacbfe7f1e061b0c23ea2de38507": {
      "last_analysis_results": {
        "Bkav": {
          "category": "undetected",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220404"
        },
        "Lionic": {
          "category": "undetected",
          "engine_name": "Lionic",
          "engine_version": "7.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "tehtris": {
          "category": "undetected",
          "engine_name": "tehtris",
          "engine_version": "v0.0.7",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Gen:Trojan.AV-Killer.dmHfamvEETe",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": "Generic.mg.3054eacbfe7f1e06",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "PWS-LegMir.d",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Malwarebytes": {
          "category": "malicious",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.2.27",
          "result": "Malware.AI.196010710",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": "Trojan.Win32.PSW.Hukle",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "K7AntiVirus": {
          "category": "malicious",
          "engine_name": "K7AntiVirus",
          "engine_version": "12.5.41750",
          "result": "Password-Stealer ( 0055e3dc1 )",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "TrojanPSW:Win32/Hukle.007d4544",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "malicious",
          "engine_name": "K7GW",
          "engine_version": "12.5.41749",
          "result": "Password-Stealer ( 0055e3dc1 )",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Cybereason": {
          "category": "malicious",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": "malicious.bfe7f1",
          "method": "blacklist",
          "engine_update": "20210330"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "VirIT": {
          "category": "undetected",
          "engine_name": "VirIT",
          "engine_version": "9.5.172",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220408"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.5.1.2",
          "result": "W32/Hukle.JFRU-8346",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.17.0.0",
          "result": "ML.Attribute.HighConfidence",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Elastic": {
          "category": "malicious",
          "engine_name": "Elastic",
          "engine_version": "4.0.35",
          "result": "malicious (moderate confidence)",
          "method": "blacklist",
          "engine_update": "20220302"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "25080",
          "result": "Win32/PSW.Hukle.10.F",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "APEX": {
          "category": "malicious",
          "engine_name": "APEX",
          "engine_version": "6.279",
          "result": "Malicious",
          "method": "blacklist",
          "engine_update": "20220407"
        },
        "Paloalto": {
          "category": "malicious",
          "engine_name": "Paloalto",
          "engine_version": "0.9.0.1003",
          "result": "generic.ml",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "ClamAV": {
          "category": "malicious",
          "engine_name": "ClamAV",
          "engine_version": "0.104.2.0",
          "result": "Win.Spyware.11901-2",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "21.0.1.45",
          "result": "Trojan-PSW.Win32.Hukle.10.f",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Gen:Trojan.AV-Killer.dmHfamvEETe",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25576",
          "result": "Trojan.Win32.Hukle.drhsvn",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220402"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Lmir-LI [Trj]",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Win32.Trojan-qqpass.Qqrob.Lgtg",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.21.193",
          "result": "Gen:Trojan.AV-Killer.dmHfamvEETe",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "TACHYON": {
          "category": "malicious",
          "engine_name": "TACHYON",
          "engine_version": "2022-04-09.02",
          "result": "Trojan-PWS/W32.Hukle.99004",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2021.5.0.7597",
          "result": "Gen:Trojan.AV-Killer.dmHfamvEETe (B)",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "34515",
          "result": "TrojWare.Win32.PSW.Hukle.F@49vj",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "F-Secure": {
          "category": "malicious",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": "Trojan.TR/ATRAPS.Gen",
          "method": "blacklist",
          "engine_update": "20220408"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.54.3080",
          "result": "Trojan.PWS.Hukle.10",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4607",
          "result": "Trojan.Hukle.Win32.123",
          "method": "blacklist",
          "engine_update": "20220408"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "Mal_Legmir2",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "McAfee-GW-Edition": {
          "category": "malicious",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": "BehavesLike.Win32.Dropper.qc",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Trapmine": {
          "category": "undetected",
          "engine_name": "Trapmine",
          "engine_version": "3.5.45.75",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220217"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211026"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "1.4.1.0",
          "result": "Mal/Generic-R + Mal/GamePSW-C",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "6.0.20.0",
          "result": "Trojan-PSW.Legendmir",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.32756B:27.26963",
          "result": "Gen:Trojan.AV-Killer.dmHfamvEETe",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "Trojan/PSW.MirDips",
          "method": "blacklist",
          "engine_update": "20220408"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "W32.Trojan.Trojan-PWS-Hukle",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.14",
          "result": "TR/ATRAPS.Gen",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/Generic.ASMalwS.35A48",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Kingsoft": {
          "category": "undetected",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Gridinsoft": {
          "category": "malicious",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.75.174",
          "result": "Ransom.Win32.Gen.oa!s2",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Arcabit": {
          "category": "undetected",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.889",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "ViRobot": {
          "category": "malicious",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": "Trojan.Win32.PSWHukle.93696[UPX]",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "ZoneAlarm": {
          "category": "malicious",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": "Trojan-GameThief.Win32.Lmir.gen",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "220409-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.19100.5",
          "result": "PWS:Win32/Hukle.10.F",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.27",
          "result": "Malicious (score: 99)",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220103"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.21.3.10230",
          "result": "Trojan/Win32.Hukle.R67331",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Acronis": {
          "category": "undetected",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.82",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210512"
        },
        "BitDefenderTheta": {
          "category": "malicious",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": "Gen:NN.ZexaF.34588.dmHfamvEETe",
          "method": "blacklist",
          "engine_update": "20220404"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": "Gen:Trojan.AV-Killer.dmHfamvEETe",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "5.0.0",
          "result": "suspected of Trojan-PSW.Lmir.36",
          "method": "blacklist",
          "engine_update": "20220408"
        },
        "Cylance": {
          "category": "failure",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "2.2.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220408"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "Mal_Legmir2",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.27",
          "result": "Stealer.Frethog!1.6859 (CLOUD)",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Yandex": {
          "category": "undetected",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "SentinelOne": {
          "category": "malicious",
          "engine_name": "SentinelOne",
          "engine_version": "22.2.1.2",
          "result": "Static AI - Malicious PE",
          "method": "blacklist",
          "engine_update": "20220330"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Trojan.Malware.300983.susgen",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "W32/Hukle.F!tr",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Lmir-LI [Trj]",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Trj/Hukle.E",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_100% (W)",
          "method": "blacklist",
          "engine_update": "20210907"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 4,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 1,
        "malicious": 55,
        "undetected": 14
      },
      "md5": "3054eacbfe7f1e061b0c23ea2de38507",
      "names": [
        "obqlw6zad.dll",
        "8pz7mas4q.dll",
        "h8jlx8zkh.dll",
        "8dvyjopno.dll",
        "2aoupvlxw.dll",
        "8z9erqhhx.dll",
        "sw0jxictb.dll",
        "0cpl50xps.dll",
        "2d8kxridc.dll",
        "idlfn1vn6.dll",
        "343tz03yi.dll",
        "9mwytrjl7.dll",
        "3ggjqpxyg.dll",
        "odjd3ljqa.dll",
        "nl3erdl6w.dll",
        "Trojan-PSW.Win32.Hukle.10.f",
        "ma6pdkuhn.dll",
        "VirusShare_3054eacbfe7f1e061b0c23ea2de38507",
        "45dd3e35e2f65d5c654aa169d750861108ddebe3_trojan-psw.win32.hukle.10.f",
        "3054eacbfe7f1e061b0c23ea2de38507",
        "3054eacbfe7f1e061b0c23ea2de3850745dd3e35e2f65d5c654aa169d750861108ddebe353948.exe",
        "Trojan-PSW.Win32.Hukle.10.f.exe",
        "test.txt",
        "3054EACBFE7F1E061B0C23EA2DE38507",
        "aa",
        "T1iCA0.com",
        "bwGvO_edQ.reg"
      ],
      "reputation": 0,
      "sha1": "45dd3e35e2f65d5c654aa169d750861108ddebe3",
      "sha256": "b1b33a1aa88b3fd873a277e4e6df88bb797b578aef33741ef1e13ca40bd4520c",
      "size": 53948,
      "type_description": "Win32 EXE",
      "type_extension": "exe",
      "type_tag": "peexe"
    },
    "5cbef8e4ade60ef54b57132762974125": {
      "last_analysis_results": {
        "Bkav": {
          "category": "undetected",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210208"
        },
        "Lionic": {
          "category": "timeout",
          "engine_name": "AegisLab",
          "engine_version": "4.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Elastic": {
          "category": "type-unsupported",
          "engine_name": "Elastic",
          "engine_version": "4.0.16",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210121"
        },
        "DrWeb": {
          "category": "undetected",
          "engine_name": "DrWeb",
          "engine_version": "7.0.49.9080",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "MicroWorld-eScan": {
          "category": "undetected",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "FireEye": {
          "category": "undetected",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210209"
        },
        "ALYac": {
          "category": "undetected",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Cylance": {
          "category": "undetected",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "VIPRE": {
          "category": "undetected",
          "engine_name": "VIPRE",
          "engine_version": "90318",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Paloalto": {
          "category": "type-unsupported",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Sangfor": {
          "category": "undetected",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210204"
        },
        "K7AntiVirus": {
          "category": "undetected",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.165.36414",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Alibaba": {
          "category": "type-unsupported",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "undetected",
          "engine_name": "K7GW",
          "engine_version": "11.165.36420",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Arcabit": {
          "category": "undetected",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.881",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "BitDefenderTheta": {
          "category": "undetected",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210201"
        },
        "Cyren": {
          "category": "undetected",
          "engine_name": "Cyren",
          "engine_version": "6.3.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210126"
        },
        "Symantec": {
          "category": "undetected",
          "engine_name": "Symantec",
          "engine_version": "1.13.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "ESET-NOD32": {
          "category": "undetected",
          "engine_name": "ESET-NOD32",
          "engine_version": "22791",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "APEX": {
          "category": "type-unsupported",
          "engine_name": "APEX",
          "engine_version": "6.130",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "TrendMicro-HouseCall": {
          "category": "undetected",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "TotalDefense": {
          "category": "timeout",
          "engine_name": "TotalDefense",
          "engine_version": "37.1.62.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Avast": {
          "category": "undetected",
          "engine_name": "Avast",
          "engine_version": "21.1.5827.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "ClamAV": {
          "category": "undetected",
          "engine_name": "ClamAV",
          "engine_version": "0.103.1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Kaspersky": {
          "category": "undetected",
          "engine_name": "Kaspersky",
          "engine_version": "15.0.1.13",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "BitDefender": {
          "category": "undetected",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "NANO-Antivirus": {
          "category": "undetected",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25261",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210205"
        },
        "Rising": {
          "category": "timeout",
          "engine_name": "Rising",
          "engine_version": "25.0.0.26",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Ad-Aware": {
          "category": "undetected",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.16.117",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "TACHYON": {
          "category": "undetected",
          "engine_name": "TACHYON",
          "engine_version": "2021-02-10.02",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Sophos": {
          "category": "undetected",
          "engine_name": "Sophos",
          "engine_version": "1.0.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Comodo": {
          "category": "undetected",
          "engine_name": "Comodo",
          "engine_version": "33249",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "F-Secure": {
          "category": "undetected",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "Zillya": {
          "category": "undetected",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4289",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210209"
        },
        "TrendMicro": {
          "category": "undetected",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "McAfee-GW-Edition": {
          "category": "undetected",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Trapmine": {
          "category": "type-unsupported",
          "engine_name": "Trapmine",
          "engine_version": "3.5.0.1023",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200727"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210208"
        },
        "Emsisoft": {
          "category": "undetected",
          "engine_name": "Emsisoft",
          "engine_version": "2018.12.0.1641",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Ikarus": {
          "category": "undetected",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "210210-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Jiangmin": {
          "category": "undetected",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Webroot": {
          "category": "type-unsupported",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Avira": {
          "category": "undetected",
          "engine_name": "Avira",
          "engine_version": "8.3.3.10",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "eGambit": {
          "category": "type-unsupported",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Antiy-AVL": {
          "category": "undetected",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Kingsoft": {
          "category": "undetected",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Gridinsoft": {
          "category": "malicious",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.28.119",
          "result": "PDF.Exploit.JS",
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Microsoft": {
          "category": "undetected",
          "engine_name": "Microsoft",
          "engine_version": "1.1.17800.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "ViRobot": {
          "category": "undetected",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "ZoneAlarm": {
          "category": "undetected",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "GData": {
          "category": "undetected",
          "engine_name": "GData",
          "engine_version": "A:25.28596B:27.21915",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Cynet": {
          "category": "undetected",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.25",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200916"
        },
        "AhnLab-V3": {
          "category": "undetected",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.19.4.10106",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Acronis": {
          "category": "undetected",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.80",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201023"
        },
        "McAfee": {
          "category": "undetected",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "MAX": {
          "category": "undetected",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "VBA32": {
          "category": "undetected",
          "engine_name": "VBA32",
          "engine_version": "4.4.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.1.18",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "0.0.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210209"
        },
        "Tencent": {
          "category": "undetected",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Yandex": {
          "category": "undetected",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210205"
        },
        "SentinelOne": {
          "category": "undetected",
          "engine_name": "SentinelOne",
          "engine_version": "5.0.0.9",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210131"
        },
        "MaxSecure": {
          "category": "undetected",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Fortinet": {
          "category": "undetected",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "Cybereason": {
          "category": "type-unsupported",
          "engine_name": "Cybereason",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20180308"
        },
        "Panda": {
          "category": "undetected",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        },
        "CrowdStrike": {
          "category": "type-unsupported",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20180202"
        },
        "Qihoo-360": {
          "category": "undetected",
          "engine_name": "Qihoo-360",
          "engine_version": "1.0.0.1120",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210210"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 13,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 3,
        "failure": 0,
        "malicious": 1,
        "undetected": 58
      },
      "md5": "5cbef8e4ade60ef54b57132762974125",
      "names": [
        "395ysnofo.dll",
        "0zfnzw9ms.dll",
        "lx6vyn2be.dll",
        "gqg0ew3ap.dll",
        "i0o2i8w8d.dll",
        "6kfxbjqp4.dll",
        "tzsekwb6l.dll",
        "06ufb31h6.dll",
        "vumoc4hez.dll",
        "vsb6bi74g.dll",
        "j4mi0tjyw.dll",
        "t8zzs7utg.dll",
        "ksqtbm7rs.dll",
        "azoj70ka4.dll",
        "exu8ob3y4.dll",
        "VirusShare_5cbef8e4ade60ef54b57132762974125",
        "33",
        "5cbef8e4ade60ef54b57132762974125",
        "test.txt",
        "5cbef8e4ade60ef54b57132762974125.pdf",
        "aa",
        "RGhUB628.wbs",
        "hirF.docx",
        "IGJ7K1f.xlsm",
        "O9ZU3H.exe"
      ],
      "reputation": 0,
      "sha1": "814229a12f5a84030dce9361edbd04b37a576a65",
      "sha256": "20fe1c99cc3fafe5d46979616e2ee8fc704e70e88aeba6afd3fd156919c095e0",
      "size": 147897,
      "type_description": "PDF",
      "type_extension": "pdf",
      "type_tag": "pdf"
    },
    "ffb456a28adf28a05af5746f996a96dc": {
      "last_analysis_results": {
        "Bkav": {
          "category": "malicious",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": "W32.AIDetectVM.malware5",
          "method": "blacklist",
          "engine_update": "20201013"
        },
        "Lionic": {
          "category": "malicious",
          "engine_name": "AegisLab",
          "engine_version": "4.2",
          "result": "Trojan.Win32.Fosniw.l5dT",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Elastic": {
          "category": "malicious",
          "engine_name": "Elastic",
          "engine_version": "4.0.11",
          "result": "malicious (high confidence)",
          "method": "blacklist",
          "engine_update": "20201012"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Dropped:Generic.PWStealer.6E9EF518",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.36.1.0",
          "result": "Generic.mg.ffb456a28adf28a0",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "Artemis!FFB456A28ADF",
          "method": "blacklist",
          "engine_update": "20201012"
        },
        "Cylance": {
          "category": "malicious",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": "Unsafe",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4198",
          "result": "Trojan.Agent.Win32.35460",
          "method": "blacklist",
          "engine_update": "20201013"
        },
        "Paloalto": {
          "category": "malicious",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": "generic.ml",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Sangfor": {
          "category": "undetected",
          "engine_name": "Sangfor",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200814"
        },
        "K7AntiVirus": {
          "category": "malicious",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.145.35454",
          "result": "Trojan ( 00544ddf1 )",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "TrojanDropper:Win32/Generic.72729797",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "malicious",
          "engine_name": "K7GW",
          "engine_version": "11.145.35455",
          "result": "Trojan ( 00544ddf1 )",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Cybereason": {
          "category": "malicious",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": "malicious.28adf2",
          "method": "blacklist",
          "engine_update": "20190616"
        },
        "Invincea": {
          "category": "malicious",
          "engine_name": "Invincea",
          "engine_version": "1.0.1.0",
          "result": "Mal/Packer",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.3.0.2",
          "result": "W32/PWS.MFKQ-8039",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200813"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.12.0.0",
          "result": "Trojan.Gen.2",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "TotalDefense": {
          "category": "undetected",
          "engine_name": "TotalDefense",
          "engine_version": "37.1.62.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "APEX": {
          "category": "malicious",
          "engine_name": "APEX",
          "engine_version": "6.81",
          "result": "Malicious",
          "method": "blacklist",
          "engine_update": "20201013"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "18.4.3895.0",
          "result": "Win32:Dh-A [Heur]",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "ClamAV": {
          "category": "undetected",
          "engine_name": "ClamAV",
          "engine_version": "0.102.3.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201013"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "15.0.1.13",
          "result": "Trojan-Dropper.Win32.Agent.pn",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Dropped:Generic.PWStealer.6E9EF518",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.134.25169",
          "result": "Trojan.Win32.Agent.cwlfjh",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201009"
        },
        "Tencent": {
          "category": "undetected",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.16.117",
          "result": "Dropped:Generic.PWStealer.6E9EF518",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "4.98.0",
          "result": "Mal/Packer",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "32895",
          "result": "Packed.Win32.MFSG.Gen@2hdrii",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "F-Secure": {
          "category": "malicious",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": "Backdoor.BDS/Backdoor.Gen",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.49.9080",
          "result": "Trojan.PWS.Legmir.366",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "VIPRE": {
          "category": "malicious",
          "engine_name": "VIPRE",
          "engine_version": "87428",
          "result": "BehavesLike.Win32.Malware.ssc (mx-v)",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "TROJ_SPNR.30FC13",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "McAfee-GW-Edition": {
          "category": "malicious",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": "BehavesLike.Win32.Generic.kc",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Trapmine": {
          "category": "type-unsupported",
          "engine_name": "Trapmine",
          "engine_version": "3.5.0.1023",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200727"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.7.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201013"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2018.12.0.1641",
          "result": "Dropped:Generic.PWStealer.6E9EF518 (B)",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "SentinelOne": {
          "category": "malicious",
          "engine_name": "SentinelOne",
          "engine_version": "4.5.0.1",
          "result": "DFI - Malicious PE",
          "method": "blacklist",
          "engine_update": "20201008"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.27351B:27.20512",
          "result": "Dropped:Generic.PWStealer.6E9EF518",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "TrojanDropper.Small.be",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "W32.Downloader.Gen",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.8",
          "result": "BDS/Backdoor.Gen",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=99)",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan[Dropper]/Win32.Agent",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Kingsoft": {
          "category": "malicious",
          "engine_name": "Kingsoft",
          "engine_version": "2013.8.14.323",
          "result": "Win32.Troj.OnlineGameT.by.10166",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Arcabit": {
          "category": "malicious",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.881",
          "result": "Generic.PWStealer.6E9EF518",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "ViRobot": {
          "category": "undetected",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "ZoneAlarm": {
          "category": "malicious",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": "Trojan-Dropper.Win32.Agent.pn",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "201014-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.17500.4",
          "result": "TrojanDropper:Win32/Agent",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.24",
          "result": "Malicious (score: 100)",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.18.2.10046",
          "result": "Trojan/Win32.Lmirhack.C900",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Acronis": {
          "category": "malicious",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.78",
          "result": "suspicious",
          "method": "blacklist",
          "engine_update": "20200917"
        },
        "BitDefenderTheta": {
          "category": "malicious",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": "AI:Packer.D12EF16422",
          "method": "blacklist",
          "engine_update": "20201013"
        },
        "ALYac": {
          "category": "failure",
          "engine_name": "ALYac",
          "engine_version": "1.1.1.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "TACHYON": {
          "category": "undetected",
          "engine_name": "TACHYON",
          "engine_version": "2020-10-14.01",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "4.4.1",
          "result": "TrojanDropper.Agent",
          "method": "blacklist",
          "engine_update": "20201013"
        },
        "Malwarebytes": {
          "category": "malicious",
          "engine_name": "Malwarebytes",
          "engine_version": "3.6.4.335",
          "result": "RiskWare.Tool.CK",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "0.0.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20201013"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "22149",
          "result": "Win32/PSW.Agent.NAB",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "TROJ_SPNR.30FC13",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.26",
          "result": "Trojan.PSW.Win32.GameOL.nvb (CLASSIC)",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Yandex": {
          "category": "malicious",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": "Trojan.PWS.Agent!zppyPeKMXvI",
          "method": "blacklist",
          "engine_update": "20201008"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Trojan-GameThief.Win32.Nilage",
          "method": "blacklist",
          "engine_update": "20201013"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Trojan.Buzus.enfq",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "W32/Agent.NAB!tr",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "18.4.3895.0",
          "result": "FileRepMalware",
          "method": "blacklist",
          "engine_update": "20201014"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Adware/StatBlaster",
          "method": "blacklist",
          "engine_update": "20201013"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_100% (D)",
          "method": "blacklist",
          "engine_update": "20190702"
        },
        "Qihoo-360": {
          "category": "malicious",
          "engine_name": "Qihoo-360",
          "engine_version": "1.0.0.1120",
          "result": "Malware.Radar01.Gen",
          "method": "blacklist",
          "engine_update": "20201014"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 4,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 1,
        "malicious": 58,
        "undetected": 11
      },
      "md5": "ffb456a28adf28a05af5746f996a96dc",
      "names": [
        "x7xspojdv.dll",
        "54tyi9xei.dll",
        "lqvfq2xq0.dll",
        "jshxra7ax.dll",
        "q80u2zdo3.dll",
        "oaelvipsl.dll",
        "htb6tllg0.dll",
        "wjl5rnpab.dll",
        "fdx77ebe1.dll",
        "jlih4z23s.dll",
        "drdyj15x7.dll",
        "hso89hc31.dll",
        "qbvewv03f.dll",
        "qco7zbbd2.dll",
        "v2pghpzst.dll",
        "g6q0bzj4o.dll",
        "VirusShare_ffb456a28adf28a05af5746f996a96dc",
        "ffb456a28adf28a05af5746f996a96dc",
        "test.txt",
        "ffb456a28adf28a05af5746f996a96dc.exe",
        "FFB456A28ADF28A05AF5746F996A96DC",
        "aa",
        "rtHZ.ini",
        "if1CIX.sys",
        "a",
        "SN5T0M.exe"
      ],
      "reputation": 0,
      "sha1": "be4e96624086d4aa4154366acf6a1c290fce7fa2",
      "sha256": "6fb03daf6b0f7efde353010f7255c3e84d6140e3a03c904ac0dab9a12a254417",
      "size": 68425,
      "type_description": "Win32 EXE",
      "type_extension": "exe",
      "type_tag": "peexe"
    },
    "86b6c59aa48a69e16d3313d982791398": {
      "last_analysis_results": {
        "Bkav": {
          "category": "malicious",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": "W32.AIDetect.malware1",
          "method": "blacklist",
          "engine_update": "20210515"
        },
        "Lionic": {
          "category": "malicious",
          "engine_name": "AegisLab",
          "engine_version": "4.2",
          "result": "Trojan.Win32.Wootbot.m!c",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Elastic": {
          "category": "malicious",
          "engine_name": "Elastic",
          "engine_version": "4.0.21",
          "result": "malicious (high confidence)",
          "method": "blacklist",
          "engine_update": "20210420"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Generic.Malware.FPW!wre!XiBVPk!g.84FF08EF",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": "Generic.mg.86b6c59aa48a69e1",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "W32/Sdbot.al.gen",
          "method": "blacklist",
          "engine_update": "20210504"
        },
        "Cylance": {
          "category": "malicious",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": "Unsafe",
          "method": "blacklist",
          "engine_update": "20210517"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4364",
          "result": "Backdoor.Wootbot.Win32.188",
          "method": "blacklist",
          "engine_update": "20210514"
        },
        "Paloalto": {
          "category": "malicious",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": "generic.ml",
          "method": "blacklist",
          "engine_update": "20210517"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": "Trojan.Win32.Save.a",
          "method": "blacklist",
          "engine_update": "20210416"
        },
        "K7AntiVirus": {
          "category": "malicious",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.182.37192",
          "result": "Trojan ( 003c84cb1 )",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "Backdoor:Win32/Wootbot.a58e5e6b",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "malicious",
          "engine_name": "K7GW",
          "engine_version": "11.182.37192",
          "result": "Trojan ( 003c84cb1 )",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_90% (W)",
          "method": "blacklist",
          "engine_update": "20210203"
        },
        "Arcabit": {
          "category": "malicious",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.886",
          "result": "Generic.Malware.FPW!wre!XiBVPk!g.84FF08EF",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "BitDefenderTheta": {
          "category": "malicious",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": "AI:Packer.F3C3F13B1E",
          "method": "blacklist",
          "engine_update": "20210513"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.3.0.2",
          "result": "W32/Sdbot.KQMA-1925",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210126"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.14.0.0",
          "result": "W32.Spybot.Worm",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "23306",
          "result": "Win32/Wootbot",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Baidu": {
          "category": "malicious",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": "Win32.Worm.Rbot.a",
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "WORM_WOOTBOT.GEN",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "21.1.5827.0",
          "result": "Win32:SdBot-FEI [Trj]",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "ClamAV": {
          "category": "malicious",
          "engine_name": "ClamAV",
          "engine_version": "0.103.2.0",
          "result": "Win.Trojan.Wootbot-15",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "21.0.1.45",
          "result": "Backdoor.Win32.Wootbot.gen",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Generic.Malware.FPW!wre!XiBVPk!g.84FF08EF",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25311",
          "result": "Trojan.Win32.Wootbot.ejqe",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210515"
        },
        "APEX": {
          "category": "malicious",
          "engine_name": "APEX",
          "engine_version": "6.163",
          "result": "Malicious",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Win32.Backdoor.Wootbot.Ecao",
          "method": "blacklist",
          "engine_update": "20210517"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.21.179",
          "result": "Generic.Malware.FPW!wre!XiBVPk!g.84FF08EF",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210517"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2018.12.0.1641",
          "result": "Generic.Malware.FPW!wre!XiBVPk!g.84FF08EF (B)",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "33535",
          "result": "Backdoor.Win32.Wootbot@432f",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "F-Secure": {
          "category": "undetected",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210331"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.49.9080",
          "result": "Win32.IRC.Bot.based",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "VIPRE": {
          "category": "malicious",
          "engine_name": "VIPRE",
          "engine_version": "92604",
          "result": "Trojan.Win32.Packer.Mew11SEv1.2 (ep)",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "WORM_WOOTBOT.GEN",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "McAfee-GW-Edition": {
          "category": "malicious",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": "BehavesLike.Win32.Generic.dc",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Trapmine": {
          "category": "type-unsupported",
          "engine_name": "Trapmine",
          "engine_version": "3.5.0.1023",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200727"
        },
        "CMC": {
          "category": "malicious",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": "Generic.Win32.86b6c59aa4!MD",
          "method": "blacklist",
          "engine_update": "20210506"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "1.0.2.0",
          "result": "ML/PE-A + W32/Forbot-EH",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Trojan.Win32.Pakes",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "210516-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "Backdoor/SdBot.dlu",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "Worm:Win32/Wootbot",
          "method": "blacklist",
          "engine_update": "20210517"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.12",
          "result": "WORM/AgoBot.262002",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20210517"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/Generic.ASMalwS.95D74A",
          "method": "blacklist",
          "engine_update": "20210514"
        },
        "Kingsoft": {
          "category": "malicious",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": "Win32.Heur.KVMH008.a.(kcloud)",
          "method": "blacklist",
          "engine_update": "20210517"
        },
        "Gridinsoft": {
          "category": "malicious",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.40.132",
          "result": "Malware.Win32.Pack.28865!se",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.18100.6",
          "result": "Worm:Win32/Wootbot",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "ViRobot": {
          "category": "malicious",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": "Backdoor.Win32.A.Wootbot.262002[MEW]",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "ZoneAlarm": {
          "category": "undetected",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.29671B:27.23030",
          "result": "Generic.Malware.FPW!wre!XiBVPk!g.84FF08EF",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.27",
          "result": "Malicious (score: 100)",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200916"
        },
        "AhnLab-V3": {
          "category": "undetected",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.20.0.10177",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Acronis": {
          "category": "malicious",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.82",
          "result": "suspicious",
          "method": "blacklist",
          "engine_update": "20210512"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": "Generic.Malware.FPW!wre!XiBVPk!g.84FF08EF",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "TACHYON": {
          "category": "malicious",
          "engine_name": "TACHYON",
          "engine_version": "2021-05-16.02",
          "result": "Backdoor/W32.WootBot.262002",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "5.0.0",
          "result": "Backdoor.Win32.Wootbot.h",
          "method": "blacklist",
          "engine_update": "20210515"
        },
        "Malwarebytes": {
          "category": "malicious",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.2.27",
          "result": "HackTool.Patcher",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "0.0.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.26",
          "result": "Backdoor.Wootbot.atz (CLOUD)",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Yandex": {
          "category": "malicious",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": "Packed/MEW",
          "method": "blacklist",
          "engine_update": "20210514"
        },
        "SentinelOne": {
          "category": "malicious",
          "engine_name": "SentinelOne",
          "engine_version": "5.0.0.20",
          "result": "Static AI - Malicious PE",
          "method": "blacklist",
          "engine_update": "20210215"
        },
        "eGambit": {
          "category": "undetected",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20210517"
        },
        "Fortinet": {
          "category": "undetected",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Trojan.Malware.157764.susgen",
          "method": "blacklist",
          "engine_update": "20210514"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "21.1.5827.0",
          "result": "Win32:SdBot-FEI [Trj]",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Cybereason": {
          "category": "malicious",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": "malicious.aa48a6",
          "method": "blacklist",
          "engine_update": "20210330"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Trj/Genetic.gen",
          "method": "blacklist",
          "engine_update": "20210516"
        },
        "Qihoo-360": {
          "category": "undetected",
          "engine_name": "Qihoo-360",
          "engine_version": "1.0.0.1120",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210517"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 5,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 0,
        "malicious": 61,
        "undetected": 9
      },
      "md5": "86b6c59aa48a69e16d3313d982791398",
      "names": [
        "w9gy1ussz.dll",
        "knftnb5g7.dll",
        "mxbrtjyda.dll",
        "mpruytwh3.dll",
        "gny2zpgre.dll",
        "japqlrspu.dll",
        "rpflv1b6f.dll",
        "pci46fdjb.dll",
        "m1pxlv757.dll",
        "19wgfeyqa.dll",
        "dttl9d5si.dll",
        "1nj8jffbq.dll",
        "1vrjrxelh.dll",
        "zx00on9tg.dll",
        "szv4gwvfo.dll",
        "7b1hrcgj5.dll",
        "xjwjobyao.dll",
        "VirusShare_86b6c59aa48a69e16d3313d982791398",
        "86b6c59aa48a69e16d3313d982791398",
        "test.txt",
        "86b6c59aa48a69e16d3313d982791398.exe",
        "malware.exe",
        "aa",
        "5ZIy_Lb.scr",
        "bp_vvtmeqi.bz2"
      ],
      "reputation": -3,
      "sha1": "f76211d04cb6c8256204b422ed38724ddee682ea",
      "sha256": "570eab9ce89db496a22196746cdcc68d5924abed65655bd4042b14306eadd98f",
      "size": 262002,
      "type_description": "Win32 EXE",
      "type_extension": "exe",
      "type_tag": "peexe"
    },
    "42914d6d213a20a2684064be5c80ffa9": {
      "last_analysis_results": {
        "Bkav": {
          "category": "malicious",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": "W32.AIDetect.malware2",
          "method": "blacklist",
          "engine_update": "20220404"
        },
        "Lionic": {
          "category": "malicious",
          "engine_name": "Lionic",
          "engine_version": "7.5",
          "result": "Trojan.Win32.Generic.4!c",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Elastic": {
          "category": "malicious",
          "engine_name": "Elastic",
          "engine_version": "4.0.35",
          "result": "malicious (high confidence)",
          "method": "blacklist",
          "engine_update": "20220302"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Gen:Trojan.Heur.KS.2",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": "Generic.mg.42914d6d213a20a2",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "CAT-QuickHeal": {
          "category": "malicious",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": "Trojan.FakeRean.gen",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": "Gen:Trojan.Heur.KS.2",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Malwarebytes": {
          "category": "malicious",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.2.27",
          "result": "Malware.AI.3798297588",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": "Trojan.Win32.Bagsu.rfn",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_100% (W)",
          "method": "blacklist",
          "engine_update": "20210907"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "Trojan:Win32/ExpProc.d4e970a6",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "malicious",
          "engine_name": "K7GW",
          "engine_version": "12.5.41774",
          "result": "Trojan ( 00167a791 )",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "K7AntiVirus": {
          "category": "malicious",
          "engine_name": "K7AntiVirus",
          "engine_version": "12.5.41773",
          "result": "Trojan ( 00167a791 )",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "BitDefenderTheta": {
          "category": "malicious",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": "AI:Packer.A20BC7AF14",
          "method": "blacklist",
          "engine_update": "20220404"
        },
        "VirIT": {
          "category": "malicious",
          "engine_name": "VirIT",
          "engine_version": "9.5.172",
          "result": "Trojan.Win32.FakeAV.DDCS",
          "method": "blacklist",
          "engine_update": "20220408"
        },
        "Cyren": {
          "category": "timeout",
          "engine_name": "Cyren",
          "engine_version": "6.5.1.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.17.0.0",
          "result": "Trojan.FakeAV!gen69",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "tehtris": {
          "category": "malicious",
          "engine_name": "tehtris",
          "engine_version": "v0.0.7",
          "result": "Generic.Malware",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "25086",
          "result": "a variant of Win32/Kryptik.OCO",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "TROJ_FAKEAL.SMLA",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Paloalto": {
          "category": "malicious",
          "engine_name": "Paloalto",
          "engine_version": "0.9.0.1003",
          "result": "generic.ml",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "ClamAV": {
          "category": "malicious",
          "engine_name": "ClamAV",
          "engine_version": "0.104.2.0",
          "result": "Win.Trojan.Agent-6743370-0",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "21.0.1.45",
          "result": "HEUR:Trojan.Win32.Generic",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Gen:Trojan.Heur.KS.2",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25576",
          "result": "Trojan.Win32.AVKill.cvejx",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "SUPERAntiSpyware": {
          "category": "malicious",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": "Trojan.Agent/Gen-FakeAlert",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "21.1.5827.0",
          "result": "Win32:MalOb-GR [Cryp]",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.27",
          "result": "Rogue.FakeRean!8.B4B (CLOUD)",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.21.193",
          "result": "Gen:Trojan.Heur.KS.2",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2021.5.0.7597",
          "result": "Gen:Trojan.Heur.KS.2 (B)",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "34519",
          "result": "Malware@#2pyz0kiclyvft",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "F-Secure": {
          "category": "malicious",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": "Trojan.TR/FakeAlert.aksl",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.54.3080",
          "result": "Trojan.Fakealert.21346",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4607",
          "result": "Trojan.FakeAV.Win32.85751",
          "method": "blacklist",
          "engine_update": "20220408"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "TROJ_FAKEAL.SMLA",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "McAfee-GW-Edition": {
          "category": "malicious",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": "BehavesLike.Win32.Kudj.fc",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "SentinelOne": {
          "category": "timeout",
          "engine_name": "SentinelOne",
          "engine_version": "22.2.1.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220330"
        },
        "Trapmine": {
          "category": "undetected",
          "engine_name": "Trapmine",
          "engine_version": "3.5.45.75",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220217"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211026"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "1.4.1.0",
          "result": "Mal/Generic-R + Mal/FakeAV-JR",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "APEX": {
          "category": "malicious",
          "engine_name": "APEX",
          "engine_version": "6.280",
          "result": "Malicious",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.32771B:27.26979",
          "result": "Gen:Trojan.Heur.KS.2",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "Trojan/Fakeav.toz",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "W32.Trojan.Gen",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.14",
          "result": "TR/FakeAlert.aksl",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/Generic.ASMalwS.82E300",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Kingsoft": {
          "category": "undetected",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Gridinsoft": {
          "category": "malicious",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.75.174",
          "result": "Fake.Win32.Gen.bot!i",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Arcabit": {
          "category": "undetected",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.889",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "ViRobot": {
          "category": "undetected",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "ZoneAlarm": {
          "category": "undetected",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "220410-04",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.19100.5",
          "result": "Rogue:Win32/FakeRean",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.27",
          "result": "Malicious (score: 100)",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220103"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.21.3.10230",
          "result": "Trojan/Win32.FakeAV.R3801",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Acronis": {
          "category": "undetected",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.82",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210512"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "FakeAV-Rena.p",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "5.0.0",
          "result": "BScope.Trojan.FakeAlert",
          "method": "blacklist",
          "engine_update": "20220408"
        },
        "Cylance": {
          "category": "failure",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "6.0.20.0",
          "result": "Hoax.Win32.ArchSMS",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "2.2.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Malware.Win32.Gencirc.10b4e470",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Yandex": {
          "category": "timeout",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "TACHYON": {
          "category": "undetected",
          "engine_name": "TACHYON",
          "engine_version": "2022-04-10.02",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Virus.W32.FakeAV",
          "method": "blacklist",
          "engine_update": "20220409"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "W32/Kryptik!tr",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "21.1.5827.0",
          "result": "Win32:MalOb-GR [Cryp]",
          "method": "blacklist",
          "engine_update": "20220410"
        },
        "Cybereason": {
          "category": "timeout",
          "engine_name": "Cybereason",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20210330"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Trj/Genetic.gen",
          "method": "blacklist",
          "engine_update": "20220410"
        }
      },
      "crowdsourced_ids_stats": {
        "info": 0,
        "high": 3,
        "medium": 0,
        "low": 0
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 4,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 4,
        "failure": 1,
        "malicious": 55,
        "undetected": 10
      },
      "md5": "42914d6d213a20a2684064be5c80ffa9",
      "names": [
        "foe.exe",
        "s7h0yjriq.dll",
        "crr10x26w.dll",
        "pllam2t6v.dll",
        "faizpysf9.dll",
        "qx428siis.dll",
        "49yhfxw8s.dll",
        "xze61ewvu.dll",
        "fr8efcfcg.dll",
        "q51m5s4so.dll",
        "ok9gbclfr.dll",
        "yz1vqzdub.dll",
        "2jdwi0s20.dll",
        "tj09isd4f.dll",
        "8u6nw6sl9.dll",
        "4cxuw2ijv.dll",
        "3jo5luabd.dll",
        "wci.exe",
        "file000_wci.exe",
        "pygqutci5.dll",
        "VirusShare_42914d6d213a20a2684064be5c80ffa9",
        "42914d6d213a20a2684064be5c80ffa9",
        "test.txt",
        "39F7315900D676FA20DB05FF6555F8004E5BEA18.exe",
        "d.php",
        "aa",
        "zxcRG1yQmg.7z",
        "qsY5.msc",
        "a",
        "QEP1GL.exe"
      ],
      "reputation": 0,
      "sha1": "871a2ce7fc4f65fb9f71c4f386602069df5f01dd",
      "sha256": "abce729b892c9784dd9e9a89999a4bc64da9398b4fa46b0efcc60dd91a4eab69",
      "sigma_analysis_stats": {
        "high": 1,
        "medium": 1,
        "critical": 0,
        "low": 8
      },
      "size": 335872,
      "type_description": "Win32 EXE",
      "type_extension": "exe",
      "type_tag": "peexe"
    },
    "4209aba2d2d252b98d98df499206b6d1": {
      "last_analysis_results": {
        "Bkav": {
          "category": "undetected",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200718"
        },
        "Lionic": {
          "category": "malicious",
          "engine_name": "AegisLab",
          "engine_version": "4.2",
          "result": "Trojan.NSIS.StartPage.4!c",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Generic.Startpage.9.4F2D2A2A",
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.7.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "StartPage-LV",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "3.6.4.335",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Zillya": {
          "category": "undetected",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4132",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200717"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "1.0",
          "result": "Malware",
          "method": "blacklist",
          "engine_update": "20200423"
        },
        "K7AntiVirus": {
          "category": "undetected",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.122.34742",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Alibaba": {
          "category": "type-unsupported",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "undetected",
          "engine_name": "K7GW",
          "engine_version": "11.122.34742",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Trustlook": {
          "category": "failure",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "Arcabit": {
          "category": "malicious",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.877",
          "result": "Generic.Startpage.9.4F2D2A2A",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Invincea": {
          "category": "type-unsupported",
          "engine_name": "Invincea",
          "engine_version": "6.3.6.26157",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200502"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "F-Prot": {
          "category": "malicious",
          "engine_name": "F-Prot",
          "engine_version": "4.7.1.166",
          "result": "BAT/StartPage.S",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200701"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.11.0.0",
          "result": "Trojan.Startpage",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "ESET-NOD32": {
          "category": "undetected",
          "engine_name": "ESET-NOD32",
          "engine_version": "21682",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "APEX": {
          "category": "type-unsupported",
          "engine_name": "APEX",
          "engine_version": "6.49",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "TROJ_STRTPG.SMV",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "18.4.3895.0",
          "result": "NSIS:StartPage-N [Trj]",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "ClamAV": {
          "category": "malicious",
          "engine_name": "ClamAV",
          "engine_version": "0.102.4.0",
          "result": "Win.Trojan.Startpage-510",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "15.0.1.13",
          "result": "Trojan.NSIS.StartPage.ag",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Generic.Startpage.9.4F2D2A2A",
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "NANO-Antivirus": {
          "category": "undetected",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.134.25119",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200717"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Nsis.Trojan.Startpage.Oyon",
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.5.370",
          "result": "Generic.Startpage.9.4F2D2A2A",
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "TACHYON": {
          "category": "undetected",
          "engine_name": "TACHYON",
          "engine_version": "2020-07-19.02",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "4.98.0",
          "result": "Troj/StartP-GK",
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "32642",
          "result": "Malware@#39kh7cwprck25",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "F-Secure": {
          "category": "malicious",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": "Trojan.TR/StartPage.mkd",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "DrWeb": {
          "category": "undetected",
          "engine_name": "DrWeb",
          "engine_version": "7.0.46.3050",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "VIPRE": {
          "category": "malicious",
          "engine_name": "VIPRE",
          "engine_version": "85320",
          "result": "Trojan.NSIS.Startpage.LN (v)",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "TROJ_STRTPG.SMV",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "SentinelOne": {
          "category": "type-unsupported",
          "engine_name": "SentinelOne",
          "engine_version": "4.3.0.105",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200601"
        },
        "Trapmine": {
          "category": "type-unsupported",
          "engine_name": "Trapmine",
          "engine_version": "3.5.0.987",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200619"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.36.1.0",
          "result": "Generic.Startpage.9.4F2D2A2A",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2018.12.0.1641",
          "result": "Generic.Startpage.9.4F2D2A2A (B)",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Paloalto": {
          "category": "type-unsupported",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.3.0.2",
          "result": "BAT/StartPage.S",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "Trojan/NSISStartPage",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Webroot": {
          "category": "type-unsupported",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.8",
          "result": "TR/StartPage.mkd",
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "eGambit": {
          "category": "type-unsupported",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/NSIS.StartPage",
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "Kingsoft": {
          "category": "undetected",
          "engine_name": "Kingsoft",
          "engine_version": "2013.8.14.323",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "Endgame": {
          "category": "type-unsupported",
          "engine_name": "Endgame",
          "engine_version": "4.0.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200608"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.17200.2",
          "result": "Trojan:Win32/Startpage.LN",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "ViRobot": {
          "category": "undetected",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "ZoneAlarm": {
          "category": "malicious",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": "Trojan.NSIS.StartPage.ag",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Avast-Mobile": {
          "category": "undetected",
          "engine_name": "Avast-Mobile",
          "engine_version": "200719-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.26289B:27.19507",
          "result": "Generic.Startpage.9.4F2D2A2A",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.24",
          "result": "Malicious (score: 85)",
          "method": "blacklist",
          "engine_update": "20200714"
        },
        "AhnLab-V3": {
          "category": "undetected",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.18.0.10009",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Acronis": {
          "category": "type-unsupported",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.76",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200603"
        },
        "BitDefenderTheta": {
          "category": "undetected",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200714"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.1.5",
          "result": "Generic.Startpage.9.4F2D2A2A",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "VBA32": {
          "category": "undetected",
          "engine_name": "VBA32",
          "engine_version": "4.4.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200717"
        },
        "Cylance": {
          "category": "type-unsupported",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "0.0.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.26",
          "result": "Trojan.Script.StartPage.dt (CLASSIC)",
          "method": "blacklist",
          "engine_update": "20200720"
        },
        "Yandex": {
          "category": "malicious",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": "Trojan.Startpage.Gen.13",
          "method": "blacklist",
          "engine_update": "20200707"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Trojan-Dropper.Win32.StartPage",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Virus.COM.Startpage.AG",
          "method": "blacklist",
          "engine_update": "20200622"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "W32/StartPage.NAO!tr",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "18.4.3895.0",
          "result": "NSIS:StartPage-N [Trj]",
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "Cybereason": {
          "category": "type-unsupported",
          "engine_name": "Cybereason",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20180308"
        },
        "Panda": {
          "category": "undetected",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200719"
        },
        "CrowdStrike": {
          "category": "type-unsupported",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20180202"
        },
        "Qihoo-360": {
          "category": "malicious",
          "engine_name": "Qihoo-360",
          "engine_version": "1.0.0.1120",
          "result": "nsis.startpage.1.gen",
          "method": "blacklist",
          "engine_update": "20200720"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 14,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 1,
        "malicious": 38,
        "undetected": 21
      },
      "md5": "4209aba2d2d252b98d98df499206b6d1",
      "names": [
        "l35fglb46.dll",
        "fclvzjc6x.dll",
        "s2m40yv3z.dll",
        "06g8xd59z.dll",
        "xkhb5efdj.dll",
        "voc9grfu0.dll",
        "9ln2rpmiu.dll",
        "g6cyn97j1.dll",
        "4y5qfugen.dll",
        "b5honvz5f.dll",
        "rlzdm585a.dll",
        "mm34wnihx.dll",
        "tdjy0qtzi.dll",
        "61dk6t7z5.dll",
        "k696fr11h.dll",
        "VirusShare_4209aba2d2d252b98d98df499206b6d1",
        "4209aba2d2d252b98d98df499206b6d1",
        "test.txt",
        "virussign.com_4209aba2d2d252b98d98df499206b6d1",
        "aa",
        "KRgqTlf_XN.tiff",
        "Dx1DbhizY.fon",
        "IEC6LY.exe"
      ],
      "reputation": 0,
      "sha1": "c6e5b1d45be44d1348866a3f5815622014a9a432",
      "sha256": "e055bb90e7209b94ec877744eaf9fb96f00968bf9e51b4a92b1837924df4be96",
      "size": 10069,
      "type_description": "unknown"
    },
    "5643daa8318caef7a10d71b1e664aa0b": {
      "last_analysis_results": {
        "Bkav": {
          "category": "malicious",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": "W32.AIDetect.malware1",
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "Lionic": {
          "category": "undetected",
          "engine_name": "Lionic",
          "engine_version": "4.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Elastic": {
          "category": "malicious",
          "engine_name": "Elastic",
          "engine_version": "4.0.32",
          "result": "malicious (high confidence)",
          "method": "blacklist",
          "engine_update": "20211223"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Trojan.Generic.6998664",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": "Generic.mg.5643daa8318caef7",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "GenericR-KEO!5643DAA8318C",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cylance": {
          "category": "malicious",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": "Unsafe",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zillya": {
          "category": "undetected",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4567",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": "Virus.Win32.Save.a",
          "method": "blacklist",
          "engine_update": "20211224"
        },
        "K7AntiVirus": {
          "category": "malicious",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.247.40759",
          "result": "Spyware ( 0055e3db1 )",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "TrojanDownloader:Win32/Banload.8c85fdb5",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "malicious",
          "engine_name": "K7GW",
          "engine_version": "11.247.40760",
          "result": "Spyware ( 0055e3db1 )",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_70% (D)",
          "method": "blacklist",
          "engine_update": "20210907"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "VirIT": {
          "category": "malicious",
          "engine_name": "VirIT",
          "engine_version": "9.5.130",
          "result": "Trojan.Win32.Banload.BQER",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cyren": {
          "category": "undetected",
          "engine_name": "Cyren",
          "engine_version": "6.5.1.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.16.0.0",
          "result": "ML.Attribute.HighConfidence",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "24764",
          "result": "Win32/Spy.Banker.WNS",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "APEX": {
          "category": "malicious",
          "engine_name": "APEX",
          "engine_version": "6.259",
          "result": "Malicious",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Paloalto": {
          "category": "undetected",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.27",
          "result": "Malicious (score: 100)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "21.0.1.45",
          "result": "Trojan-Downloader.Win32.Banload.bnlx",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Trojan.Generic.6998664",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25561",
          "result": "Trojan.Win32.Delf.dfhj",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220205"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Malware-gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Win32.Trojan-downloader.Banload.Sunr",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.21.193",
          "result": "Trojan.Generic.6998664",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2021.5.0.7597",
          "result": "Trojan.Generic.6998664 (B)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "34341",
          "result": "TrojWare.Win32.TrojanDownloader.Dadobra.~JK@1vk9pg",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "F-Secure": {
          "category": "undetected",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.52.8270",
          "result": "Trojan.DownLoader5.10443",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "VIPRE": {
          "category": "malicious",
          "engine_name": "VIPRE",
          "engine_version": "98492",
          "result": "Trojan.Win32.Generic!BT",
          "method": "blacklist",
          "engine_update": "20220119"
        },
        "TrendMicro": {
          "category": "undetected",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee-GW-Edition": {
          "category": "malicious",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": "BehavesLike.Win32.Fareit.jm",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211026"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "1.4.1.0",
          "result": "Mal/Generic-S",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Trojan-Dropper.Agent",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.32273B:27.26290",
          "result": "Trojan.Generic.6998664",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "TrojanDownloader.Banload.auxz",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "W32.Malware.Gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.12",
          "result": "TR/Crypt.XPACK.Gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/Generic.ASSuf.1F337",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kingsoft": {
          "category": "undetected",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Gridinsoft": {
          "category": "undetected",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.72.174",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Arcabit": {
          "category": "undetected",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.889",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ViRobot": {
          "category": "undetected",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ZoneAlarm": {
          "category": "undetected",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "220210-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.18900.2",
          "result": "TrojanDownloader:Win32/Banload",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TACHYON": {
          "category": "undetected",
          "engine_name": "TACHYON",
          "engine_version": "2022-02-10.02",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220103"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.21.2.10258",
          "result": "Trojan/Win32.Banload.C53921",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Acronis": {
          "category": "undetected",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.82",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210512"
        },
        "BitDefenderTheta": {
          "category": "malicious",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": "Gen:NN.ZelphiF.34212.MCX@aWnxiOl",
          "method": "blacklist",
          "engine_update": "20220207"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": "Trojan.Generic.6998664",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "5.0.0",
          "result": "TrojanDownloader.Banload",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.2.27",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "2.2.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TrendMicro-HouseCall": {
          "category": "undetected",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.27",
          "result": "Spyware.Banker!8.8D (CLOUD)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Yandex": {
          "category": "malicious",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": "TrojanSpy.Banker!HjoI0rksrd4",
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "SentinelOne": {
          "category": "malicious",
          "engine_name": "SentinelOne",
          "engine_version": "7.2.0.1",
          "result": "Static AI - Malicious PE",
          "method": "blacklist",
          "engine_update": "20220201"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Trojan.Malware.2735667.susgen",
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "W32/Malware_fam.NB",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Malware-gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cybereason": {
          "category": "malicious",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": "malicious.8318ca",
          "method": "blacklist",
          "engine_update": "20210330"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Generic Malware",
          "method": "blacklist",
          "engine_update": "20220210"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 4,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 0,
        "malicious": 48,
        "undetected": 20
      },
      "md5": "5643daa8318caef7a10d71b1e664aa0b",
      "names": [
        "kw7ndlhgb.dll",
        "vdqu8ej4u.dll",
        "v25a5h1gm.dll",
        "zdovjsvqu.dll",
        "5qvvpyayl.dll",
        "zxdeouxnw.dll",
        "pylnlw9lp.dll",
        "ehag44xx4.dll",
        "hw53vssz5.dll",
        "dkkq70zy8.dll",
        "eo9gyho75.dll",
        "n0dbvkqer.dll",
        "l3rcvz9i3.dll",
        "qc3rly74f.dll",
        "o7izcxv3r.dll",
        "3otqq8hut.dll",
        "VirusShare_5643daa8318caef7a10d71b1e664aa0b",
        "1002-72e4ae992150a964d9e727bba6110fa3e8b9f587",
        "5643daa8318caef7a10d71b1e664aa0b.exe",
        "test.txt",
        "5643DAA8318CAEF7A10D71B1E664AA0B",
        "aa",
        "5643daa8318caef7a10d71b1e664aa0b",
        "3t1T5W.hta",
        "XTJU1BOLwg.dll",
        "a",
        "2JG4CR.exe"
      ],
      "reputation": 0,
      "sha1": "72e4ae992150a964d9e727bba6110fa3e8b9f587",
      "sha256": "c0212953cbe05ac00957fea6eb11b81955f3384c04313cbf496acacd15644392",
      "size": 626688,
      "type_description": "Win32 EXE",
      "type_extension": "exe",
      "type_tag": "peexe"
    },
    "2ea416d5be6e34b6e3f4b3ba0f4616d5": {
      "last_analysis_results": {
        "Bkav": {
          "category": "undetected",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Lionic": {
          "category": "undetected",
          "engine_name": "AegisLab",
          "engine_version": "4.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Trojan.Muldrop.34",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.31.0.0",
          "result": "Trojan.Muldrop.34",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "McAfee": {
          "category": "undetected",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "3.6.4.335",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Zillya": {
          "category": "undetected",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4123",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200703"
        },
        "Sangfor": {
          "category": "undetected",
          "engine_name": "Sangfor",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200423"
        },
        "K7AntiVirus": {
          "category": "undetected",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.120.34596",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Alibaba": {
          "category": "type-unsupported",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "undetected",
          "engine_name": "K7GW",
          "engine_version": "11.120.34596",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Trustlook": {
          "category": "failure",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Invincea": {
          "category": "type-unsupported",
          "engine_name": "Invincea",
          "engine_version": "6.3.6.26157",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200502"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "F-Prot": {
          "category": "malicious",
          "engine_name": "F-Prot",
          "engine_version": "4.7.1.166",
          "result": "Intended_Virus!5f73",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200701"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.11.0.0",
          "result": "VBS.Kidarcade",
          "method": "blacklist",
          "engine_update": "20200703"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "21600",
          "result": "VBS/Kidar.A",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "APEX": {
          "category": "type-unsupported",
          "engine_name": "APEX",
          "engine_version": "6.44",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "VBS_Generic",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "18.4.3895.0",
          "result": "VBS:Malware-gen",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "ClamAV": {
          "category": "undetected",
          "engine_name": "ClamAV",
          "engine_version": "0.102.3.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "15.0.1.13",
          "result": "Virus.VBS.Kidar",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Trojan.Muldrop.34",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.134.25119",
          "result": "Virus.Html.Kidar.lxed",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200703"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Vbs.Virus.Kidar.Huzs",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.5.370",
          "result": "Trojan.Muldrop.34",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "TACHYON": {
          "category": "undetected",
          "engine_name": "TACHYON",
          "engine_version": "2020-07-04.02",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Sophos": {
          "category": "undetected",
          "engine_name": "Sophos",
          "engine_version": "4.98.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "32596",
          "result": "Malware@#6t526tefrtwv",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "F-Secure": {
          "category": "malicious",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": "Backdoor.BDS/MiniCmd.Drp.1",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "DrWeb": {
          "category": "undetected",
          "engine_name": "DrWeb",
          "engine_version": "7.0.46.3050",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "VIPRE": {
          "category": "undetected",
          "engine_name": "VIPRE",
          "engine_version": "84958",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "VBS_Generic",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "McAfee-GW-Edition": {
          "category": "failure",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "SentinelOne": {
          "category": "type-unsupported",
          "engine_name": "SentinelOne",
          "engine_version": "4.3.0.105",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200601"
        },
        "Trapmine": {
          "category": "type-unsupported",
          "engine_name": "Trapmine",
          "engine_version": "3.5.0.987",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200619"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.7.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2018.12.0.1641",
          "result": "Trojan.Muldrop.34 (B)",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Paloalto": {
          "category": "type-unsupported",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.3.0.2",
          "result": "Intended_Virus!5f73",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Jiangmin": {
          "category": "undetected",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Webroot": {
          "category": "type-unsupported",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.8",
          "result": "BDS/MiniCmd.Drp.1",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "eGambit": {
          "category": "type-unsupported",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Virus/VBS.Kidar",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Kingsoft": {
          "category": "undetected",
          "engine_name": "Kingsoft",
          "engine_version": "2013.8.14.323",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.17200.2",
          "result": "Trojan:Win32/Occamy.C",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Endgame": {
          "category": "type-unsupported",
          "engine_name": "Endgame",
          "engine_version": "4.0.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200608"
        },
        "Arcabit": {
          "category": "malicious",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.877",
          "result": "Trojan.Muldrop.34",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "ViRobot": {
          "category": "malicious",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": "VBS.S.Kidar.6142",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "ZoneAlarm": {
          "category": "malicious",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": "Virus.VBS.Kidar",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Avast-Mobile": {
          "category": "undetected",
          "engine_name": "Avast-Mobile",
          "engine_version": "200704-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.26119B:27.19327",
          "result": "Trojan.Muldrop.34",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.24",
          "result": "Malicious (score: 85)",
          "method": "blacklist",
          "engine_update": "20200628"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.18.0.10009",
          "result": "VBS/Kidar",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Acronis": {
          "category": "type-unsupported",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.76",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200603"
        },
        "BitDefenderTheta": {
          "category": "undetected",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200624"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.1.5",
          "result": "Trojan.Muldrop.34",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=97)",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "4.4.1",
          "result": "Virus.VBS.Kidar",
          "method": "blacklist",
          "engine_update": "20200702"
        },
        "Cylance": {
          "category": "type-unsupported",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "0.0.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200703"
        },
        "Rising": {
          "category": "undetected",
          "engine_name": "Rising",
          "engine_version": "25.0.0.26",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Yandex": {
          "category": "undetected",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200703"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Virus.VBS.Kidar",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "MaxSecure": {
          "category": "undetected",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200622"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "VBS/Kidar",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "18.4.3895.0",
          "result": "VBS:Malware-gen",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Cybereason": {
          "category": "type-unsupported",
          "engine_name": "Cybereason",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20180308"
        },
        "Panda": {
          "category": "undetected",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "CrowdStrike": {
          "category": "type-unsupported",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190702"
        },
        "Qihoo-360": {
          "category": "malicious",
          "engine_name": "Qihoo-360",
          "engine_version": "1.0.0.1120",
          "result": "Malware.Radar01.Gen",
          "method": "blacklist",
          "engine_update": "20200704"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 14,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 2,
        "malicious": 33,
        "undetected": 26
      },
      "md5": "2ea416d5be6e34b6e3f4b3ba0f4616d5",
      "names": [
        "t4o8cpc1l.dll",
        "7u6rhuvs2.dll",
        "n3spx1lpe.dll",
        "y3rsj0hsp.dll",
        "ywgv33ug4.dll",
        "l0ktk68al.dll",
        "h40zn3998.dll",
        "y1hdr2v0y.dll",
        "b9lad66l9.dll",
        "rr629ldrp.dll",
        "nqtvkyar9.dll",
        "hngkxdgye.dll",
        "zlnrkholv.dll",
        "9idptmn7t.dll",
        "n4tlhez1i.dll",
        "VirusShare_2ea416d5be6e34b6e3f4b3ba0f4616d5",
        "2ea416d5be6e34b6e3f4b3ba0f4616d56e288d9c382012bf90edef0b20cf4996d06abbf26142.exe",
        "2ea416d5be6e34b6e3f4b3ba0f4616d5.exe",
        "test.txt",
        "Virus.VBS.Kidar",
        "6e288d9c382012bf90edef0b20cf4996d06abbf2",
        "aa",
        "2ea416d5be6e34b6e3f4b3ba0f4616d5",
        "ogGaVX.msc",
        "kWqTBA.vsd",
        "a",
        "R6B7H2.exe"
      ],
      "reputation": -1,
      "sha1": "6e288d9c382012bf90edef0b20cf4996d06abbf2",
      "sha256": "145cfe30255993168bb5635c30144f0ade755b2ac3e909f4ded037df2fdf239e",
      "size": 6142,
      "type_description": "unknown"
    },
    "224f4bf73e573a880ad699d1a5b90e90": {
      "last_analysis_results": {
        "Bkav": {
          "category": "malicious",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": "W32.AIDetect.malware2",
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "Lionic": {
          "category": "malicious",
          "engine_name": "Lionic",
          "engine_version": "4.2",
          "result": "Trojan.Win32.VBKrypt.lnvW",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Elastic": {
          "category": "malicious",
          "engine_name": "Elastic",
          "engine_version": "4.0.32",
          "result": "malicious (high confidence)",
          "method": "blacklist",
          "engine_update": "20211223"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Gen:Heur.ManBat.1",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": "Gen:Heur.ManBat.1",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": "Gen:Heur.ManBat.1",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cylance": {
          "category": "malicious",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": "Unsafe",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zillya": {
          "category": "failure",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4567",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": "Trojan.Win32.Toga.rfn",
          "method": "blacklist",
          "engine_update": "20211224"
        },
        "K7AntiVirus": {
          "category": "malicious",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.247.40759",
          "result": "Trojan ( 0026f39f1 )",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "Trojan:Win32/VBKrypt.3bc24880",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "malicious",
          "engine_name": "K7GW",
          "engine_version": "11.247.40760",
          "result": "Trojan ( 0026f39f1 )",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_90% (W)",
          "method": "blacklist",
          "engine_update": "20210907"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "VirIT": {
          "category": "undetected",
          "engine_name": "VirIT",
          "engine_version": "9.5.130",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cyren": {
          "category": "undetected",
          "engine_name": "Cyren",
          "engine_version": "6.5.1.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.16.0.0",
          "result": "ML.Attribute.HighConfidence",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "24764",
          "result": "a variant of Win32/Injector.AMH",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "APEX": {
          "category": "malicious",
          "engine_name": "APEX",
          "engine_version": "6.259",
          "result": "Malicious",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Paloalto": {
          "category": "malicious",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": "generic.ml",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ClamAV": {
          "category": "malicious",
          "engine_name": "ClamAV",
          "engine_version": "0.104.2.0",
          "result": "Win.Trojan.Ag-1",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "21.0.1.45",
          "result": "Trojan.Win32.VBKrypt.waoc",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Gen:Heur.ManBat.1",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25561",
          "result": "Trojan.Win32.CFI.obgid",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SUPERAntiSpyware": {
          "category": "malicious",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": "Trojan.Agent/Gen-Falleg[T]",
          "method": "blacklist",
          "engine_update": "20220205"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Trojan-gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Win32.Trojan.Agent.mzv",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.21.193",
          "result": "Gen:Heur.ManBat.1",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TACHYON": {
          "category": "undetected",
          "engine_name": "TACHYON",
          "engine_version": "2022-02-10.02",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2021.5.0.7597",
          "result": "Gen:Heur.ManBat.1 (B)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "34341",
          "result": "Malware@#2e8rk525ncdz6",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "F-Secure": {
          "category": "undetected",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "DrWeb": {
          "category": "undetected",
          "engine_name": "DrWeb",
          "engine_version": "7.0.52.8270",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "VIPRE": {
          "category": "malicious",
          "engine_name": "VIPRE",
          "engine_version": "98492",
          "result": "Trojan.Win32.Generic.pak!cobra",
          "method": "blacklist",
          "engine_update": "20220119"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "TROJ_GEN.R002C0DA722",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee-GW-Edition": {
          "category": "malicious",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": "BehavesLike.Win32.IStartSurf.mc",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211026"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "1.4.1.0",
          "result": "Mal/VB-ZQ",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Virus.Win32.VBInject",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.32273B:27.26290",
          "result": "Gen:Heur.ManBat.1",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Jiangmin": {
          "category": "undetected",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "Trojan.Dropper",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.12",
          "result": "TR/Dropper.Gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/Generic.ASMalwS.1839D26",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kingsoft": {
          "category": "malicious",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": "Win32.Heur.KVM007.a.(kcloud)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Gridinsoft": {
          "category": "malicious",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.72.174",
          "result": "Trojan.Win32.Downloader.sa",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Arcabit": {
          "category": "undetected",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.889",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ViRobot": {
          "category": "undetected",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ZoneAlarm": {
          "category": "undetected",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "220210-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.18900.2",
          "result": "PWS:Win32/Zbot!ml",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.27",
          "result": "Malicious (score: 100)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220103"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.21.2.10258",
          "result": "Trojan/Win32.Malco.R7759",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Acronis": {
          "category": "undetected",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.82",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210512"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "Generic BackDoor.yp",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "5.0.0",
          "result": "Malware-Cryptor.VB.gen.1",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.2.27",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "2.2.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "TROJ_GEN.R002C0DA722",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.27",
          "result": "Worm.VBInjectEx!1.99E6 (CLOUD)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Yandex": {
          "category": "malicious",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": "Trojan.Injector!q0+F6YE2u1U",
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "SentinelOne": {
          "category": "malicious",
          "engine_name": "SentinelOne",
          "engine_version": "7.2.0.1",
          "result": "Static AI - Malicious PE",
          "method": "blacklist",
          "engine_update": "20220201"
        },
        "eGambit": {
          "category": "malicious",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": "Generic.Malware",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "Riskware/Ardamax",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefenderTheta": {
          "category": "malicious",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": "AI:Packer.DD4D1E1520",
          "method": "blacklist",
          "engine_update": "20220207"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Trojan-gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cybereason": {
          "category": "malicious",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": "malicious.73e573",
          "method": "blacklist",
          "engine_update": "20210330"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Trj/CI.A",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Trojan.Malware.77190077.susgen",
          "method": "blacklist",
          "engine_update": "20220208"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 4,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 1,
        "malicious": 54,
        "undetected": 15
      },
      "md5": "224f4bf73e573a880ad699d1a5b90e90",
      "names": [
        "stub3",
        "stub3.exe",
        "lk45m57bn.dll",
        "qp7lppk0i.dll",
        "syntesv1h.dll",
        "iel5x0lzv.dll",
        "e6up6ixhu.dll",
        "ffnrpdbt4.dll",
        "ku3wlnevi.dll",
        "mportsr04.dll",
        "nogx9kcu6.dll",
        "kaylhdw5p.dll",
        "h28vviyli.dll",
        "av8t6lf7k.dll",
        "9mulpj3os.dll",
        "231a1uqjm.dll",
        "i9pnlca9r.dll",
        "virussign.com_224f4bf73e573a880ad699d1a5b90e90.vir",
        "qcshtkl35.dll",
        "VirusShare_224f4bf73e573a880ad699d1a5b90e90",
        "224f4bf73e573a880ad699d1a5b90e90.virobj",
        "224f4bf73e573a880ad699d1a5b90e90",
        "test.txt",
        "aa",
        "ByGeMcXh.caj",
        "OVfVWGD.vbs",
        "a",
        "HVFU1Y.exe"
      ],
      "reputation": 0,
      "sha1": "d222dbb99638685731e3234d12e954f857ecdf99",
      "sha256": "58a5cb75561a09ecce3b339135f385f954e50ef02d783655147b742809cf8c53",
      "size": 20480,
      "type_description": "Win32 EXE",
      "type_extension": "exe",
      "type_tag": "peexe"
    },
    "5ac2992ba6a5227a8975cc0d1ace992f": {
      "last_analysis_results": {
        "Bkav": {
          "category": "undetected",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220322"
        },
        "Lionic": {
          "category": "malicious",
          "engine_name": "Lionic",
          "engine_version": "7.5",
          "result": "Trojan.Win9x.WinSKR.4!c",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "tehtris": {
          "category": "malicious",
          "engine_name": "tehtris",
          "engine_version": "v0.0.7",
          "result": "Generic.Malware",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Trojan.BabyDel.A",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": "Trojan.BabyDel.A",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "Artemis!5AC2992BA6A5",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Cylance": {
          "category": "malicious",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": "Unsafe",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Sangfor": {
          "category": "undetected",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211224"
        },
        "K7AntiVirus": {
          "category": "malicious",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.255.41445",
          "result": "Trojan ( 0055e9041 )",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "Trojan:Win32/WinSKR.f34a8288",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "malicious",
          "engine_name": "K7GW",
          "engine_version": "11.255.41451",
          "result": "Trojan ( 0055e9041 )",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Cybereason": {
          "category": "malicious",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": "malicious.ba6a52",
          "method": "blacklist",
          "engine_update": "20210330"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "VirIT": {
          "category": "malicious",
          "engine_name": "VirIT",
          "engine_version": "9.5.160",
          "result": "Trojan.Win32.Generic.BMVE",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.5.1.2",
          "result": "W32/Trojan.SBLZ-2810",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Elastic": {
          "category": "undetected",
          "engine_name": "Elastic",
          "engine_version": "4.0.35",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220302"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "24990",
          "result": "Win32/WinSKR.BabyDel",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "APEX": {
          "category": "undetected",
          "engine_name": "APEX",
          "engine_version": "6.273",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220322"
        },
        "Paloalto": {
          "category": "undetected",
          "engine_name": "Paloalto",
          "engine_version": "0.9.0.1003",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "ClamAV": {
          "category": "malicious",
          "engine_name": "ClamAV",
          "engine_version": "0.104.2.0",
          "result": "Win.Trojan.Win9x-1",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "21.0.1.45",
          "result": "Trojan.Win9x.WinSKR.BabyDel",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Trojan.BabyDel.A",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25563",
          "result": "Trojan.Win32.WinSKR.hlxv",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220319"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Babydel [Trj]",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.27",
          "result": "Trojan.Win9xWinSKR (CLOUD)",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.21.193",
          "result": "Trojan.BabyDel.A",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Sophos": {
          "category": "timeout",
          "engine_name": "Sophos",
          "engine_version": "1.4.1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "34465",
          "result": "Malware@#1nbn6bgd7si87",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "F-Secure": {
          "category": "undetected",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "DrWeb": {
          "category": "undetected",
          "engine_name": "DrWeb",
          "engine_version": "7.0.54.3080",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4595",
          "result": "Trojan.WinSKR.Win32.1",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "TROJ_BABYDEL",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "McAfee-GW-Edition": {
          "category": "malicious",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": "Artemis!Trojan",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Trapmine": {
          "category": "undetected",
          "engine_name": "Trapmine",
          "engine_version": "3.5.45.75",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220217"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211026"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2021.5.0.7597",
          "result": "Trojan.BabyDel.A (B)",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "SentinelOne": {
          "category": "undetected",
          "engine_name": "SentinelOne",
          "engine_version": "7.2.0.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220201"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.32620B:27.26769",
          "result": "Trojan.BabyDel.A",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "Trojan/Win95.WinSKR.BabyDel",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "Troj/Babydel",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.14",
          "result": "TR/W95.Letter",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/Generic.ASMalwS.51F42",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Kingsoft": {
          "category": "malicious",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": "Win32.Troj.Win9x.(kcloud)",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Gridinsoft": {
          "category": "undetected",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.74.174",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Arcabit": {
          "category": "undetected",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.889",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "ViRobot": {
          "category": "malicious",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": "Trojan.Win32.WinSKRBadyDel.148336",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "ZoneAlarm": {
          "category": "undetected",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "220323-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.19000.8",
          "result": "Trojan:Win32/DSSDetection",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.27",
          "result": "Malicious (score: 99)",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220103"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.21.3.10230",
          "result": "Win-Trojan/Winskr.148336",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Acronis": {
          "category": "undetected",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.82",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210512"
        },
        "BitDefenderTheta": {
          "category": "undetected",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220318"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": "Trojan.BabyDel.A",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "5.0.0",
          "result": "Trojan.Win9x.WinSKR.Letter",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.2.27",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Ikarus": {
          "category": "failure",
          "engine_name": "Ikarus",
          "engine_version": "6.0.11.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "2.2.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "TROJ_BABYDEL",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Win32.Trojan.Winskr.Szbu",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Yandex": {
          "category": "undetected",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "TACHYON": {
          "category": "malicious",
          "engine_name": "TACHYON",
          "engine_version": "2022-03-24.01",
          "result": "Trojan/W32.Anset.148336",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Trojan.Malware.759581.susgen",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "W32/Babydel.BABYDEL!tr",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Babydel [Trj]",
          "method": "blacklist",
          "engine_update": "20220324"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Trojan Horse",
          "method": "blacklist",
          "engine_update": "20220323"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_100% (W)",
          "method": "blacklist",
          "engine_update": "20210907"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 4,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 1,
        "failure": 1,
        "malicious": 46,
        "undetected": 21
      },
      "md5": "5ac2992ba6a5227a8975cc0d1ace992f",
      "names": [
        "WinS-R32",
        "WinS-R32.exe",
        "wt8qyw57y.dll",
        "2uu6poyzg.dll",
        "l86r3g7du.dll",
        "lj8b222cd.dll",
        "ehtib3swc.dll",
        "17yw5shw5.dll",
        "nei3lo7a8.dll",
        "sk1tprvef.dll",
        "8srv074t1.dll",
        "2o0thirx1.dll",
        "4u8fl4369.dll",
        "labckx609.dll",
        "wayhldt70.dll",
        "1040te9yd.dll",
        "olasxljjp.dll",
        "Trojan.Win9x.WinSKR.BabyDel",
        "b5sfypxjw.dll",
        "VirusShare_5ac2992ba6a5227a8975cc0d1ace992f",
        "myfile.exe",
        "5ac2992ba6a5227a8975cc0d1ace992f.exe",
        "5ac2992ba6a5227a8975cc0d1ace992f816af93c44ff8b765ff1aa61c1b7c677a46de4a8148336.exe",
        "Trojan.Win9x.WinSKR.BabyDel.exe",
        "test.txt",
        "5AC2992BA6A5227A8975CC0D1ACE992F",
        "aa",
        "5ac2992ba6a5227a8975cc0d1ace992f",
        "knqgDB.scr",
        "ljT7.vsd"
      ],
      "reputation": -27,
      "sha1": "816af93c44ff8b765ff1aa61c1b7c677a46de4a8",
      "sha256": "3139d054e55a6bd2ecfe76f8c027c029e0bc7da10119653474bb96159aae8a2a",
      "size": 148336,
      "type_description": "Win32 EXE",
      "type_extension": "exe",
      "type_tag": "peexe"
    },
    "5eab41b7e53a17718529854c19f8b3f0": {
      "last_analysis_results": {
        "Bkav": {
          "category": "undetected",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Lionic": {
          "category": "malicious",
          "engine_name": "AegisLab",
          "engine_version": "4.2",
          "result": "Trojan.PHP.C99Shell.m!c",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "ClamAV": {
          "category": "malicious",
          "engine_name": "ClamAV",
          "engine_version": "0.102.3.0",
          "result": "Win.Trojan.C99-14",
          "method": "blacklist",
          "engine_update": "20200715"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.36.1.0",
          "result": "Trojan.Exploit.Img.WMI",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "CAT-QuickHeal": {
          "category": "malicious",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": "PHP/C99shell.R",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "ALYac": {
          "category": "undetected",
          "engine_name": "ALYac",
          "engine_version": "1.1.1.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "3.6.4.335",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4131",
          "result": "Backdoor.C99Shell.Script.15",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Paloalto": {
          "category": "type-unsupported",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "1.0",
          "result": "Malware",
          "method": "blacklist",
          "engine_update": "20200423"
        },
        "K7AntiVirus": {
          "category": "undetected",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.122.34712",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Alibaba": {
          "category": "type-unsupported",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "undetected",
          "engine_name": "K7GW",
          "engine_version": "11.122.34712",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Trustlook": {
          "category": "failure",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Invincea": {
          "category": "type-unsupported",
          "engine_name": "Invincea",
          "engine_version": "6.3.6.26157",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200502"
        },
        "BitDefenderTheta": {
          "category": "undetected",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200714"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.3.0.2",
          "result": "PHP/CShell.Z",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200701"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.11.0.0",
          "result": "PHP.Backdoor.Trojan",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "ESET-NOD32": {
          "category": "undetected",
          "engine_name": "ESET-NOD32",
          "engine_version": "21663",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Baidu": {
          "category": "malicious",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": "HTML.Exploit.C99.a",
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "PHP_C99SHEL.SME",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "18.4.3895.0",
          "result": "HTML:BackDoor-B [Trj]",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.24",
          "result": "Malicious (score: 85)",
          "method": "blacklist",
          "engine_update": "20200714"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "15.0.1.13",
          "result": "Backdoor.PHP.C99Shell.gm",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Trojan.Exploit.Img.WMI",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.134.25119",
          "result": "Trojan.Html.C99Shell.dwlsk",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200710"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Trojan.Exploit.Img.WMI",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "APEX": {
          "category": "type-unsupported",
          "engine_name": "APEX",
          "engine_version": "6.48",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.26",
          "result": "Backdoor.Script.C99Shell.v (CLASSIC)",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.5.370",
          "result": "Trojan.Exploit.Img.WMI",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "4.98.0",
          "result": "Troj/Bckdr-RII",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "32631",
          "result": "Backdoor.HTML.EMO.E@4p0qmc",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "F-Secure": {
          "category": "malicious",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": "Exploit.EXP/C99Shell.A",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.46.3050",
          "result": "PHP.Shellbot.47",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "VIPRE": {
          "category": "malicious",
          "engine_name": "VIPRE",
          "engine_version": "85234",
          "result": "Backdoor.HTML.PHPShell-Interface (v)",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "PHP_C99SHEL.SME",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "McAfee-GW-Edition": {
          "category": "failure",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Trapmine": {
          "category": "type-unsupported",
          "engine_name": "Trapmine",
          "engine_version": "3.5.0.987",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200619"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.7.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2018.12.0.1641",
          "result": "Trojan.Exploit.Img.WMI (B)",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Backdoor.PHP.C99Shell",
          "method": "blacklist",
          "engine_update": "20200715"
        },
        "F-Prot": {
          "category": "malicious",
          "engine_name": "F-Prot",
          "engine_version": "4.7.1.166",
          "result": "PHP/CShell.Z",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "Backdoor.PHP.co",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Webroot": {
          "category": "type-unsupported",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.8",
          "result": "EXP/C99Shell.A",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "eGambit": {
          "category": "type-unsupported",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Antiy-AVL": {
          "category": "undetected",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Kingsoft": {
          "category": "undetected",
          "engine_name": "Kingsoft",
          "engine_version": "2013.8.14.323",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.17200.2",
          "result": "Backdoor:PHP/C99shell.AK",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Endgame": {
          "category": "type-unsupported",
          "engine_name": "Endgame",
          "engine_version": "4.0.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200608"
        },
        "Arcabit": {
          "category": "malicious",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.877",
          "result": "Trojan.Exploit.Img.WMI",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "ViRobot": {
          "category": "undetected",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "ZoneAlarm": {
          "category": "malicious",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": "Backdoor.PHP.C99Shell.gm",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Avast-Mobile": {
          "category": "undetected",
          "engine_name": "Avast-Mobile",
          "engine_version": "200716-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.26257B:27.19466",
          "result": "Trojan.Exploit.Img.WMI",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "SentinelOne": {
          "category": "type-unsupported",
          "engine_name": "SentinelOne",
          "engine_version": "4.3.0.105",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200601"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.18.0.10009",
          "result": "Script/C99shell",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Acronis": {
          "category": "type-unsupported",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.76",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200603"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "PHP/BackDoor.d",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=99)",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "VBA32": {
          "category": "undetected",
          "engine_name": "VBA32",
          "engine_version": "4.4.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200715"
        },
        "Cylance": {
          "category": "type-unsupported",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "0.0.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Html.Win32.Script.500756",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Yandex": {
          "category": "malicious",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": "Exploit.C99Shell.Gen.3",
          "method": "blacklist",
          "engine_update": "20200707"
        },
        "TACHYON": {
          "category": "undetected",
          "engine_name": "TACHYON",
          "engine_version": "2020-07-16.02",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Virus.Backdoor.HTML.PHPShell-Interface.gm",
          "method": "blacklist",
          "engine_update": "20200622"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "HTML/C99Shell.GII!tr.bdr",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "18.4.3895.0",
          "result": "HTML:BackDoor-B [Trj]",
          "method": "blacklist",
          "engine_update": "20200716"
        },
        "Cybereason": {
          "category": "type-unsupported",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190616"
        },
        "Panda": {
          "category": "undetected",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200715"
        },
        "CrowdStrike": {
          "category": "type-unsupported",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190702"
        },
        "Qihoo-360": {
          "category": "malicious",
          "engine_name": "Qihoo-360",
          "engine_version": "1.0.0.1120",
          "result": "virus.html.fakeimg.a",
          "method": "blacklist",
          "engine_update": "20200716"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 14,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 2,
        "malicious": 42,
        "undetected": 17
      },
      "md5": "5eab41b7e53a17718529854c19f8b3f0",
      "names": [
        "pezx4xn32.dll",
        "x8ufkhowi.dll",
        "ojqiwolgs.dll",
        "3qt6eidkd.dll",
        "xgpwtp1ab.dll",
        "0vzl620qt.dll",
        "vvgoavtbz.dll",
        "l0k5rc2yi.dll",
        "wga4bkov9.dll",
        "l17jwaa7n.dll",
        "c3edgx740.dll",
        "pzb5d5yk8.dll",
        "39i8ki7ls.dll",
        "rql2ukwwf.dll",
        "3ia2nvnnm.dll",
        "VirusShare_5eab41b7e53a17718529854c19f8b3f0",
        "5eab41b7e53a17718529854c19f8b3f0",
        "test.txt",
        "aa",
        "34pNfkht.chm",
        "Pw_Z.vbs",
        "a"
      ],
      "reputation": 0,
      "sha1": "ec0154890e32a4ebbff01f662db1eda53cb83867",
      "sha256": "cedd41e61115c6dd067cc9994752b2db98201c133c86807d4ad8eb1a69a0cfd5",
      "size": 24014,
      "type_description": "GIF",
      "type_extension": "gif",
      "type_tag": "gif"
    },
    "263d55d86a53753cdf179b61be79fa3a": {
      "last_analysis_results": {
        "Bkav": {
          "category": "undetected",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "Lionic": {
          "category": "malicious",
          "engine_name": "Lionic",
          "engine_version": "4.2",
          "result": "Trojan.Win32.Generic.lI3I",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Elastic": {
          "category": "malicious",
          "engine_name": "Elastic",
          "engine_version": "4.0.32",
          "result": "malicious (high confidence)",
          "method": "blacklist",
          "engine_update": "20211223"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.27",
          "result": "Malicious (score: 99)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": "Generic.mg.263d55d86a53753c",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "GenericRXCK-HW!263D55D86A53",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cylance": {
          "category": "malicious",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": "Unsafe",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4567",
          "result": "Worm.Palevo.Win32.52482",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": "Suspicious.Win32.Save.a",
          "method": "blacklist",
          "engine_update": "20211224"
        },
        "K7AntiVirus": {
          "category": "malicious",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.247.40759",
          "result": "Riskware ( 0040eff71 )",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "Trojan:Win32/Starter.ali2000005",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "malicious",
          "engine_name": "K7GW",
          "engine_version": "11.247.40760",
          "result": "Riskware ( 0040eff71 )",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_100% (W)",
          "method": "blacklist",
          "engine_update": "20210907"
        },
        "BitDefenderTheta": {
          "category": "malicious",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": "AI:Packer.12C2D58D1F",
          "method": "blacklist",
          "engine_update": "20220207"
        },
        "VirIT": {
          "category": "undetected",
          "engine_name": "VirIT",
          "engine_version": "9.5.130",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.5.1.2",
          "result": "W32/MSIL_Troj.G.gen!Eldorado",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.16.0.0",
          "result": "ML.Attribute.HighConfidence",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "24764",
          "result": "a variant of MSIL/Injector.CCT",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "TROJ_GEN.R002C0DIG21",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Paloalto": {
          "category": "malicious",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": "generic.ml",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ClamAV": {
          "category": "malicious",
          "engine_name": "ClamAV",
          "engine_version": "0.104.2.0",
          "result": "Win.Packed.Stubrc-9780686-0",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "21.0.1.45",
          "result": "P2P-Worm.Win32.Palevo.brve",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Gen:Heur.MSIL.Krypt.6",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25561",
          "result": "Trojan.Win32.Inject.dchhwa",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220205"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Gen:Heur.MSIL.Krypt.6",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "APEX": {
          "category": "malicious",
          "engine_name": "APEX",
          "engine_version": "6.259",
          "result": "Malicious",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Win32.Worm-p2p.Palevo.Hpij",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.21.193",
          "result": "Gen:Heur.MSIL.Krypt.6",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2021.5.0.7597",
          "result": "Gen:Heur.MSIL.Krypt.6 (B)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "34341",
          "result": "TrojWare.MSIL.Agent.kwb@4jcehz",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "F-Secure": {
          "category": "undetected",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.52.8270",
          "result": "BackDoor.Bifrost.19762",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "VIPRE": {
          "category": "malicious",
          "engine_name": "VIPRE",
          "engine_version": "98492",
          "result": "Trojan.MSIL.Injector.ch (v)",
          "method": "blacklist",
          "engine_update": "20220119"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "TROJ_GEN.R002C0DIG21",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee-GW-Edition": {
          "category": "malicious",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": "GenericRXCK-HW!263D55D86A53",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211026"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "1.4.1.0",
          "result": "Mal/Generic-R + Mal/MSIL-BU",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SentinelOne": {
          "category": "malicious",
          "engine_name": "SentinelOne",
          "engine_version": "7.2.0.1",
          "result": "Static AI - Malicious PE",
          "method": "blacklist",
          "engine_update": "20220201"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.32273B:27.26290",
          "result": "Gen:Heur.MSIL.Krypt.6",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "Trojan/MSIL.aem",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "eGambit": {
          "category": "malicious",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": "Trojan.Generic",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.12",
          "result": "TR/Dropper.Gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/Generic.ASMalwS.C3C626",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kingsoft": {
          "category": "undetected",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Gridinsoft": {
          "category": "undetected",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.72.174",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Arcabit": {
          "category": "malicious",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.889",
          "result": "Trojan.MSIL.Krypt.6",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ViRobot": {
          "category": "undetected",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ZoneAlarm": {
          "category": "malicious",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": "HEUR:Trojan.Win32.Generic",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "220210-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.18900.2",
          "result": "VirTool:MSIL/Injector.J",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220103"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.21.2.10258",
          "result": "Worm/Win32.RL_Palevo.C3993689",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Acronis": {
          "category": "undetected",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.82",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210512"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "5.0.0",
          "result": "Worm.Palevo",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": "Gen:Heur.MSIL.Krypt.6",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TACHYON": {
          "category": "malicious",
          "engine_name": "TACHYON",
          "engine_version": "2022-02-10.02",
          "result": "Worm/W32.DN-Palevo.114688",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Malwarebytes": {
          "category": "malicious",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.2.27",
          "result": "Trojan.Agent.SVC",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "21.1.5827.0",
          "result": "MSIL:Agent-IP [Trj]",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "2.2.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.27",
          "result": "Malware.Obfus/MSIL@AI.97 (RDM.MSIL:GGvm+OJR2yl2PbE9x95waA)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Yandex": {
          "category": "malicious",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": "Worm.P2P.Palevo!f932lPECe60",
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Trojan.Win32.Refroso",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "MaxSecure": {
          "category": "undetected",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "MSIL/AntiVM.V!tr",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "W32.Trojan.Palevo.Gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "21.1.5827.0",
          "result": "MSIL:Agent-IP [Trj]",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cybereason": {
          "category": "malicious",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": "malicious.86a537",
          "method": "blacklist",
          "engine_update": "20210330"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Generic Malware",
          "method": "blacklist",
          "engine_update": "20220210"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 4,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 0,
        "malicious": 57,
        "undetected": 13
      },
      "md5": "263d55d86a53753cdf179b61be79fa3a",
      "names": [
        "66666.exe",
        "b0ghukniv.dll",
        "mhp9neqi8.dll",
        "4vb8jpg8y.dll",
        "i0qujjty2.dll",
        "moxw9b8e5.dll",
        "jhikfhwrb.dll",
        "oohfxa5ur.dll",
        "hgh938rn2.dll",
        "63j30jnyx.dll",
        "5vm80yyrk.dll",
        "75c3tfbr3.dll",
        "lq1afil7o.dll",
        "e6ek6ssgf.dll",
        "bifruz9ha.dll",
        "gyxlxwi5t.dll",
        "rundll32 .exe",
        "jl233a9ll.dll",
        "VirusShare_263d55d86a53753cdf179b61be79fa3a",
        "myfile.exe",
        "263d55d86a53753cdf179b61be79fa3a",
        "test.txt",
        "263D55D86A53753CDF179B61BE79FA3A",
        "aa",
        "iQODNSMX.dll",
        "jb2LbPs8.vbs",
        "uUqb_Uo8wm.png",
        "a"
      ],
      "reputation": 0,
      "sha1": "703f01730832ae17106349bdd2ba9149e6f3ffe2",
      "sha256": "9b61103439b8a1658e33fb5703e4aadf6efdfa53a324dd37c2154a483860cf80",
      "sigma_analysis_stats": {
        "high": 4,
        "medium": 1,
        "critical": 0,
        "low": 0
      },
      "size": 114688,
      "type_description": "Win32 EXE",
      "type_extension": "exe",
      "type_tag": "peexe"
    },
    "8e1c569e1b6d7f33fe5c1f825452f395": {
      "last_analysis_results": {
        "Bkav": {
          "category": "malicious",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": "W32.AIDetect.malware1",
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "Lionic": {
          "category": "undetected",
          "engine_name": "Lionic",
          "engine_version": "4.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Elastic": {
          "category": "malicious",
          "engine_name": "Elastic",
          "engine_version": "4.0.32",
          "result": "malicious (high confidence)",
          "method": "blacklist",
          "engine_update": "20211223"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "GenPack:Generic.Kelvir.4487F92D",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": "Generic.mg.8e1c569e1b6d7f33",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "W32/Kelvir.d.dv",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cylance": {
          "category": "malicious",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": "Unsafe",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "VIPRE": {
          "category": "malicious",
          "engine_name": "VIPRE",
          "engine_version": "98492",
          "result": "Trojan.Win32.Generic!BT",
          "method": "blacklist",
          "engine_update": "20220119"
        },
        "Sangfor": {
          "category": "undetected",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211224"
        },
        "K7AntiVirus": {
          "category": "malicious",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.247.40759",
          "result": "Trojan ( 0055e3fb1 )",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "Worm:Win32/Kelvir.841e61f1",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "malicious",
          "engine_name": "K7GW",
          "engine_version": "11.247.40760",
          "result": "Trojan ( 0055e3fb1 )",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cybereason": {
          "category": "malicious",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": "malicious.e1b6d7",
          "method": "blacklist",
          "engine_update": "20210330"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "VirIT": {
          "category": "undetected",
          "engine_name": "VirIT",
          "engine_version": "9.5.130",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.5.1.2",
          "result": "W32/Kelvir.BPWG-1844",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.16.0.0",
          "result": "W32.Kelvir",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "24764",
          "result": "Win32/Bropia.BO",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "APEX": {
          "category": "malicious",
          "engine_name": "APEX",
          "engine_version": "6.259",
          "result": "Malicious",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Paloalto": {
          "category": "undetected",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ClamAV": {
          "category": "undetected",
          "engine_name": "ClamAV",
          "engine_version": "0.104.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "21.0.1.45",
          "result": "Packed.Win32.CryptExe.gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "GenPack:Generic.Kelvir.4487F92D",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25561",
          "result": "Trojan.Win32.Bropia.gwfb",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220205"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Bropia-Y [Wrm]",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Win32.Worm.Bropia.Ebhc",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.21.193",
          "result": "GenPack:Generic.Kelvir.4487F92D",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TACHYON": {
          "category": "malicious",
          "engine_name": "TACHYON",
          "engine_version": "2022-02-10.02",
          "result": "Worm/W32.Bropia.16847",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2021.5.0.7597",
          "result": "GenPack:Generic.Kelvir.4487F92D (B)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "34341",
          "result": "Worm.Win32.Bropia.BO@21vh",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "F-Secure": {
          "category": "undetected",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.52.8270",
          "result": "Trojan.Vbspreader",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4567",
          "result": "Worm.Bropia.Win32.32",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "WORM_KELVIR.BQ",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee-GW-Edition": {
          "category": "malicious",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": "BehavesLike.Win32.Infected.lh",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211026"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "1.4.1.0",
          "result": "Mal/Generic-S",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Worm.Win32.Bropia",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.32273B:27.26290",
          "result": "GenPack:Generic.Kelvir.4487F92D",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "IM-Worm.Bropia.m",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "Worm:Win32/Kelvir.CI",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.12",
          "result": "WORM/MSN.Kelvi.AI.2",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "eGambit": {
          "category": "confirmed-timeout",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/Generic.ASMalwS.382D84",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kingsoft": {
          "category": "malicious",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": "Win32.Troj.Unknown.c.(kcloud)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Gridinsoft": {
          "category": "malicious",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.72.174",
          "result": "Trojan.Heur!.032100A1",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Arcabit": {
          "category": "undetected",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.889",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ViRobot": {
          "category": "undetected",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ZoneAlarm": {
          "category": "undetected",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "220210-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.18900.2",
          "result": "Worm:Win32/Kelvir.CI",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.27",
          "result": "Malicious (score: 100)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220103"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.21.2.10258",
          "result": "Trojan/Win32.Pakes.C25467",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Acronis": {
          "category": "undetected",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.82",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210512"
        },
        "BitDefenderTheta": {
          "category": "malicious",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": "AI:Packer.1860526D1D",
          "method": "blacklist",
          "engine_update": "20220207"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": "GenPack:Generic.Kelvir.4487F92D",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "5.0.0",
          "result": "BScope.Worm.Bropia",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.2.27",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "2.2.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "WORM_KELVIR.BQ",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.27",
          "result": "Worm.IM.Bropia.k (CLOUD)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Yandex": {
          "category": "malicious",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": "Worm.Bropia!G8SVe2S8qQg",
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "SentinelOne": {
          "category": "malicious",
          "engine_name": "SentinelOne",
          "engine_version": "7.2.0.1",
          "result": "Static AI - Suspicious PE",
          "method": "blacklist",
          "engine_update": "20220201"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Trojan.Malware.1842714.susgen",
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "W32/Kelvir.AQ!worm.im",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Bropia-Y [Wrm]",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "W32/Bropia.AS.worm",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_70% (W)",
          "method": "blacklist",
          "engine_update": "20210907"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 4,
        "suspicious": 0,
        "confirmed-timeout": 1,
        "timeout": 0,
        "failure": 0,
        "malicious": 53,
        "undetected": 16
      },
      "md5": "8e1c569e1b6d7f33fe5c1f825452f395",
      "names": [
        "PowerVBSPREAD",
        "PowerVBSPREAD.exe",
        "3nakd36pm.dll",
        "1l88160vr.dll",
        "z4dct3cwn.dll",
        "3zucskslk.dll",
        "ogoxt0nu4.dll",
        "b4sfwmwsq.dll",
        "c1fcqxbam.dll",
        "3gwwy4hb3.dll",
        "t5lc40hmb.dll",
        "dylkewfez.dll",
        "f8ksvdne3.dll",
        "cjr6vzbok.dll",
        "bl1jhwwbc.dll",
        "nn823avv0.dll",
        "4mdh0zllq.dll",
        "24.exe",
        "qb0jecnzo.dll",
        "VirusShare_8e1c569e1b6d7f33fe5c1f825452f395",
        "malware (115).exe",
        "test.txt",
        "aa",
        "8e1c569e1b6d7f33fe5c1f825452f395",
        "6yKdW.dwg",
        "6IGd.lnk",
        "a",
        "OF7AJJ.exe"
      ],
      "reputation": 0,
      "sha1": "6c22eb571628e2b032a5abc97f4a33e8e85df3f8",
      "sha256": "b5c6e12450f28cfa8c61139698813a9faad17901997e2bf94de670c12dde0d50",
      "size": 16847,
      "type_description": "Win32 EXE",
      "type_extension": "exe",
      "type_tag": "peexe"
    },
    "7eec2cdf7d9256068d5a9590135b5d86": {
      "last_analysis_results": {
        "Bkav": {
          "category": "undetected",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "Lionic": {
          "category": "malicious",
          "engine_name": "Lionic",
          "engine_version": "4.2",
          "result": "Trojan.Win32.Agent.a!c",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Elastic": {
          "category": "malicious",
          "engine_name": "Elastic",
          "engine_version": "4.0.32",
          "result": "malicious (high confidence)",
          "method": "blacklist",
          "engine_update": "20211223"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.27",
          "result": "Malicious (score: 100)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": "Generic.mg.7eec2cdf7d925606",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "Downloader-AAQ",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cylance": {
          "category": "malicious",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": "Unsafe",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4567",
          "result": "Downloader.Agent.Win32.12010",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": "Trojan.Win32.Agent.lb",
          "method": "blacklist",
          "engine_update": "20211224"
        },
        "K7AntiVirus": {
          "category": "malicious",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.247.40759",
          "result": "Trojan ( 0040f8b51 )",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefender": {
          "category": "timeout",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "K7GW": {
          "category": "malicious",
          "engine_name": "K7GW",
          "engine_version": "11.247.40760",
          "result": "Trojan ( 0040f8b51 )",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_100% (W)",
          "method": "blacklist",
          "engine_update": "20210907"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "VirIT": {
          "category": "undetected",
          "engine_name": "VirIT",
          "engine_version": "9.5.131",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.5.1.2",
          "result": "W32/Downloader.VIHM-5927",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.16.0.0",
          "result": "ML.Attribute.HighConfidence",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "24764",
          "result": "Win32/TrojanDownloader.Agent.LB",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "APEX": {
          "category": "malicious",
          "engine_name": "APEX",
          "engine_version": "6.259",
          "result": "Malicious",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Paloalto": {
          "category": "malicious",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": "generic.ml",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ClamAV": {
          "category": "undetected",
          "engine_name": "ClamAV",
          "engine_version": "0.104.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "21.0.1.45",
          "result": "Trojan-Downloader.Win32.Agent.lb",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "TrojanDownloader:Win32/DownLdr.7a00cade",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25561",
          "result": "Trojan.Win32.Agent.dagi",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220205"
        },
        "MicroWorld-eScan": {
          "category": "timeout",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Malware-gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Win32.Trojan-downloader.Agent.Angm",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ad-Aware": {
          "category": "timeout",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.21.193",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Emsisoft": {
          "category": "timeout",
          "engine_name": "Emsisoft",
          "engine_version": "2021.5.0.7597",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "34341",
          "result": "TrojWare.Win32.TrojanDownloader.Agent.LB@v3r",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "F-Secure": {
          "category": "undetected",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.52.8270",
          "result": "Trojan.PWS.Hangame",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "VIPRE": {
          "category": "malicious",
          "engine_name": "VIPRE",
          "engine_version": "98492",
          "result": "Trojan.Win32.Generic!BT",
          "method": "blacklist",
          "engine_update": "20220119"
        },
        "TrendMicro": {
          "category": "undetected",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee-GW-Edition": {
          "category": "timeout",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211026"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "1.4.1.0",
          "result": "Troj/DownLdr-RJ",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SentinelOne": {
          "category": "malicious",
          "engine_name": "SentinelOne",
          "engine_version": "7.2.0.1",
          "result": "Static AI - Malicious PE",
          "method": "blacklist",
          "engine_update": "20220201"
        },
        "GData": {
          "category": "timeout",
          "engine_name": "GData",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "TrojanDownloader.Agent.hol",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "eGambit": {
          "category": "malicious",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": "Generic.Downloader",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.12",
          "result": "TR/Dldr.Agent.gcnds",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/Generic.ASMalwS.F13DCE",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kingsoft": {
          "category": "undetected",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Gridinsoft": {
          "category": "undetected",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.72.174",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Arcabit": {
          "category": "undetected",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.889",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ViRobot": {
          "category": "undetected",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ZoneAlarm": {
          "category": "undetected",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "220210-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.18900.2",
          "result": "TrojanDownloader:Win32/Tearspear!gmb",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TACHYON": {
          "category": "undetected",
          "engine_name": "TACHYON",
          "engine_version": "2022-02-10.02",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220103"
        },
        "AhnLab-V3": {
          "category": "undetected",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.21.2.10258",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Acronis": {
          "category": "undetected",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.82",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210512"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "5.0.0",
          "result": "suspected of Trojan-Downloader.Agent.145",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ALYac": {
          "category": "timeout",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=94)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefenderTheta": {
          "category": "timeout",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220207"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.2.27",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "2.2.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TrendMicro-HouseCall": {
          "category": "undetected",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.27",
          "result": "Trojan.DL.Agent.afy (CLOUD)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Yandex": {
          "category": "undetected",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Trojan-Downloader.Win32.Agent",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "MaxSecure": {
          "category": "undetected",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "W32/Agent.LB!tr",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "W32.Trojan.2nd-thought",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "21.1.5827.0",
          "result": "Win32:Malware-gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cybereason": {
          "category": "malicious",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": "malicious.f7d925",
          "method": "blacklist",
          "engine_update": "20210330"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Trj/Genetic.gen",
          "method": "blacklist",
          "engine_update": "20220210"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 4,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 8,
        "failure": 0,
        "malicious": 40,
        "undetected": 22
      },
      "md5": "7eec2cdf7d9256068d5a9590135b5d86",
      "names": [
        "vy2x8s6k4.dll",
        "8j095jtee.dll",
        "5awq2028t.dll",
        "salgwmx96.dll",
        "4686d86s8.dll",
        "j6hsror4u.dll",
        "4wv0llnor.dll",
        "a9ddwqs19.dll",
        "g2cgh0pjr.dll",
        "tjjsz37aw.dll",
        "c3mc5sht9.dll",
        "0kmg7osv7.dll",
        "gdvibs02i.dll",
        "yhwx1x5n3.dll",
        "x59taax3i.dll",
        "2mw7gjpl1.dll",
        "VirusShare_7eec2cdf7d9256068d5a9590135b5d86",
        "test.txt",
        "aa",
        "7eec2cdf7d9256068d5a9590135b5d86",
        "YEEJ.drv",
        "KN3g.jar",
        "a",
        "KZTVTJ.exe"
      ],
      "reputation": 0,
      "sha1": "dc5db51c1527ebca21beff628dbc9ad0eccefcf2",
      "sha256": "d66fb8ccf614657bd9facbad55a08b457c00dc067d7e69675f0adfbe07dbfd3d",
      "size": 40960,
      "type_description": "Win32 EXE",
      "type_extension": "exe",
      "type_tag": "peexe"
    },
    "8c1363154716763edf6ea771607ee98e": {
      "last_analysis_results": {
        "Bkav": {
          "category": "undetected",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Lionic": {
          "category": "malicious",
          "engine_name": "AegisLab",
          "engine_version": "4.2",
          "result": "Trojan.BAT.DelSys.4!c",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "BAT.Trojan.DelSys.H",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.31.0.0",
          "result": "BAT.Trojan.DelSys.H",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "Bat/mkd24",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "3.6.4.335",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "VIPRE": {
          "category": "undetected",
          "engine_name": "VIPRE",
          "engine_version": "84958",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Paloalto": {
          "category": "type-unsupported",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "1.0",
          "result": "Malware",
          "method": "blacklist",
          "engine_update": "20200423"
        },
        "K7AntiVirus": {
          "category": "undetected",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.120.34596",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Alibaba": {
          "category": "type-unsupported",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "undetected",
          "engine_name": "K7GW",
          "engine_version": "11.120.34596",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Trustlook": {
          "category": "failure",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Invincea": {
          "category": "type-unsupported",
          "engine_name": "Invincea",
          "engine_version": "6.3.6.26157",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200502"
        },
        "Baidu": {
          "category": "malicious",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": "BAT.Trojan.DelSys.i",
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "Cyren": {
          "category": "undetected",
          "engine_name": "Cyren",
          "engine_version": "6.3.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200701"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.11.0.0",
          "result": "Trojan Horse",
          "method": "blacklist",
          "engine_update": "20200703"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "21600",
          "result": "BAT/DelSys.G",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "APEX": {
          "category": "type-unsupported",
          "engine_name": "APEX",
          "engine_version": "6.44",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "BAT_DELSYS.G",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Avast": {
          "category": "malicious",
          "engine_name": "Avast",
          "engine_version": "18.4.3895.0",
          "result": "BV:Op-A [Trj]",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "ClamAV": {
          "category": "malicious",
          "engine_name": "ClamAV",
          "engine_version": "0.102.3.0",
          "result": "Win.Trojan.DelSys-7",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "15.0.1.13",
          "result": "Trojan.BAT.DelSys.g",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "BAT.Trojan.DelSys.H",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.134.25119",
          "result": "Trojan.Script.DelSys.euih",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200703"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Bat.Trojan.Delsys.Eanb",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.5.370",
          "result": "BAT.Trojan.DelSys.H",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "4.98.0",
          "result": "Troj/DelSys-H",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "32596",
          "result": "Malware@#3lqlwuzcgtwaq",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "F-Secure": {
          "category": "undetected",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.46.3050",
          "result": "Trojan.DelSys",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4123",
          "result": "Trojan.DelSys.BAT.2",
          "method": "blacklist",
          "engine_update": "20200703"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "BAT_DELSYS.G",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "McAfee-GW-Edition": {
          "category": "failure",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "SentinelOne": {
          "category": "type-unsupported",
          "engine_name": "SentinelOne",
          "engine_version": "4.3.0.105",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200601"
        },
        "Trapmine": {
          "category": "type-unsupported",
          "engine_name": "Trapmine",
          "engine_version": "3.5.0.987",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200619"
        },
        "CMC": {
          "category": "malicious",
          "engine_name": "CMC",
          "engine_version": "2.7.2019.1",
          "result": "Generic.Win32.8c13631547!MD",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2018.12.0.1641",
          "result": "BAT.Trojan.DelSys.H (B)",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Trojan.BAT.DelSys",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "F-Prot": {
          "category": "malicious",
          "engine_name": "F-Prot",
          "engine_version": "4.7.1.166",
          "result": "Trojan!7168",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "Trojan/BAT.DelSys.g",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Webroot": {
          "category": "type-unsupported",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Avira": {
          "category": "undetected",
          "engine_name": "Avira",
          "engine_version": "8.3.3.8",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "eGambit": {
          "category": "type-unsupported",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/BAT.DelSys.g",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Kingsoft": {
          "category": "undetected",
          "engine_name": "Kingsoft",
          "engine_version": "2013.8.14.323",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.17200.2",
          "result": "Trojan:BAT/Delsys.G",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Endgame": {
          "category": "type-unsupported",
          "engine_name": "Endgame",
          "engine_version": "4.0.5",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200608"
        },
        "Arcabit": {
          "category": "malicious",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.877",
          "result": "BAT.Trojan.DelSys.H",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "ViRobot": {
          "category": "malicious",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": "BAT.S.DelSys.497",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "ZoneAlarm": {
          "category": "malicious",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": "Trojan.BAT.DelSys.g",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Avast-Mobile": {
          "category": "undetected",
          "engine_name": "Avast-Mobile",
          "engine_version": "200704-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.26119B:27.19327",
          "result": "BAT.Trojan.DelSys.H",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Cynet": {
          "category": "undetected",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.24",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200628"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.18.0.10009",
          "result": "BAT/Delsys.G",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Acronis": {
          "category": "type-unsupported",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.76",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200603"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.1.5",
          "result": "BAT.Trojan.DelSys.H",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "4.4.1",
          "result": "Trojan.BAT.DelSys.g",
          "method": "blacklist",
          "engine_update": "20200702"
        },
        "Cylance": {
          "category": "type-unsupported",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "0.0.0.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200703"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.26",
          "result": "BAT.DelSys.g (CLASSIC)",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Yandex": {
          "category": "malicious",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": "Trojan.BAT.WinKiller.G",
          "method": "blacklist",
          "engine_update": "20200703"
        },
        "TACHYON": {
          "category": "undetected",
          "engine_name": "TACHYON",
          "engine_version": "2020-07-04.02",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "MaxSecure": {
          "category": "undetected",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200622"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "BAT/DelSys.G!tr",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "BitDefenderTheta": {
          "category": "undetected",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20200624"
        },
        "AVG": {
          "category": "malicious",
          "engine_name": "AVG",
          "engine_version": "18.4.3895.0",
          "result": "BV:Op-A [Trj]",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "Cybereason": {
          "category": "type-unsupported",
          "engine_name": "Cybereason",
          "engine_version": null,
          "result": null,
          "method": "blacklist",
          "engine_update": "20180308"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Backdoor Program",
          "method": "blacklist",
          "engine_update": "20200704"
        },
        "CrowdStrike": {
          "category": "type-unsupported",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190702"
        },
        "Qihoo-360": {
          "category": "malicious",
          "engine_name": "Qihoo-360",
          "engine_version": "1.0.0.1120",
          "result": "Malware.Radar01.Gen",
          "method": "blacklist",
          "engine_update": "20200704"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 14,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 2,
        "malicious": 42,
        "undetected": 17
      },
      "md5": "8c1363154716763edf6ea771607ee98e",
      "names": [
        "m7yruymhf.dll",
        "b17q5u9is.dll",
        "zcy5xd24k.dll",
        "p2tovd1nq.dll",
        "229u9l1bw.dll",
        "em7tgqvap.dll",
        "uyskp04ps.dll",
        "tyif60fcq.dll",
        "agsfxc2hf.dll",
        "ynndwe2z3.dll",
        "60cmcvct0.dll",
        "g2qtwbigg.dll",
        "pg6hklhrw.dll",
        "97ow7966s.dll",
        "e7huch2lx.dll",
        "Trojan.BAT.DelSys.g",
        "VirusShare_8c1363154716763edf6ea771607ee98e",
        "8c1363154716763edf6ea771607ee98e",
        "8c1363154716763edf6ea771607ee98e3c9842f6c5b06dc2e703570a3f2cc5816547578e497.exe",
        "test.txt",
        "8C1363154716763EDF6EA771607EE98E.bin",
        "aa",
        "uPfG83XJ.js",
        "AT1MO8t7g.fon",
        "e0ix.reg",
        "a"
      ],
      "reputation": 0,
      "sha1": "3c9842f6c5b06dc2e703570a3f2cc5816547578e",
      "sha256": "77005bddc4b2caf3bc4c1d53428fdbdcdaf36b124ad72a6139bb5ea4fb0e9460",
      "size": 497,
      "type_description": "Text",
      "type_extension": "txt",
      "type_tag": "text"
    },
    "329a93eff171caa03de136a732ac983e": {
      "last_analysis_results": {
        "Bkav": {
          "category": "undetected",
          "engine_name": "Bkav",
          "engine_version": "1.3.0.9899",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "Lionic": {
          "category": "undetected",
          "engine_name": "Lionic",
          "engine_version": "4.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Elastic": {
          "category": "malicious",
          "engine_name": "Elastic",
          "engine_version": "4.0.32",
          "result": "malicious (high confidence)",
          "method": "blacklist",
          "engine_update": "20211223"
        },
        "MicroWorld-eScan": {
          "category": "malicious",
          "engine_name": "MicroWorld-eScan",
          "engine_version": "14.0.409.0",
          "result": "Gen:Variant.Taterf.20",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "FireEye": {
          "category": "malicious",
          "engine_name": "FireEye",
          "engine_version": "32.44.1.0",
          "result": "Generic.mg.329a93eff171caa0",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CAT-QuickHeal": {
          "category": "undetected",
          "engine_name": "CAT-QuickHeal",
          "engine_version": "14.00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee": {
          "category": "malicious",
          "engine_name": "McAfee",
          "engine_version": "6.0.6.653",
          "result": "Artemis!329A93EFF171",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cylance": {
          "category": "malicious",
          "engine_name": "Cylance",
          "engine_version": "2.3.1.101",
          "result": "Unsafe",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zillya": {
          "category": "malicious",
          "engine_name": "Zillya",
          "engine_version": "2.0.0.4567",
          "result": "Trojan.Vaklik.Win32.3094",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Sangfor": {
          "category": "malicious",
          "engine_name": "Sangfor",
          "engine_version": "2.9.0.0",
          "result": "Suspicious.Win32.Save.a",
          "method": "blacklist",
          "engine_update": "20211224"
        },
        "K7AntiVirus": {
          "category": "undetected",
          "engine_name": "K7AntiVirus",
          "engine_version": "11.247.40759",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Alibaba": {
          "category": "malicious",
          "engine_name": "Alibaba",
          "engine_version": "0.3.0.5",
          "result": "Worm:Win32/Taterf.bc0a0eab",
          "method": "blacklist",
          "engine_update": "20190527"
        },
        "K7GW": {
          "category": "undetected",
          "engine_name": "K7GW",
          "engine_version": "11.247.40760",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CrowdStrike": {
          "category": "malicious",
          "engine_name": "CrowdStrike",
          "engine_version": "1.0",
          "result": "win/malicious_confidence_70% (W)",
          "method": "blacklist",
          "engine_update": "20210907"
        },
        "BitDefenderTheta": {
          "category": "malicious",
          "engine_name": "BitDefenderTheta",
          "engine_version": "7.2.37796.0",
          "result": "Gen:NN.ZedlaF.34212.fG4ba4CUlMl",
          "method": "blacklist",
          "engine_update": "20220207"
        },
        "VirIT": {
          "category": "undetected",
          "engine_name": "VirIT",
          "engine_version": "9.5.130",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cyren": {
          "category": "malicious",
          "engine_name": "Cyren",
          "engine_version": "6.5.1.2",
          "result": "W32/OnlineGames.FW.gen!Eldorado",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SymantecMobileInsight": {
          "category": "type-unsupported",
          "engine_name": "SymantecMobileInsight",
          "engine_version": "2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Symantec": {
          "category": "malicious",
          "engine_name": "Symantec",
          "engine_version": "1.16.0.0",
          "result": "ML.Attribute.HighConfidence",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ESET-NOD32": {
          "category": "malicious",
          "engine_name": "ESET-NOD32",
          "engine_version": "24764",
          "result": "a variant of Win32/PSW.OnLineGames.PJZ",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Baidu": {
          "category": "undetected",
          "engine_name": "Baidu",
          "engine_version": "1.0.0.2",
          "result": null,
          "method": "blacklist",
          "engine_update": "20190318"
        },
        "APEX": {
          "category": "malicious",
          "engine_name": "APEX",
          "engine_version": "6.259",
          "result": "Malicious",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Paloalto": {
          "category": "malicious",
          "engine_name": "Paloalto",
          "engine_version": "1.0",
          "result": "generic.ml",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ClamAV": {
          "category": "undetected",
          "engine_name": "ClamAV",
          "engine_version": "0.104.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kaspersky": {
          "category": "malicious",
          "engine_name": "Kaspersky",
          "engine_version": "21.0.1.45",
          "result": "HEUR:Trojan.Win32.Generic",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefender": {
          "category": "malicious",
          "engine_name": "BitDefender",
          "engine_version": "7.2",
          "result": "Gen:Variant.Taterf.20",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "NANO-Antivirus": {
          "category": "malicious",
          "engine_name": "NANO-Antivirus",
          "engine_version": "1.0.146.25561",
          "result": "Trojan.Win32.Vaklik.fvfao",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "SUPERAntiSpyware": {
          "category": "undetected",
          "engine_name": "SUPERAntiSpyware",
          "engine_version": "5.6.0.1032",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220205"
        },
        "Tencent": {
          "category": "malicious",
          "engine_name": "Tencent",
          "engine_version": "1.0.0.1",
          "result": "Win32.Trojan-gamethief.Onlinegames.Ljao",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ad-Aware": {
          "category": "malicious",
          "engine_name": "Ad-Aware",
          "engine_version": "3.0.21.193",
          "result": "Gen:Variant.Taterf.20",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Trustlook": {
          "category": "type-unsupported",
          "engine_name": "Trustlook",
          "engine_version": "1.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TACHYON": {
          "category": "malicious",
          "engine_name": "TACHYON",
          "engine_version": "2022-02-10.02",
          "result": "Trojan/W32.Vaklik.83456.B",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Emsisoft": {
          "category": "malicious",
          "engine_name": "Emsisoft",
          "engine_version": "2021.5.0.7597",
          "result": "Gen:Variant.Taterf.20 (B)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Comodo": {
          "category": "malicious",
          "engine_name": "Comodo",
          "engine_version": "34341",
          "result": "Malware@#v489x4ibym74",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "F-Secure": {
          "category": "undetected",
          "engine_name": "F-Secure",
          "engine_version": "12.0.86.52",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "DrWeb": {
          "category": "malicious",
          "engine_name": "DrWeb",
          "engine_version": "7.0.52.8270",
          "result": "Trojan.Vanti.536",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "VIPRE": {
          "category": "malicious",
          "engine_name": "VIPRE",
          "engine_version": "98492",
          "result": "Trojan.Win32.Generic!BT",
          "method": "blacklist",
          "engine_update": "20220119"
        },
        "TrendMicro": {
          "category": "malicious",
          "engine_name": "TrendMicro",
          "engine_version": "11.0.0.1006",
          "result": "TROJ_GEN.R002C0DA722",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "McAfee-GW-Edition": {
          "category": "malicious",
          "engine_name": "McAfee-GW-Edition",
          "engine_version": "v2019.1.2+3728",
          "result": "BehavesLike.Win32.Generic.mc",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "CMC": {
          "category": "undetected",
          "engine_name": "CMC",
          "engine_version": "2.10.2019.1",
          "result": null,
          "method": "blacklist",
          "engine_update": "20211026"
        },
        "Sophos": {
          "category": "malicious",
          "engine_name": "Sophos",
          "engine_version": "1.4.1.0",
          "result": "ML/PE-A + Troj/Virtum-Gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Ikarus": {
          "category": "malicious",
          "engine_name": "Ikarus",
          "engine_version": "0.1.5.2",
          "result": "Virus.Win32.Virut",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "GData": {
          "category": "malicious",
          "engine_name": "GData",
          "engine_version": "A:25.32273B:27.26290",
          "result": "Gen:Variant.Taterf.20",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Jiangmin": {
          "category": "malicious",
          "engine_name": "Jiangmin",
          "engine_version": "16.0.100",
          "result": "Trojan/Vaklik.eks",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "eGambit": {
          "category": "malicious",
          "engine_name": "eGambit",
          "engine_version": null,
          "result": "Generic.Malware",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avira": {
          "category": "malicious",
          "engine_name": "Avira",
          "engine_version": "8.3.3.12",
          "result": "TR/Crypt.ASPM.Gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Antiy-AVL": {
          "category": "malicious",
          "engine_name": "Antiy-AVL",
          "engine_version": "3.0.0.1",
          "result": "Trojan/Generic.ASMalwS.C474AD",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Kingsoft": {
          "category": "malicious",
          "engine_name": "Kingsoft",
          "engine_version": "2017.9.26.565",
          "result": "Win32.Heur.KVM008.a.(kcloud)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Gridinsoft": {
          "category": "undetected",
          "engine_name": "Gridinsoft",
          "engine_version": "1.0.72.174",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Arcabit": {
          "category": "undetected",
          "engine_name": "Arcabit",
          "engine_version": "1.0.0.889",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ViRobot": {
          "category": "malicious",
          "engine_name": "ViRobot",
          "engine_version": "2014.3.20.0",
          "result": "Trojan.Win32.Z.Vaklik.83456",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ZoneAlarm": {
          "category": "malicious",
          "engine_name": "ZoneAlarm",
          "engine_version": "1.0",
          "result": "HEUR:Trojan.Win32.Generic",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Avast-Mobile": {
          "category": "type-unsupported",
          "engine_name": "Avast-Mobile",
          "engine_version": "220210-00",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Microsoft": {
          "category": "malicious",
          "engine_name": "Microsoft",
          "engine_version": "1.1.18900.2",
          "result": "Worm:Win32/Taterf.gen!E",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cynet": {
          "category": "malicious",
          "engine_name": "Cynet",
          "engine_version": "4.0.0.27",
          "result": "Malicious (score: 100)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "BitDefenderFalx": {
          "category": "type-unsupported",
          "engine_name": "BitDefenderFalx",
          "engine_version": "2.0.936",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220103"
        },
        "AhnLab-V3": {
          "category": "malicious",
          "engine_name": "AhnLab-V3",
          "engine_version": "3.21.2.10258",
          "result": "Win-Trojan/OnlineGameHack93.Gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Acronis": {
          "category": "undetected",
          "engine_name": "Acronis",
          "engine_version": "1.1.1.82",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210512"
        },
        "VBA32": {
          "category": "malicious",
          "engine_name": "VBA32",
          "engine_version": "5.0.0",
          "result": "Trojan.Vaklik",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "ALYac": {
          "category": "malicious",
          "engine_name": "ALYac",
          "engine_version": "1.1.3.1",
          "result": "Gen:Variant.Taterf.20",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "MAX": {
          "category": "malicious",
          "engine_name": "MAX",
          "engine_version": "2019.9.16.1",
          "result": "malware (ai score=100)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Malwarebytes": {
          "category": "undetected",
          "engine_name": "Malwarebytes",
          "engine_version": "4.2.2.27",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Zoner": {
          "category": "undetected",
          "engine_name": "Zoner",
          "engine_version": "2.2.2.0",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "TrendMicro-HouseCall": {
          "category": "malicious",
          "engine_name": "TrendMicro-HouseCall",
          "engine_version": "10.0.0.1040",
          "result": "TROJ_GEN.R002C0DA722",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Rising": {
          "category": "malicious",
          "engine_name": "Rising",
          "engine_version": "25.0.0.27",
          "result": "Stealer.OnLineGames!8.131 (TFE:5:xnBHLSyqB7D)",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Yandex": {
          "category": "undetected",
          "engine_name": "Yandex",
          "engine_version": "5.5.2.24",
          "result": null,
          "method": "blacklist",
          "engine_update": "20220209"
        },
        "SentinelOne": {
          "category": "malicious",
          "engine_name": "SentinelOne",
          "engine_version": "7.2.0.1",
          "result": "Static AI - Malicious PE",
          "method": "blacklist",
          "engine_update": "20220201"
        },
        "MaxSecure": {
          "category": "malicious",
          "engine_name": "MaxSecure",
          "engine_version": "1.0.0.1",
          "result": "Trojan.Malware.2394566.susgen",
          "method": "blacklist",
          "engine_update": "20220208"
        },
        "Fortinet": {
          "category": "malicious",
          "engine_name": "Fortinet",
          "engine_version": "6.2.142.0",
          "result": "W32/Virtum!tr",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Webroot": {
          "category": "malicious",
          "engine_name": "Webroot",
          "engine_version": "1.0.0.403",
          "result": "W32.Trojan.Gen",
          "method": "blacklist",
          "engine_update": "20220210"
        },
        "Cybereason": {
          "category": "type-unsupported",
          "engine_name": "Cybereason",
          "engine_version": "1.2.449",
          "result": null,
          "method": "blacklist",
          "engine_update": "20210330"
        },
        "Panda": {
          "category": "malicious",
          "engine_name": "Panda",
          "engine_version": "4.6.4.2",
          "result": "Trj/Genetic.gen",
          "method": "blacklist",
          "engine_update": "20220210"
        }
      },
      "last_analysis_stats": {
        "harmless": 0,
        "type-unsupported": 5,
        "suspicious": 0,
        "confirmed-timeout": 0,
        "timeout": 0,
        "failure": 0,
        "malicious": 50,
        "undetected": 17
      },
      "md5": "329a93eff171caa03de136a732ac983e",
      "names": [
        "4h3x1vnia.dll",
        "bhd9mqlov.dll",
        "jmavwxajk.dll",
        "2eqy2kxix.dll",
        "aj8i4bmt1.dll",
        "fpqai78on.dll",
        "7ormi7qss.dll",
        "irbmwy26o.dll",
        "zd3nzvq7b.dll",
        "rsqwqo74v.dll",
        "pszs6ok3v.dll",
        "0bt2vc30s.dll",
        "waayh65i4.dll",
        "a1xb4ph85.dll",
        "1pp9azi4m.dll",
        "9rn7fou9n.dll",
        "VirusShare_329a93eff171caa03de136a732ac983e",
        "329a93eff171caa03de136a732ac983e",
        "test.txt",
        "1",
        "FA07D8A900027357467501B4356CEE007DDE8134.dll",
        "aa",
        "Vis7.cpl",
        "YTfTXjw.chm",
        "a"
      ],
      "reputation": -8,
      "sha1": "e3678a20f6b81f25fa7499f8c5ffdf140b5d41f3",
      "sha256": "94b1ce2b188794bd65ee7a49662429e81ad10ac1588494069265e831138c8216",
      "size": 83456,
      "type_description": "Win32 DLL",
      "type_extension": "dll",
      "type_tag": "pedll"
    }
}