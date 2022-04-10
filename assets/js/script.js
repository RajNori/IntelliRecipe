
const searchForm = document.querySelector('form')
const searchResult = document.querySelector('.search-result')
const containerDiv = document.querySelector('.container')
let searchQuery=''
const APP_ID = '12edc078'
const APP_Key = '4bc7ce7cadab45ebd5a8551769209ee2'

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = e.target.querySelector('input').value;
    fetchAPI();
});
async function fetchAPI () {
    const baseUrl = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_Key}`
    const response = await fetch(baseUrl);
    const data = await response.json();
    generateHTML(data.hits);
    console.log(data)
}
function generateHTML(results) {
    let generatedHTML = '';
    results.map(result => {
        generatedHTML += 
        `
        <div class="item">
        <img src="${result.recipe.image}" alt="">
        <div class="flex-container">
          <h1 class="title">${result.recipe.label}</h1>
          <a class="view-btn" href="${result.recipe.url}"target="_blank">Get Reciepe</a>
        </div>
        <p class="item-data">Calories:${result.recipe.calories.toFixed(2)}</p>
        <p class="item-data">MealType:${result.recipe.mealType}</p>
        <p class="item-data">Diet Label:${result.recipe.dietLabels.length > 0? result.recipe.dietLabels : 'No Data Found'}</p>
        <p class="item-data">Health Label:${result.recipe.healthLabels}</p>

        </div>
        
        `
    })
    searchResult.innerHTML = generatedHTML;
}