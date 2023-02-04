Link for the website : https://praduman2714.github.io/MealMonkey/

### General steps to follow when creating a project
- Functionality
    - Search For the Meal
    - Know more about the Meal.
    - Make Your meal Favourites
    - See which meal is Favourites
    - Remove the meal from your Favourites


- Data
    - taskArray (it store the element which is typed in the searchBar)
    - dbFavList (it is the variable use to fetch the element form the localStorage. )
    - There are few local variable (isFav etc);

- Function (in Code)
    - counter() (It count the element in the FavList that is stored in the localStorage.) 
    - isFAv (list, id) {it take dbFavList and id as argument, and check for the Favourites}
     - showOrHideFavMenu() (If you will click on the hamberger icon, then this function will be called);

     - fetchMealsFromApi()  (It will fetch data from api)
     - toggleFavourites(id) (It will take a id as argument, and addOrRemove that meal from favourites.)

     - handleInput(e) (This function will get the input form the searchBar)

     - showMealList() (As soon as someone presses Enter, this function will be called. This fucntion will show related Item)

     - showMealDetails(itemId, SearchInput) {it will display the details about the clicked meal}

     - showFavMealList() {It will show the favMeal }   

