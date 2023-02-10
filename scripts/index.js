const keyFetch = "c542e67aec3a4340908f9de9e86038af";
const gameContainer = document.getElementById("game-list");

const btnsMove = document.getElementsByClassName("btn-move")
const btnsPlatforms = document.getElementsByClassName("btn-platform")
document.getElementsByTagName("nav")[0].style.transform = "translateX(-70px)"

let actualPage = "Home";
let actualNamePage = 1;

fetchHomeGames();

//When user search a game from the input search
document.getElementById("input-search").addEventListener("input",async function(){
    if(document.getElementById("input-search").value == ""){
        actualPage = "Home";
        actualNamePage = 1;
        document.getElementById("div-buttons-move").style.display = "flex";
        fetchHomeGames();
    }else{
        actualPage = "Home";
        actualNamePage = 1;
        for(let i = 0 ; i < btnsPlatforms.length ; i++){
            btnsPlatforms[i].style.backgroundColor = ""
        }
        gameContainer.innerHTML = getSpinnerCharging();
        document.getElementById("div-buttons-move").setAttribute("style", "display: none!important")
        let request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}&search=${document.getElementById("input-search").value}&page_size=20`);
        let data = await request.json()

        gameContainer.innerHTML = createCards(data.results);
    }
    
})

// Cycle that follow the platforms buttons
for(let i = 0 ; i < btnsPlatforms.length ; i++){
    let request;
    let data;
    // When a platform button is clicked
    btnsPlatforms[i].addEventListener("click",async function(){

        switch(btnsPlatforms[i].lastElementChild.firstChild.textContent){
            case "PC":
                setPlatformPage(1);
                break;
            case "Xbox":
                setPlatformPage(3);
                break;
            case "Ps":
                setPlatformPage(2);
                break;
            case "Nintendo":
                setPlatformPage(7);
                break;
            case "Linux":
                setPlatformPage(6);
                break;
            case "Android":
                setPlatformPage(8);
                break;
            case "IOS":
                setPlatformPage(4);
                break;
            case "Web":
                setPlatformPage(14);
                break;
        }
    })
}

// Cycle that follow the buttons move, (next and before page)
for(let i = 0 ; i < btnsMove.length ; i++){
    btnsMove[i].addEventListener("click",async function(){
        let request;
        let data;
        // If the button is before
        if(btnsMove[i].textContent == "Before Page"){
            
            switch(actualPage){
                case "Home":
                    
                    if(actualNamePage > 1){
                        gameContainer.innerHTML = getSpinnerCharging()
                        request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}`);
                        data = await request.json()

                        let numberPages = Math.ceil(data.count/20);
                        actualNamePage -= 1;
                        console.log(numberPages)
                        
                        gameContainer.innerHTML = "";
                        request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}&page_size=20&page=${actualNamePage}`);
                        data = await request.json()
                        gameContainer.innerHTML = createCards(data.results);
                    }
                    break;
                case "PC":
                    if(actualNamePage > 1){
                        setMovePage(1)
                    }
                    break;
                case "XBOX":
                    if(actualNamePage > 1){
                        setMovePage(3)
                    }
                    break;
                case "PS":
                    if(actualNamePage > 1){
                        setMovePage(2)
                    }
                    break;
                case "NINTENDO":
                    if(actualNamePage > 1){
                        setMovePage(7)
                    }
                    break;
                case "LINUX":
                    if(actualNamePage > 1){
                        setMovePage(6)
                    }
                    break;
                case "ANDROID":
                    if(actualNamePage > 1){
                        setMovePage(8)
                    }
                    break;
                case "IOS":
                    if(actualNamePage > 1){
                        setMovePage(4)
                    }
                    break;
                case "WEB":
                    if(actualNamePage > 1){
                        setMovePage(14)
                    }
                    break;
            }
        }else{
            switch(actualPage){
                case "Home":
                    gameContainer.innerHTML = getSpinnerCharging()
                    request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}`);
                    data = await request.json() 
                    if(actualNamePage <= Math.ceil(data.count/20)){
                        
                        actualNamePage += 1;
                        gameContainer.innerHTML = "";
                        request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}&page_size=20&page=${actualNamePage}`);
                        data = await request.json()
                        gameContainer.innerHTML = createCards(data.results);
                    }
                    break;
                case "PC":
                    setMovePageBefore(1)
                    break;
                case "XBOX":
                    setMovePageBefore(3)
                    break;
                case "PS":
                    setMovePageBefore(2)
                    break;
                case "NINTENDO":
                    setMovePageBefore(7)
                    break;
                case "LINUX":
                    setMovePageBefore(6)
                    break;
                case "ANDROID":
                    setMovePageBefore(8)
                    break;
                case "IOS":
                    setMovePageBefore(4)
                    break;
                case "WEB":
                    setMovePageBefore(14)
                    break;
            }
        }
    })
}

async function fetchHomeGames(){
    gameContainer.innerHTML = `<div class="spinner-border m-5" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>`;
    const request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}`)
    const data = await request.json();  
    gameContainer.innerHTML = "";
    gameContainer.innerHTML = createCards(data.results);

}

function createCards(array){
    let cards = "";
    for(let i = 0 ; i < array.length ; i++){
        let platformsGame = "";
        for(let j = 0 ; j < array[i].parent_platforms.length ; j++){
            platformsGame += `<span class="badge rounded-pill text-bg-dark">${array[i].parent_platforms[j].platform.name}</span>`;
        }
        let metacritic = array[i].metacritic;
        let metacriticHTML;
        if(metacritic == null){
            metacriticHTML = ""
        }else if(metacritic > 60){
            metacriticHTML = `<div class="metacritic-green float-end rounded">${metacritic}</div>`;
        }else{
            metacriticHTML = `<div class="metacritic float-end rounded">${metacritic}</div>`;
        }
        let cardGame = `<div class="card cardGame">
                            <img src="${array[i].background_image}" class="card-img-top" height="200px" alt="${array[i].name}">
                            <div class="card-body">
                            <h4 class="card-title fw-bold">${array[i].name}</h4>
                            <p class="card-text"><b>Release : </b>${array[i].released}</p>
                            <strong>Platforms : </strong>${platformsGame}<br><br>
                            ${metacriticHTML}
                            </div>
                        </div>`;
        
        cards += cardGame;               
    }
    return cards;
}

async function setPlatformPage(idPlatform){
    actualPage = "PC"
    actualNamePage = 1;
    gameContainer.innerHTML = getSpinnerCharging()
    let request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}&page_size=20&parent_platforms=${idPlatform}&page=1`);
    let data = await request.json()
    gameContainer.innerHTML = createCards(data.results);
}

async function setMovePage(idPlatform){
    gameContainer.innerHTML = getSpinnerCharging()
    let request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}&page_size=20&parent_platforms=1&`);
    let data = await request.json()
    actualNamePage -= 1;

    gameContainer.innerHTML = "";
    request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}&page_size=20&parent_platforms=${idPlatform}&page=${actualNamePage}`);
    data = await request.json()
    gameContainer.innerHTML = createCards(data.results);    
}

async function setMovePageBefore(idPlatform){
    gameContainer.innerHTML = getSpinnerCharging()
    let request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}&page_size=20&parent_platforms=1&`);
    let data = await request.json()
    if(actualNamePage <= Math.ceil(data.count/20)){

        actualNamePage += 1;
        
        gameContainer.innerHTML = "";
        request = await fetch(`https://api.rawg.io/api/games?key=${keyFetch}&page_size=20&parent_platforms=${idPlatform}&page=${actualNamePage}`);
        data = await request.json()
        gameContainer.innerHTML = createCards(data.results);
    }
}
// Change style of button categories when is clicked
function changeStyle(elm){
    for(let i = 0 ; i < btnsPlatforms.length ; i++){
        btnsPlatforms[i].style.backgroundColor = ""
    }
    elm.style.backgroundColor = "rgb(49, 52, 56)";
}

function getSpinnerCharging(){
    return `<div class="spinner-border m-5" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>`
}

// Translate nav menu in Mobile screens
document.getElementById("btn-nav").addEventListener("click",()=>{
    if(document.getElementsByTagName("nav")[0].style.transform != "translateX(-70px)"){
        document.getElementsByTagName("nav")[0].style.transform = "translateX(-70px)"
    }else{
        document.getElementsByTagName("nav")[0].style.transform = "translateX(0)"
    }
})