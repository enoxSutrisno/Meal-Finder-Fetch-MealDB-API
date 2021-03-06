const search = document.getElementById('search'),
     submit = document.getElementById('submit'),
     random = document.getElementById('random'),
     mealEl = document.getElementById('meals'),
     resultHeading = document.getElementById('result-heading'),
     single_mealEl = document.getElementById('single-meal');

//search meal and fecth from API
function searchMeal(e) {
     e.preventDefault();

     //clear single meal
     single_mealEl.innerHTML = '';

     //get search term
     const term = search.value;

     //check for empty
     if (term.trim()) {
          fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
               .then(res => res.json())
               .then(data => {
                    // console.log(data);
                    resultHeading.innerHTML = `<h2>Search result for ${term}</h2>`;

                    if (data.meals === null) {
                         resultHeading.innerHTML = `<p>There are no search results. Try again</p>`;
                    } else {
                         mealEl.innerHTML = data.meals.map(meal => `
                              <div class="meal">
                                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                                    <div class="meal-info" data-mealID="${meal.idMeal}">
                                         <h3>${meal.strMeal}</h3>
                                    </div>
                              </div>
                         `)
                              .join('')
                    }
               });
          //clear search
          search.value = '';
     } else {
          alert('Please eneter a search term');
     }

}

//fecth meal by ID
function getMealById(mealID) {
     fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
          .then(res => res.json())
          .then(data => {
               const meal = data.meals[0];
               addMealToDOM(meal);
          });
}

//fetch random meal from API
function getRandomMeal() {
     //cleat meals and heading
     mealEl.innerHTML = '';
     resultHeading.innerHTML = '';

     fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
          .then(res => res.json())
          .then(data => {
               const meal = data.meals[0];

               addMealToDOM(meal);
          });
}

//add meal to dmm
function addMealToDOM(meal) {
     const ingredients = [];

     for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`]) {
               ingredients.push(
                    `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
               );
          } else {
               break;
          }


          single_mealEl.innerHTML =
               `<div class="single-meal">
               <h1>${meal.strMeal}</h1>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="single-meal-info">
                    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
                </div>  
                
                <div class="main"  
                    <p>${meal.strInstructions}</p>
                    <h2>Ingredients</h2>
                    <ul>
                         ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>

          </div>`;
     }
}

//event listener
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealEl.addEventListener('click', e => {
     const mealInfo = e.path.find(item => {
          if (item.classList) {
               return item.classList.contains('meal-info');
          } else {
               return false;
          }
     });

     // console.log(mealInfo);
     if (mealInfo) {
          const mealID = mealInfo.getAttribute('data-mealid');
          getMealById(mealID);
     }

});




