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
      maxKcal
  );

  newRequest.onload = function() {
    var data = JSON.parse(newRequest.responseText);
    console.log(data);

    createRecipes(data);
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

//to be changed

var btn = document.querySelector("button");
btn.removeAttribute("disabled");

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
    recipeDiv.appendChild(foodName);

    //Appending recipe image

    var foodImg = document.createElement("img");
    foodImg.setAttribute("src", hits[index].recipe.image);
    recipeDiv.prepend(foodImg);

    //Appending calories element

    var servings = hits[index].recipe.yield;
    console.log(servings);

    var calories = document.createElement("span");
    calories.classList.add("calories");
    calories.textContent =
      Math.round(hits[index].recipe.calories / servings) + " cal";
    recipeDiv.appendChild(calories);

    //creating labels div and appending labels
    var labelsDiv = document.createElement("div");
    labelsDiv.classList.add("labels");
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
