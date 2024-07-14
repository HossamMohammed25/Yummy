/// <reference types="../@types/jquery" />

const shareIcon = document.getElementById('shareIcon');
let searchContainer = document.getElementById('searchContainer')

/*---------------------------------------------------- display Data---------------------------*/
function displayCategories(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${arr[i].strCategory}</h3>
                    <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`;
    }

    rowData.innerHTML = box;
}
async function getCategoryMeals(category) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}
function displayData(arr) {
    let box = '';
    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
            <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${arr[i].strMealThumb}" alt="">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${arr[i].strMeal}</h3>
                </div>
            </div>
        </div>
        `;
    }
    rowData.innerHTML = box;
}
async function getData() {
    $(".inner-loading-screen").fadeIn(300);
    showLoadingScreen()
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        displayMeals(data.meals);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
        hideLoadingScreen()
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getData();
});

function displayMeals(meals) {
    let box = '';
    meals.forEach(meal => {
        box += `
        <div class="col-md-3 py-2">
            <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer" onclick="getMealById('${meal.idMeal}')">
                <img class="w-100" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>`;
    });
    rowData.innerHTML = box;
}

async function getMealById(mealId) {
    $(".inner-loading-screen").fadeIn(300);

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        displayMealDetails(data.meals[0]);
    } catch (error) {
        console.error('Error fetching meal details:', error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

function displayMealDetails(meal) {
    let ingredientsHTML = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientsHTML += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
        }
    }

    let tags = meal.strTags ? meal.strTags.split(',') : [];
    let tagsHTML = tags.map(tag => `<li class="alert alert-danger m-2 p-1">${tag.trim()}</li>`).join('');

    let box = `
    <div class="col-md-4">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
        <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredientsHTML}</ul>
        <h3>Tags :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">${tagsHTML}</ul>
        <a target="_blank" href="${meal.strSource || '#'}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube || '#'}" class="btn btn-danger">Youtube</a>
    </div>`;

    rowData.innerHTML = box;
    searchContainer.innerHTML = "";

}
/*------------------------------------------------------------Spinner----------------------------*/
function showLoadingScreen() {
    $(".loading-screen").fadeIn(700);
}
function hideLoadingScreen() {
    $(".loading-screen").fadeOut(700);
}
$(document).ready(function () {
    $('#openNav').on('click', function () {
        let leftMenu = $(".side-nav-menu");
        if (leftMenu.css('left') === '-256.562px') {
            leftMenu.animate({ left: '0' }, 200);
            $(".open-close-icon").removeClass("fa-align-justify").addClass("fa-x");
            for (let i = 0; i < 5; i++) {
                $(".links li").eq(i).animate({ top: 0 }, (i + 5) * 100);
            }
        } else {
            leftMenu.animate({ left: '-256.562px' }, 200);
            $(".open-close-icon").addClass("fa-align-justify").removeClass("fa-x");
            $(".links li").animate({ top: 300 }, 500);
        }
    });
    $('#searchLink').on('click', function () {
        showSearchInputs()

    });
    $('#categoriesLink').on('click', function () {
        getCategories();
    });
    $('#areaLink').on('click', function () {
        getArea();
    });
    $('#ingredientsLink').on('click', function () {
        getIngredients();
    });
    $('#contactLink').on('click', function () {
        displayContact();
    });
});

/*--------------------------------------- display Category-------------------------------------------------*/

async function getCategories() {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        displayCategories(data.categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}


/*----------------------------------------------- get Area-------------------------------------------*/
async function getArea() {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        displayArea(data.meals.slice(0, 20));
    } catch (error) {
        console.error('Error fetching area:', error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

function displayArea(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
       <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>`;
    }

    rowData.innerHTML = box;
}
async function getAreaMeals(area) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}
function displayIngredients(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
            <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${arr[i].strIngredient}</h3>
                <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>`;
    }

    rowData.innerHTML = box;
}
async function getIngredients() {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        displayIngredients(data.meals.slice(0, 20));
    } catch (error) {
        console.error('Error fetching ingredients:', error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}




let isNameValid = false;
let isEmailValid = false;
let isPhoneValid = false;
let isAgeValid = false;
let isPasswordValid = false;
let isRepasswordValid = false;
function inputsValidation(inputId) {
    const nameInput = document.getElementById('nameInput').value.trim();
    const emailInput = document.getElementById('emailInput').value.trim();
    const phoneInput = document.getElementById('phoneInput').value.trim();
    const ageInput = document.getElementById('ageInput').value.trim();
    const passwordInput = document.getElementById('passwordInput').value.trim();
    const repasswordInput = document.getElementById('repasswordInput').value.trim();
    const nameRegex = /^[a-zA-Z\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,14}$/;
    const ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][0-9]|200)$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => alert.classList.add('d-none'));

    switch (inputId) {
        case 'nameInput':
            if (!nameRegex.test(nameInput)) {
                document.getElementById('nameAlert').classList.remove('d-none');
            }
            break;
        case 'emailInput':
            if (!emailRegex.test(emailInput)) {
                document.getElementById('emailAlert').classList.remove('d-none');
            }
            break;
        case 'phoneInput':
            if (!phoneRegex.test(phoneInput)) {
                document.getElementById('phoneAlert').classList.remove('d-none');
            }
            break;
        case 'ageInput':
            if (!ageRegex.test(ageInput)) {
                document.getElementById('ageAlert').classList.remove('d-none');
            }
            break;
        case 'passwordInput':
            if (!passwordRegex.test(passwordInput)) {
                document.getElementById('passwordAlert').classList.remove('d-none');
            }
            break;
        case 'repasswordInput':
            if (passwordInput !== repasswordInput) {
                document.getElementById('repasswordAlert').classList.remove('d-none');
            }
            break;
        default:
            break;
    }

    // ***************************************Update validation********************
    isNameValid = nameRegex.test(nameInput);
    isEmailValid = emailRegex.test(emailInput);
    isPhoneValid = phoneRegex.test(phoneInput);
    isAgeValid = ageRegex.test(ageInput);
    isPasswordValid = passwordRegex.test(passwordInput);
    isRepasswordValid = passwordInput === repasswordInput;
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = !(isNameValid && isEmailValid && isPhoneValid && isAgeValid && isPasswordValid && isRepasswordValid);

}

function handleSubmit(event) {
    event.preventDefault();

    if (isNameValid && isEmailValid && isPhoneValid && isAgeValid && isPasswordValid && isRepasswordValid) {

        document.getElementById('nameInput').value = '';
        document.getElementById('emailInput').value = '';
        document.getElementById('phoneInput').value = '';
        document.getElementById('ageInput').value = '';
        document.getElementById('passwordInput').value = '';
        document.getElementById('repasswordInput').value = '';
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => alert.classList.add('d-none'));
        document.getElementById('submitBtn').disabled = true;
    }
}
async function getIngredientsMeals(ingredients) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}

function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4">
        <div class="col-md-6">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;

    rowData.innerHTML = "";
}

async function searchByFLetter(term) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}

async function searchByName(term) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}

function displayContact() {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation('nameInput')" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation('emailInput')" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation('phoneInput')" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation('ageInput')" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation('passwordInput')" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation('repasswordInput')" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3" onclick="handleSubmit(event)">Submit</button>
    </div>
</div>`;
    searchContainer.innerHTML = "";

}