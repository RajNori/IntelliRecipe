const drinkUrl = 'https://www.thecocktaildb.com/api/json/v1/1/'

const spirits = ['Tequila', 
                'Vodka', 
                'Gin', 
                'Rum', 
                'Whiskey', 
                'Bourbon', 
                'Blended whiskey',
                'Scotch',
                'Dry Vermouth']
            

function generateOptionElement(option) {
    return `<option value="${option}">${option}</option>`
}

function generateIngredients(recipe) {
    let ingredientList = ``
    const ing = 'strIngredient'
    const meas = 'strMeasure'
    let c = 1
    let curIng = ing + c
    let curMeas= meas + c
    while (recipe[curIng]) {
        if (recipe[curMeas]) {
            ingredientList += `<li>${recipe[curMeas]} ${recipe[curIng]}</li>`
        } else {
            ingredientList += `<li>${recipe[curIng]}</li>`
        }
        
        c++
        curIng = ing + c, curMeas = meas + c
    } 
    return ingredientList
}

function generateDrinkListElement(option, delay) {
    return `<li><button class="recipe-list-item" idDrink="${option.idDrink}">${option.strDrink}</button></li>`
}

function generateDrinkList(response) {
    const recipes = response.drinks
    let recipeList = ''
    const delayInc = 1/recipes.length
    let delay = 0

    for(let i = 0; i < recipes.length; i++) {
        recipeList += generateDrinkListElement(recipes[i])
    }

    return recipeList
}

function generateDrinkRecipe(response) {
    const recipe = response.drinks[0];
    const ingredients = generateIngredients(recipe)
    return `<h3 class="recipe-title">${recipe.strDrink}</h3>
            <div class="image-ingredient-wrapper">
                <img class="recipe-image" src="${recipe.strDrinkThumb}" alt="${recipe.strDrink}">
                <ul class="recipe-ingredients">
                    ${ingredients}
                </ul>
            </div>
            <div class="recipe-instructions">
                <p>${recipe.strInstructions}</p>
            </div>`
}

function recipeUpdateActions(recipeElements, pick, image) {
    $(pick).removeClass('visible')
    $(pick).empty();
    $(pick).append(recipeElements);
    $(image).on("load", function() {
        $(pick).removeAttr('style');
        document.querySelector(pick).scrollIntoView({ 
            behavior: 'smooth' 
        });
        $(pick).addClass('visible');
    });
}

function renderSpirits() {
    for (let i = 0; i < spirits.length; i++) {
        $('#js-spirits').append(generateOptionElement(spirits[i]))
    }
}

function renderDrinkRecipeList(searchItem, location) {
    searchItem = searchItem.replaceAll(' ', '_')

    const url = drinkUrl + 'filter.php?i=' + searchItem

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(responseJSON => generateDrinkList(responseJSON))
        .then(recipeList => {
            location.empty()
            location.append(recipeList)
        })
}

function renderDrinkPick(choice) {
    choice = choice.replaceAll(' ', '_')
    
    const url = drinkUrl + 'lookup.php?i=' + choice

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(responseJSON => generateDrinkRecipe(responseJSON))
        .then(recipe => recipeUpdateActions(recipe, '#drink-pick', '.recipe-image'))
}

function handleSpiritSelect() {
    $('#js-drink-form select').change(event => {
        event.preventDefault();
        const spiritChoice = $('#js-spirits').val()
        renderDrinkRecipeList(spiritChoice, $('.drink-list'))
    })
}

function handleDrinkSelect() {
    $('.drink-list').on('click', 'button', function() {
        const recipePick = $(this).attr('idDrink');
        renderDrinkPick(recipePick);
    })
}

function preparePage() {
    renderSpirits();
    handleSpiritSelect();
    handleDrinkSelect();
}

$(preparePage)