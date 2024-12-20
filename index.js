import { $ } from "./functions.js";
import { mapRawCocktailData } from "./utilities.js";

const searchContainer = $(".search-container");
const startContainer = $(".start-container");
const detailsContainer = $(".details-container");
const randomizeCocktail = $("#randomize-drink");
const randomizeDrink = $("button", randomizeCocktail);
const baseURL = "https://www.thecocktaildb.com/api/json/v1/1";
const homeNav = $(".home-nav");
const searchNav = $(".search-nav");

//event hanterare

homeNav.addEventListener("click", (event) => {
  event.preventDefault();
  showCurrentSection(startContainer);
});

searchNav.addEventListener("click", (event) => {
  event.preventDefault();
  showCurrentSection(searchContainer);
});

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  searchFunction();
});

function showCurrentSection(section) {
  startContainer.style.display = "none";
  searchContainer.style.display = "none";
  detailsContainer.style.display = "none";

  section.style.display = "block";
}

async function getRandomDrink() {
  try {
    const res = await fetch(`${baseURL}/random.php`);
    const data = await res.json();
    const randomDrink = data.drinks ? data.drinks[0] : null;

    const mapCocktail = mapRawCocktailData(randomDrink);
    createStartPage(mapCocktail);
  } catch (error) {
    console.error(error);
    startContainer.innerHTML = `<p>Unexpected error try again later.</p>`;
  }
}

function createStartPage(cocktail) {
  startContainer.innerHTML = `                              
   <p>Here is your drink, you can always randomize a new drink that suits your preferences:</p>
   <div class="button-container">
     <button id="randomize-cocktail" type="button">Randomize Cocktail</button>
     <button data-id="${cocktail.id}" id="details-link" type="button">See the details of your cocktail</button>
   </div>
   <div class="drink-name">
     <h4>${cocktail.name}</h4>
   </div>
   <div class="drink-img">   
     <img src="${cocktail.thumbnail}" alt="${cocktail.name}">
   </div>
  `;

  document.querySelector("#details-link").addEventListener("click", (event) => {
    const id = event.target.dataset.id;
    showCocktailDetails(id);
  });
  // fick inte $ funktionen att funka utan att den slutade ladda de nya cocktailsen
  document
    .querySelector("#randomize-cocktail")
    .addEventListener("click", () => getRandomDrink());

  showCurrentSection(startContainer);
}

// detaljer
async function showCocktailDetails(id) {
  try {
    const res = await fetch(`${baseURL}/lookup.php?i=${id}`);
    const data = await res.json();
    const cocktail = mapRawCocktailData(data.drinks[0]);

    detailsContainer.innerHTML = `
      <h3>${cocktail.name}</h3>
      <p>Category: ${cocktail.category}</p>
      <img src="${cocktail.thumbnail}" alt="${cocktail.name}">
      <p>Tags: ${cocktail.tags.join(", ") || "None"}</p>
      <p>Instructions: ${cocktail.instructions}</p>
      <h4>Ingredients:</h4>
      <ul>
      ${cocktail.ingredients
        .map(
          ({ ingredient, measure }) => `
          <li>${measure || "To your preference"} ${ingredient}</li>
          `
        )
        .join("")}
        </ul>
        <p>Glass: ${cocktail.glass}</p>
    `;
    showCurrentSection(detailsContainer);
  } catch (error) {
    console.error(error);
    detailsContainer.innerHTML = `<p>unexpected error try again later</p>`;
  }
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  searchFunction();
});

// sök funktion
async function searchFunction() {
  const searchInput = $("#search-bar").value.trim().toLowerCase();
  const searchResultList = $("#search-results");

  if (!searchInput) {
    searchResultsList.innerHTML = `<p>Please enter a search term.</p>`;
    return;
  }

  const searchURL = `${baseURL}/search.php?s=${searchInput}`;

  try {
    searchResultList.innerHTML = `<p>Fetching your drinks</p>`;
    const res = await fetch(searchURL);
    const data = await res.json();

    if (data.drinks) {
      const mappedData = data.drinks.map(mapRawCocktailData);
      searchResultList.innerHTML = mappedData
        .map(
          (drink) => `
            <p>
              <a href="#" class="search-result" data-id="${drink.id}">${drink.name}</a>
            </p>
          `
        )
        .join("");

      document.querySelectorAll(".search-result").forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const drinkId = link.dataset.id;
          showCocktailDetails(drinkId);
        });
      });
    } else {
      searchResultList.innerHTML = `<p>No cocktails by that name.</p>`;
    }
  } catch (error) {
    console.error(error);
  }
  searchInput.value = " ";
  searchInput.focus();
}

// starta med en drink
getRandomDrink();
