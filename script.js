const inputElem = document.getElementById("input-box");
const searchBtn = document.querySelector(".search-button"); // Added dot before the class name


const dbObjectFavList = "favouritesList";
if (localStorage.getItem(dbObjectFavList) == null) {
   localStorage.setItem(dbObjectFavList, JSON.stringify([]));
}



/* Function to get the response from the API */
async function getMealDetails(url, value) {
    const response = await fetch(`${url}${value}`); // Fixed the URL format
    const meals = await response.json();
    return meals;
}

function scrollToBottom() {
    // Select the body or documentElement, depending on the browser
    const body = document.body;
    const html = document.documentElement;
  
    // Calculate the maximum scroll height
    const maxHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  
    // Scroll to the bottom
    window.scrollTo({
      top: maxHeight,
      behavior: 'smooth' 
    });
  }
  


async function showMealDetails(id,searchValue){
    console.log("searchInput:...............", searchValue);
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
  
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealList = await getMealDetails(searchUrl,searchValue);
    console.log('mealslist:..........',mealList);
    let html = '';
    const mealDetails = await getMealDetails(url, id);
    console.log(mealDetails);
    if (mealDetails.meals) {
        html =   
         `<img src="${mealDetails.meals[0].strMealThumb}" alt="">
        </div>
        <div class="info-block">
            <p><b>Name:</b>${mealDetails.meals[0].strMeal}</p>
            <hr>
            <p><b>Category:</b>${mealDetails.meals[0].strCategory}</p>
            <hr>
            <p><b>Details:</b>${mealDetails.meals[0].strInstructions}</p>
        </div>
    </div>

        `
    };
    document.querySelector(".item-card-detail").innerHTML = html;
    scrollToBottom();
}


async function showmeals(){
    const value = inputElem.value;
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealsData = await getMealDetails(url,value);
    let html = ``;

    if(mealsData.meals){
        html = mealsData.meals.map(element => {
            return ` <div class="item-card">
            <img src="${element.strMealThumb}">
            <p id="description"><a href=""> ${truncate(element.strInstructions, 50)}</a></p>
            <div class="flex-items">
                <button class="view-receipe" onclick="showMealDetails(${element.idMeal}, '${value}')">View</button>
                <button class="like-button" onclick="addRemoveToFavList(${element.idMeal})">Like</button>
            </div>
            </div>

            `
        });
        document.querySelector(".Search-result").innerHTML = html;
        
    }
    else if(mealsData.meals === null){
        html = `<div class="food-not-found">
        <h2>No Such Food Items Found</h2>
    </div>`
    document.querySelector(".Search-result").innerHTML = html;
    }
    document.querySelector(".item-card-detail").innerHTML = "";
}




function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}


/*Adding faviourites to the list*/
function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let contain=false;
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal removed from your favourites list");
        console.log(arr);
    } else {
        arr.push(id);
        alert("your meal add your favourites list");
        console.log(arr);
    }
    localStorage.setItem("favouritesList",JSON.stringify(arr));
    
}


/*showing the faviourite list*/
async function showFavMealList() {
    console.log("hello");

    console.log(localStorage.getItem("favouritesList"))
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    if(arr.length==0){
        html =  `
        <div class="no-result">
        <h4>No Faviourites</h4>
    </div>
        `;
       
    }
    else{
        for(let index = 0;index<arr.length;index++){
            await getMealDetails(url,arr[index]).then(data=>{
                html += `
                <div class="item-card">
                <img src="${data.meals[0].strMealThumb}">
                <p id="description"><a href=""> ${truncate(data.meals[0].strInstructions, 50)}</a></p>
                <div class="flex-items">
                <button class="like-button" onclick="addRemoveToFavList(${data.meals[0].idMeal}); reloadPage()">DisLike</button>
                </div>
                </div>
                `;
            });   
        }
    }
    document.querySelector("#card-holder1").innerHTML= html;
    document.querySelector("#card-holder1").style.height = auto;
    
}
function reloadPage() {
    // Reload the current page
    location.reload();
  }
showFavMealList();


