
document.addEventListener('load' , ()=>{
    counter();
})


let taskArray = []; // It will store the data which is presnet in the searcBox

// Get the DOM element for toggle button, searchBar,  flexBox, dbFavInput, dbLastInput;

const toggleButton = document.getElementById('toggle-sidebar');
const sideBar = document.getElementById('sideBar');
const searchBar = document.getElementById('searchBar');
const flexBox = document.getElementById('flexBox');




// Check and initilize the local Storage for lastInput, and Favourite

const dbFavList = "favouriteList";
if(localStorage.getItem(dbFavList) == null){
    localStorage.setItem(dbFavList, JSON.stringify([]));
}

// It will update the totale counter of the dbFavList
// function updateTask() {
//     const favCounter = document.getElementById('total-counter');
//     const db = JSON.parse(localStorage.getItem(dbFavList));
//     if (favCounter.innerText != null) {
//         favCounter.innerText = db.length;
//     }

// }

function counter(){
    const favCounter = document.getElementById('total-counter');
    const dataBase = JSON.parse(localStorage.getItem(dbFavList));
    if(favCounter != null){
        favCounter.innerHTML = dataBase.length;
    }
}

/**
 * Check if an ID is in a list of favorites
 *
 * The list of favorites (array)
 *  The ID to check
 *  true if the ID is in the list, false otherwise
 */

function isFav(list, id) {
     let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res =  true;
        }
    }
    return res;
}

/**
 * Generates a random character string starting 
 *  The generated string
 */
function generateOneCharString() {
    var possible = "abcdefghijklmnopqrstuvwxyz";
    return possible.charAt(Math.floor(Math.random() * possible.length));
}

// This fucntion is for toggling the right hamburger icon, it will show us the element in the favourties list.

function showOrHideFavMenu(){
    showFavMealList();
    //console.log("You just clicked in the toggle button");
    sideBar.classList.toggle("show");
    flexBox.classList.toggle('shrink');
}

// This function will change the class of searchBox, as it will either fix or revomve fix from the searchBar,
// Moreover it will be giving us the good experience while scrolling, that the nav bar will not disapper
function scrollFunction(){
    if (flexBox.scrollTop > searchBar.offsetTop) {
        searchBar.classList.add("fixed");

    } else {
        searchBar.classList.remove("fixed");
    }
}


// Fetch data form API

const fetchMealsFromApi = async (url, value) => {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}


// This funciton will either add the recipe to the favourites or remove it

function toggleFavourites(id){
    const detailsPageLikeBtn = document.getElementById('like-button');
    let db = JSON.parse(localStorage.getItem(dbFavList));
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;

        }

    } if (ifExist) {
        db.splice(db.indexOf(id), 1);

    } else {
        db.push(id);

    }

    localStorage.setItem(dbFavList, JSON.stringify(db));
    if (detailsPageLikeBtn != null) {
        detailsPageLikeBtn.innerHTML = isFav(db, id) ? 'Remove From Favourite' : 'Add To Favourite';
    }

    showMealList();
    showFavMealList();
    counter();

}


// This funciton will give the input that is present in the searchBar
function handleInput(e){
    if(e.key === 'Enter'){
        const text = e.target.value;

        if(text == null){
            alert("Please Enter the meal");
            return;
        }
        e.target.value = "";
        console.log(text)
        taskArray.pop();
        taskArray.push(text);
        showMealList();
    }
}

// This function will disply only 50 letter form the given string.
function truncate(str , n){
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

// This function is being called in Handle Input, because as soon as the user presses "Enter" the result will be displayed in the scree.
async function showMealList() {
    const list = JSON.parse(localStorage.getItem(dbFavList));
    const inputValue = taskArray[0];
    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealsData = await fetchMealsFromApi(url, inputValue);
    let html = '';
    // document.getElementById('cardHolder').innerHTML = html;
    if (mealsData.meals) {
        html = mealsData.meals.map(element => {

            return `
            
            <div class="card">
            <div class="card-top"  onclick="showMealDetails(${element.idMeal}, '${inputValue}')">
                <div class="dish-photo" >
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="dish-name">
                    ${element.strMeal}
                </div>
                <div class="dish-details">
                    ${truncate(element.strInstructions, 30)}
                    
                    <span class="button" onclick="showMealDetails(${element.idMeal}, '${inputValue}')">Know More</span>
                 
                </div>
            </div>
            <div class="card-bottom">
                <div class="like">
                <i class="fa-solid fa-heart ${isFav(list, element.idMeal) ? 'active' : ''} " onclick="toggleFavourites(${element.idMeal})"></i>
                
                </div>
                <div class="play">
                    <a href="${element.strYoutube}">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                </div>
            </div>
        </div>
            `
        }).join('');
        document.getElementById('cardHolder').innerHTML = html;
    }
}
//  This fucntion will show the Details of the selected meal.

async function showMealDetails(itemId, searchInput) {
    //console.log("searchInput:...............", searchInput);
    const list = JSON.parse(localStorage.getItem(dbFavList));
    flexBox.scrollTo({ top: 0, behavior: "smooth" });
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealList = await fetchMealsFromApi(searchUrl,searchInput);
    //console.log('mealslist:..........',mealList);
    let html = ''
    const mealDetails = await fetchMealsFromApi(url, itemId);
    if (mealDetails.meals) {
        html = `
        <div class="searchBarDiv remove-top-margin">
            
            <h2 class = "title">Find Meals For Your Ingredients</h2>
            <blockquote>Real food doesn't have ingredients, real food is ingredients.<br>
            <cite>- Jamie Oliver</cite>
            </blockquote>
            <input id="searchBar" onkeypress="handleInput(event)" type="search" placeholder="Enter the meal, reciep" >
            
        </div>
        <div class="itemDetails">
        <div class="itemLeftDetails">
        <img src="  ${mealDetails.meals[0].strMealThumb}" alt="">
    </div>
    <div class="itemRightDetails">
        <div class="item-name">
            <strong>Name: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strMeal}
            </span>
         </div>
        <div class="itemCatogery">
            <strong>Category: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strCategory}
            </span>
        </div>
        <div class="item-ingrident">
            <strong>Ingrident: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strIngredient1},${mealDetails.meals[0].strIngredient2},
            ${mealDetails.meals[0].strIngredient3},${mealDetails.meals[0].strIngredient4}
            </span>
        </div>
        <div class="item-instruction">
            <strong>Instructions: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strInstructions}
            </span>
        </div>
        <div class="item-video">
            <strong>Video Link:</strong>
            <span class="item-text">
            <a href="${mealDetails.meals[0].strYoutube}">Watch Here</a>
          
            </span>
            <div id="like-button" onclick="toggleFavourites(${mealDetails.meals[0].idMeal})"> 
             ${isFav(list, mealDetails.meals[0].idMeal) ? 'Remove From Favourite' : 'Add To Favourite'} </div>
        </div>
    </div>
</div> 
       
    <div id="cardHolder" >`
    }

    if( mealList.meals!=null){
        html += mealList.meals.map(element => {
            return `       
            <div class="card">
            <div class="card-top"  onclick="showMealDetails(${element.idMeal}, '${searchInput}')">
                <div class="dish-photo" >
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="dish-name">
                    ${element.strMeal}
                </div>
                <div class="dish-details">
                    ${truncate(element.strInstructions, 30)}
                    
                    <span class="button" onclick="showMealDetails(${element.idMeal}, '${searchInput}')">Know More</span>
                 
                </div>
            </div>
            <div class="card-bottom">
                <div class="like">
                <i class="fa-solid fa-heart ${isFav(list, element.idMeal) ? 'active' : ''} " onclick="toggleFavourites(${element.idMeal})"></i>
                
                </div>
                <div class="play">
                    <a href="${element.strYoutube}">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                </div>
            </div>
        </div>
        `
        }).join('');
    }
    
    
    // handleInput(searchBar.value);
    html = html + '</div>';

    document.getElementById('flexBox').innerHTML = html;
}

// This function will show favMeal

async function showFavMealList() {
    let favList = JSON.parse(localStorage.getItem(dbFavList));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (favList.length == 0) {
        html = `<div class="fav-item nothing"> <h1> 
        Nothing To Show.....</h1> </div>`
    } else {
        for (let i = 0; i < favList.length; i++) {
            //console.log(favList[i] + " fav LIst");
            const favMealList = await fetchMealsFromApi(url, favList[i]);
            if (favMealList.meals[0]) {
                let element = favMealList.meals[0];
                html += `
                <div class="favItems" onclick="showMealDetails(${element.idMeal},'${generateOneCharString()}')">
              
                <div class="favItemsPhotos">
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="favItemDetails">
                    <div class="favItemName">
                        <strong>Name: </strong>
                        <span class="fav-item-text">
                           ${element.strMeal}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="toggleFavourites(${element.idMeal})">
                        Remove
                    </div>
                </div>
            </div>               
                `
            }
        }
    }
    document.getElementById('fav').innerHTML = html;
}





searchBar.addEventListener('keyup', handleInput);
toggleButton.addEventListener('click', showOrHideFavMenu);
flexBox.addEventListener('onscroll', scrollFunction);
counter();