//app ID and app KEY

var appId = "5d43c2a3";
var appKey = "ab283b83c84c3890058fc08c825f4647";

//some global vars

var search = document.querySelector("input.keyword-input").value;
var minKcal = document.querySelector(".min-cal").value;
var maxKcal = document.querySelector(".max-cal").value;

var health = document.querySelector("select#health").value;
var diet = document.querySelector("select#diet").value;
var loaderGif = document.querySelector("div.loader img");

var start = 0;
var end = 10;

//functions for changing health and diet values

function changeHealth() {
  health = document.querySelector("select#health").value;
}

function changeDiet() {
  diet = document.querySelector("select#diet").value;
}

//Adding event listeners to health and diet slectors

document
  .querySelector("select#health")
  .addEventListener("change", changeHealth);
document.querySelector("select#diet").addEventListener("change", changeDiet);

//function for getting data

function getRecipes() {
  var newRequest = new XMLHttpRequest();
  search = document.querySelector("input.keyword-input").value;
  minKcal = document.querySelector(".min-cal").value;
  maxKcal = document.querySelector(".max-cal").value;
  health = document.querySelector("select#health").value;
  diet = document.querySelector("select#diet").value;

  newRequest.open(
    "GET",
    "https://api.edamam.com/search?q=" +
      search +
      "&app_id=" +
      appId +
      "&app_key=" +
      appKey +
      "&health=" +
      health +
      "&diet=" +
      diet +
      "&calories=" +
      minKcal +
      "-" +
      maxKcal +
      "&from=" +
      start +
      "&to=" +
      end
  );

  newRequest.onload = function() {
    var data = JSON.parse(newRequest.responseText);
    console.log(data);

    createRecipes(data);
    paginate(data);
    //When Recipes are created HIDE the loader
    loaderGif.style.display = "none";
  };

  newRequest.onerror = function() {
    alert("Please select all fields");
  };

  newRequest.send();
  //After sending request SHOW the loader
  loaderGif.style.display = "block";
}

//enable/disable button

var btn = document.querySelector("button");

var searchField = document.querySelector("input.keyword-input");

searchField.addEventListener("keyup", function(e) {
  if (e.target.value != "") {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
});

btn.addEventListener("click", getRecipes);

//creating elements based on fetched data

function createRecipes(data) {
  var recipes = document.querySelector("#recipes");
  var hits = data.hits;

  if (data.hits.length == 0) {
    alert("No recipes found");
  }

  //reseting recipes list after clicking search button
  recipes.innerHTML = "";
  //result counter

  var resultsCounter = document.querySelector("span.recipe-count-number");
  resultsCounter.textContent = data.count;

  hits.forEach(function(element, index) {
    //CREATE DIV FOR EACH HIT

    var createRecipe = document.createElement("div");
    recipes.appendChild(createRecipe);
    //ADDING CLASS TO CREATED DIV
    createRecipe.classList.add("recipe-element");

    var recipeDivs = document.querySelectorAll("div.recipe-element");
    var recipeDivsArray = Array.from(recipeDivs);
    var recipeDiv = recipeDivsArray[index];

    //Appending recipe label

    var foodName = document.createElement("h3");
    foodName.textContent = hits[index].recipe.label;
    foodName.classList.add("rubberBand");
    recipeDiv.appendChild(foodName);

    //Appending recipe image

    var foodImg = document.createElement("img");
    foodImg.setAttribute("src", hits[index].recipe.image);
    foodImg.classList.add("bounceIn");
    recipeDiv.prepend(foodImg);

    //Appending calories element

    var servings = hits[index].recipe.yield;

    var calories = document.createElement("span");
    calories.classList.add("calories");
    calories.classList.add("rollIn");
    calories.textContent =
      Math.round(hits[index].recipe.calories / servings) + " cal";
    recipeDiv.appendChild(calories);

    //creating labels div and appending labels
    var labelsDiv = document.createElement("div");
    labelsDiv.classList.add("labels");
    labelsDiv.classList.add("flipInX");
    recipeDiv.appendChild(labelsDiv);

    var labels = element.recipe.healthLabels;

    labels.forEach(function(e, i) {
      var label = document.createElement("span");
      label.classList.add("label");
      label.textContent = labels[i];
      labelsDiv.appendChild(label);
    });
  });
}

//Function for paginating data

function paginate(data) {
  //defining number of results per page

  var results = data.count;
  var resultsPerPage = 10;
  var numberOfPages = Math.ceil(results / resultsPerPage);
  var recipesDiv = document.querySelector("#recipes");

  //Do not create a new div with spans if it exsists

  if (!document.querySelector(".pages-div")) {
    var pagesDiv = document.createElement("div");
    pagesDiv.classList.add("pages-div");
    recipesDiv.after(pagesDiv);

    //creating page spans

    for (var i = 0; i < numberOfPages; i++) {
      var pageSpan = document.createElement("span");

      pageSpan.textContent = i + 1;

      pagesDiv.appendChild(pageSpan);
    }
  }
  var pagesNodeList = document.querySelectorAll("div.pages-div span");
  var pagesArray = Array.from(pagesNodeList);

  activeFirst(pagesArray[0]);
  visibleFirstFive(pagesArray);
  visibleFirstLast(pagesArray[0], pagesArray[pagesArray.length - 1]);

  //adding event listeners to spans

  pagesArray.forEach(function(element, index) {
    element.addEventListener("click", function() {
      //add active class to clicked span and removing from any other

      if (!element.classList.contains("active")) {
        pagesArray.forEach(function(e) {
          e.classList.remove("active");
        });

        element.classList.add("active");
      }

      //making 2 pages before and after active one visible

      var startPage = Math.max(0, index - 2);
      var endPage = Math.min(startPage + 4, pagesArray.length - 1);

      if (startPage < 0) {
        startPage = 0;
      }

      if (endPage > pagesArray.length - 1) {
        endPage = pagesArray.length - 1;
      }

      pagesArray.forEach(function(e) {
        e.classList.remove("visible");
      });

      visibleFirstLast(pagesArray[0], pagesArray[pagesArray.length - 1]);

      for (var i = startPage; i <= endPage; i++) {
        pagesArray[i].classList.add("visible");
      }

      //setting the value for range when sending request

      start = index * 10;
      end = start + 10;
      var newRequest = new XMLHttpRequest();

      newRequest.open(
        "GET",
        "https://api.edamam.com/search?q=" +
          search +
          "&app_id=" +
          appId +
          "&app_key=" +
          appKey +
          "&health=" +
          health +
          "&diet=" +
          diet +
          "&calories=" +
          minKcal +
          "-" +
          maxKcal +
          "&from=" +
          start +
          "&to=" +
          end
      );

      newRequest.onload = function() {
        var data = JSON.parse(newRequest.responseText);

        createRecipes(data);
        //When Recipes are created HIDE the loader
        loaderGif.style.display = "none";
      };

      newRequest.send();
    });
  });
}

// Add active class to first page box

function activeFirst(firstPage) {
  firstPage.classList.add("active");
}

//make first five pages visible when sending request

function visibleFirstFive(arrayOfPages) {
  var firstFive = arrayOfPages.slice(0, 5);

  firstFive.forEach(function(e) {
    e.classList.add("visible");
  });
}

// make first and last page always visible

function visibleFirstLast(firstPage, lastPage) {
  firstPage.classList.add("visible");
  lastPage.classList.add("visible");
}
