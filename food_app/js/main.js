import * as imported from "./functions.js";

let {
  appId,
  appKey,
  search,
  minKcal,
  maxKcal,
  health,
  diet,

  start,
  end
} = imported;
const { getRecipes, createRecipes, paginate, loaderGif } = imported;

//functions for changing health and diet values

const changeHealth = () => {
  health = document.querySelector("select#health").value;
};

const changeDiet = () => {
  diet = document.querySelector("select#diet").value;
};

//enable/disable button

const btn = document.querySelector("button");
const searchField = document.querySelector("input.keyword-input");

searchField.addEventListener("keyup", e => {
  if (e.target.value != "") {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
});

//Adding event listeners to health and diet slectors

document
  .querySelector("select#health")
  .addEventListener("change", changeHealth);
document.querySelector("select#diet").addEventListener("change", changeDiet);

btn.addEventListener("click", getRecipes);
