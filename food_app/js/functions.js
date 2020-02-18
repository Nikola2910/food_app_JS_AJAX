export var appId = "5d43c2a3";
export var appKey = "ab283b83c84c3890058fc08c825f4647";

export var search = document.querySelector("input.keyword-input").value;
export var minKcal = document.querySelector(".min-cal").value;
export var maxKcal = document.querySelector(".max-cal").value;

export var health = document.querySelector("select#health").value;
export var diet = document.querySelector("select#diet").value;
export var loaderGif = document.querySelector("div.loader img");

export var start = 0;
export var end = 10;

//function for getting data

export const getRecipes = () => {
  search = document.querySelector("input.keyword-input").value;
  minKcal = document.querySelector(".min-cal").value;
  maxKcal = document.querySelector(".max-cal").value;
  health = document.querySelector("select#health").value;
  diet = document.querySelector("select#diet").value;

  fetch(
    `https://api.edamam.com/search?q=${search}&app_id=${appId}&app_key=${appKey}&health=${health}&diet=${diet}&calories=${minKcal}-${maxKcal}&from=${start}&to=${end}`
  )
    .then(response => {
      loaderGif.style.display = "block";
      return response.json();
    })
    .then(data => {
      createRecipes(data);
      paginate(data);
      loaderGif.style.display = "none";
    })
    .catch(error => alert(error));
};

//creating elements based on fetched data

export function createRecipes(data) {
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

export function paginate(data) {
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

      fetch(
        `https://api.edamam.com/search?q=${search}&app_id=${appId}&app_key=${appKey}&health=${health}&diet=${diet}&calories=${minKcal}-${maxKcal}&from=${start}&to=${end}`
      )
        .then(response => {
          loaderGif.style.display = "block";
          return response.json();
        })
        .then(data => {
          createRecipes(data);
          //When Recipes are created HIDE the loader
          loaderGif.style.display = "none";
        })
        .catch(error => alert(error));
    });
  });
}

// Add active class to first page box

const activeFirst = firstPage => {
  firstPage.classList.add("active");
};

//make first five pages visible when sending request

const visibleFirstFive = arrayOfPages => {
  var firstFive = arrayOfPages.slice(0, 5);

  firstFive.forEach(e => {
    e.classList.add("visible");
  });
};

// make first and last page always visible

const visibleFirstLast = (firstPage, lastPage) => {
  firstPage.classList.add("visible");
  lastPage.classList.add("visible");
};
