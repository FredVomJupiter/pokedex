// Current Pokemon that is fetched from server is stored here (one after another).
let currentPokemon;

// Collects all pokemon that were fetched.
let pokemons = [];


/**
 * Onclick function of loadbtn in index.html that loads the remaining pokemon if user clickes on it.
 */
function loadMore() {
    if (pokemons.length < 22) {
        let loadbtn = document.getElementById('loadbtn');
        loadbtn.innerHTML = "loading completed";
        pokemons = [];
        playSound(click);
        getPokemons(151);
    } else {
        playSound(cancel);
    }
}

/**
 * 
 * @param {*} amountOfPokemons as integer.
 */
async function getPokemons(amountOfPokemons) {
    hideCanvas();
    showLoadingScreen();
    for (let i = 1; i < amountOfPokemons + 1; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        pokemons.push(currentPokemon);
        renderPokemon(currentPokemon, i);
    }
    hideLoadingScreen();
    showCanvas();
}


function showLoadingScreen() {
    let loading = document.getElementById('loading');
    loading.classList.remove('d-none');
}


function hideLoadingScreen() {
    let loading = document.getElementById('loading');
    loading.classList.add('d-none');
}


function hideCanvas() {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    canvas.classList.add('d-none');
}


function showCanvas() {
    let canvas = document.getElementById('canvas');
    canvas.classList.remove('d-none');
}


function renderPokemon(currentPokemon, id) {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML += templateHTML(currentPokemon, id);
    changeTypeColor(currentPokemon, id);
}


function templateHTML(currentPokemon, id) {
    return `
        <div class="wrap">
            <div class="card" id="card${id}" onclick="showPokemon(${id})" onmouseover="changeColor('${currentPokemon.types[0].type.name}', ${id})">
                <span>#${id}<br><b>${currentPokemon.name.toUpperCase()}</b></span>
                <img style="height:150px;object-fit:contain;" src="${currentPokemon.sprites.front_default}">
                <div class="type" id="types${id}">${currentPokemon.types[0].type.name.toUpperCase()}</div>
            </div>
        </div>
    `;
}

/**
 * 
 * @param {*} currentPokemon 
 * @param {*} index of the moves array from Pokedex API.
 * @returns either the name of the current Pokemon's move at a given index or nothing.
 */
function checkAbility(currentPokemon, index) {
    if (currentPokemon.moves[index]) {
        return `${currentPokemon.moves[index].move.name}`;
    } else {
        return '';
    }
}

/**
 * Changes the color of a Pokemon's type on the card depending on the typeName
 * @param {*} currentPokemon 
 * @param {*} id 
 */
function changeTypeColor(currentPokemon, id) {
    let type = currentPokemon.types[0].type.name;
    let typeId = document.getElementById(`types${id}`);
    if (type == "grass" | type == "poison") typeId.style.background = 'lightgreen';
    else if (type == "fire" | type == "dragon") typeId.style.background = 'lightcoral';
    else if (type == "water" | type == "ice") typeId.style.background = 'lightskyblue';
    else if (type == "normal" | type == "rock") typeId.style.background = '#ccc';
    else if (type == "bug" | type == "ground") typeId.style.background = 'burlywood';
    else if (type == "electric") typeId.style.background = 'yellow';
    else if (type == "fairy") typeId.style.background = 'pink';
    else if (type == "psychic" | type == "ghost" | type == "fighting") typeId.style.background = 'violet';
}

/**
 * User hovers over a card, then card changes color to corresponding pokemon-type.
 * @param {*} type 
 * @param {*} id 
 */
function changeColor(type, id) {
    let card = document.getElementById(`card${id}`);
    if (type == "grass" | type == "poison") card.classList.add('green-card');
    else if (type == "fire" | type == "dragon") card.classList.add('red-card');
    else if (type == "water" | type == "ice") card.classList.add('blue-card');
    else if (type == "normal" | type == "rock") card.classList.add('grey-card');
    else if (type == "bug" | type == "ground") card.classList.add('brown-card');
    else if (type == "electric") card.classList.add('yellow-card');
    else if (type == "fairy") card.classList.add('pink-card');
    else if (type == "psychic" | type == "ghost" | type == "fighting") card.classList.add('violet-card');
}

/**
 * Rendering process of a single large pokemon card when user clicks on a corresponding small pokemon card.
 * @param {*} id as integer.
 */
function showPokemon(id) {
    playSound(click);
    playSound(soundtrack);
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    let miniCanvas = document.getElementById('miniCanvas');
    miniCanvas.innerHTML = '';
    miniCanvas.innerHTML = renderSinglePokemon(id);;
}

/**
 * This is a html template auxiliary function called by the showPokemon(id) function.
 * @param {*} id as integer.
 * @returns html template of a single large pokemon card.
 */
function renderSinglePokemon(id) {
    return `
        <div class="wrap-nohover">
            <div class="card-nohover" id="card${id}">
                <div style="display:flex;justify-content:space-between;">
                    <span>#${id}<br><b>${pokemons[id - 1].name.toUpperCase()}</b></span>
                    <button class="btn" id="closebtn" onclick="hideOverlay(event)" style="align-self:end;width:50px;height:40px;margin-top:0;">X</button>
                </div>
                <img id="img${id}" style="height:150px;object-fit:contain;" src="${pokemons[id - 1].sprites.front_default}">
                <div class="stats">health <div class="outer"><div class="inner" style="width:${pokemons[id - 1].stats[0].base_stat}px;">${pokemons[id - 1].stats[0].base_stat}/100</div></div></div>
                <div class="stats">attack <div class="outer"><div class="inner" style="width:${pokemons[id - 1].stats[1].base_stat}px;">${pokemons[id - 1].stats[1].base_stat}/100</div></div></div>
                <div class="stats">defense <div class="outer"><div class="inner" style="width:${pokemons[id - 1].stats[2].base_stat}px;">${pokemons[id - 1].stats[2].base_stat}/100</div></div></div>
                <div class="stats">speed <div class="outer"><div class="inner" style="width:${pokemons[id - 1].stats[5].base_stat}px;">${pokemons[id - 1].stats[5].base_stat}/100</div></div></div>
                <button class="btn" onclick="startFight(event, ${id})">select Champion</button>
            </div>
        </div>
    `;
}

/**
 * This function is called when unser clicks on "select Champion" on the large pokemon card.
 * The fight sequence starts here -> playing sounds, starting effects, opening the arena and
 * preventing user to close the arena during this several second long process.
 * @param {*} event as propagation.
 * @param {*} id as integer.
 */
function startFight(event, id) {
    event.stopPropagation();
    preventUserClosingArenaDuringOpening();
    playSound(click);
    playSound(fight);
    rotatePokemon(id);
    pauseSoundAndOpenArena(id);
}

/**
 * Auxiliary function for startFight that removes the onclick
 * functionalities of the overlay and the close button.
 */
function preventUserClosingArenaDuringOpening() {
    let overlay = document.getElementById('overlay');
    overlay.setAttribute('onclick', '');
    let closebtn = document.getElementById('closebtn')
    closebtn.setAttribute('onclick', '');
}

/**
 * Auxiliary function for timeout-functions in startFight.
 */
function pauseSoundAndOpenArena(id) {
    setTimeout(function () {
        pauseSound(soundtrack);
    }, 1000);
    setTimeout(function () {
        openArena(id);
    }, 3000);
}

/**
 * Lets the selected Pokemon rotate as defined in style.css (.rotate).
 * @param {*} id as integer.
 */
function rotatePokemon(id) {
    let image = document.getElementById(`img${id}`);
    image.classList.add('rotate');
}

/**
 * Hiding the overlay with a delay by shrinking it.
 * @param {*} event as propagation.
 */
function hideOverlayDelayed(event) {
    if (event) event.stopPropagation();
    let overlay = document.getElementById('overlay');
    let arena = document.getElementById('arena');
    overlayTimeout(overlay, arena);
    arena.classList.remove('big');
    arena.classList.add('small');
    arena.innerHTML = '';
    pauseSound(fight);
    overlay.setAttribute('onclick', 'hideOverlay();');
}

/**
 * 
 * @param {*} overlay 
 * @param {*} arena as arena object.
 */
function overlayTimeout(overlay, arena) {
    let miniCanvas = document.getElementById('miniCanvas');
    setTimeout(function () {
        overlay.classList.add('d-none');
        arena.classList.remove('d-flex');
        arena.classList.add('d-none');
        miniCanvas.classList.remove('d-none');
        playSound(cancel);
    }, 1000);
}

/**
 * 
 * @param {*} event 
 */
function hideOverlay(event) {
    event.stopPropagation();
    let overlay = document.getElementById('overlay');
    let miniCanvas = document.getElementById('miniCanvas');
    overlay.classList.add('d-none');
    miniCanvas.classList.remove('d-none');
    let closebtn = document.getElementById('closebtn');
    closebtn.setAttribute('onclick', 'closeArena(event)');
    cancel.currentTime = 0;
    cancel.play();
}

/**
 * Implemented in index.html and called by user onclick on 1) mini-canvas and 2) arena (both within overlay)
 * @param {*} event as propagation.
 */
function maintainOverlay(event) {
    event.stopPropagation();
}