/*Находим элементы с html*/
//Form:
const movieFormNode = document.querySelector('.movie__form');
//Input:
const movieInputNode = document.querySelector('.movie__form-input');
//ul:
const movieListNode = document.querySelector('.movie__list');
//ul-menu:
const movieListMenuNode = document.querySelector('.movie__list-menu');
//Active_movies
const completedMoviesNode = document.querySelector('.movie__completed');
//movie__all
const allMoviesNode = document.querySelector('.movie__all');
//movie__active
const activeMoviesNode = document.querySelector('.movie__active');
//deleteCompleted
const deleteCompletedMovieNode = document.querySelector('.movie__deleteCompletedBtn');

/*Создаём массив, в который будут помещаться наши фильмы*/
let movies = [];

let activeMovies = []; //для вкладки "активные"
let completedMovies = []; //для вкладки "выполненные"

init();
showListMenu();


/*Объявляем событие по форме(если нажать enter/button, то происходит отправка)*/
movieFormNode.addEventListener('submit', addMovie);
movieListNode.addEventListener('click', deleteMovie);
movieListNode.addEventListener('click', doneMovie);

/*Функции*/
function addMovie(event) {
    event.preventDefault();//обнуляем поведение формы

    if (!movieInputNode.value) {
        return;
    }
    
    const movieName = movieInputNode.value;//объявляем переменную со значением с инпута

    const newMovie = {
        id: Math.random(),//задаём рандомный айдишник
        movie: movieName,//свойству присваваем значение переменной movieName
        checked: false,//добавляем состояние выполненно/нет
    }

    movies.unshift(newMovie);

    renderMovie(movies);

    saveToLocalStorage();
    showListMenu();

    movieInputNode.value = '';
    movieInputNode.focus();
}

function deleteMovie(event) {
    //если кликл произошел не по элементу с атрибутом, выходим из функции 
    if(event.target.dataset.action !== 'delete') {
        return;
    }
    //в противном случае выполняем код:
    const parentNode = event.target.closest('.movie__item'); //находим элемент по классу
    const id = Number(parentNode.dataset.id); //находим айди элемента по которому было совершенно действие

    //изменяем массив с помощью фильрации
    //если айди равен newMovie.id, значит элемент нужно удалить, поэтому возвращаем false и элемент не проходит в новый массив
    movies = movies.filter(function(newMovie) {
        if (id === newMovie.id) {
            return false;
        } else {
            return true;
        }
    })

    saveToLocalStorage();
    showListMenu();
    
    //удаляем элемент из разметки
    parentNode.remove();

}

function doneMovie(event) {
    //если клик был совершён не по label, выходим из функции
    if (!event.target.classList.contains('movie__label')){
        return;
    }

    const parentNode = event.target.closest('.movie__item');
    const id = Number(parentNode.dataset.id);
    // const checkboxNode = document.getElementById(id);

    const newMovie = movies.find(function(newMovie) {
        if (id === newMovie.id) {
            return true;
        }
    })

    
    newMovie.checked = !newMovie.checked;

    if (allMoviesNode.classList.contains('active')) {
        showAllMovies();
    }

    if (activeMoviesNode.classList.contains('active')) {
        showActiveMovies();
    }

    if (completedMoviesNode.classList.contains('active')) {
        showCompletedMovies();
    }

    saveToLocalStorage();

    parentNode.classList.toggle('inactive');
}

//Создание карточки
function renderMovie(movies) {
    movieListNode.innerHTML = '';

    movies.forEach(newMovie => {
        //создаём переменные, в которых будут хранится HTML элементы
        const movieItem = document.createElement('li');
        const movieLabel = document.createElement('label');    
        const movieCheckbox = document.createElement('input');    
        const movieRemoveBtn = document.createElement('button');

        //добавляем атрибут 'data-id=newMovie.id'
        movieItem.dataset.id = newMovie.id;
        //добавляем атрибут 'data-action=delete'
        movieRemoveBtn.dataset.action = 'delete';
        
        //генерируем эти элементы на странице
        movieListNode.appendChild(movieItem);
        movieItem.appendChild(movieCheckbox);
        movieItem.appendChild(movieLabel);
        movieItem.appendChild(movieRemoveBtn);

        //добавляем классы к элементам
        movieItem.className = 'movie__item';
        movieCheckbox.className = 'movie__checkbox';
        movieLabel.className = 'movie__label';
        movieRemoveBtn.className = 'movie__remove';

        //добавляем атрибуты к элементам
        movieCheckbox.setAttribute('type', 'checkbox');
        movieCheckbox.setAttribute('id', newMovie.id);
        movieLabel.setAttribute('for', newMovie.id);

        //название фильма отображаем в label
        movieLabel.innerText = newMovie.movie;

        checkStateCard (movieItem, movieCheckbox, newMovie);
    });
}

// Проверка состояния карточки
function checkStateCard (movieItem, movieCheckbox, newMovie) {
    if (newMovie.checked) {
        movieItem.classList.add('inactive');
        movieCheckbox.setAttribute('checked', '');
    } else {
        movieItem.classList.remove('inactive');
        movieCheckbox.setAttribute('unchecked', '');
    };
}

//Сохранение данных в локальное хранилище
function saveToLocalStorage() {
    localStorage.setItem('movies', JSON.stringify(movies));
}

//Подгрузка данных из localStorage
function init() {
    if (localStorage.getItem('movies')) {
    movies = JSON.parse(localStorage.getItem('movies'));

    renderMovie(movies);
    }
}

//функция отображения меню
function showListMenu() {
    if (movies.length > 0) {
        movieListMenuNode.classList.remove('movie__list-menu_hidden');
    } else if (movies.length == 0) {
        movieListMenuNode.classList.add('movie__list-menu_hidden');
    }
}

/*Выполненные*/
completedMoviesNode.addEventListener('click', showCompletedMovies);

function showCompletedMovies() {
    completedMoviesNode.classList.add('active');
    allMoviesNode.classList.remove('active');
    activeMoviesNode.classList.remove('active');

     completedMovies = movies.filter(function(newMovie) {
        if (newMovie.checked === true) {
            return true;
        } else {
            return false;
        }
    })
    renderCompleted(completedMovies);
}

function renderCompleted(completedMovies) {
    movieListNode.innerHTML = '';

    completedMovies.forEach(newMovie => {
        //создаём переменные, в которых будут хранится HTML элементы
        const movieItem = document.createElement('li');
        const movieLabel = document.createElement('label');    
        const movieCheckbox = document.createElement('input');    
        const movieRemoveBtn = document.createElement('button');

        //добавляем атрибут 'data-id=newMovie.id'
        movieItem.dataset.id = newMovie.id;
        //добавляем атрибут 'data-action=delete'
        movieRemoveBtn.dataset.action = 'delete';
        
        //генерируем эти элементы на странице
        movieListNode.appendChild(movieItem);
        movieItem.appendChild(movieCheckbox);
        movieItem.appendChild(movieLabel);
        movieItem.appendChild(movieRemoveBtn);

        //добавляем классы к элементам
        movieItem.className = 'movie__item';
        movieCheckbox.className = 'movie__checkbox';
        movieLabel.className = 'movie__label';
        movieRemoveBtn.className = 'movie__remove';

        //добавляем атрибуты к элементам
        movieCheckbox.setAttribute('type', 'checkbox');
        movieCheckbox.setAttribute('id', newMovie.id);
        movieLabel.setAttribute('for', newMovie.id);

        //название фильма отображаем в label
        movieLabel.innerText = newMovie.movie;

        checkStateCard (movieItem, movieCheckbox, newMovie);
        });
}
//--------------------------------------------------------------------

/*Все*/
allMoviesNode.addEventListener('click', showAllMovies);

function showAllMovies() {
    allMoviesNode.classList.add('active');
    activeMoviesNode.classList.remove('active');
    completedMoviesNode.classList.remove('active');
    renderMovie(movies);
}

/*Активные*/
activeMoviesNode.addEventListener('click', showActiveMovies);

function showActiveMovies() {
    activeMoviesNode.classList.add('active');
    allMoviesNode.classList.remove('active');
    completedMoviesNode.classList.remove('active');

    activeMovies = movies.filter(function(activeMovie) {
        if (activeMovie.checked === false) {
            return true;
        } else {
            return false;
        }
    })

    renderActive(activeMovies);
}


function renderActive(activeMovies) {
    movieListNode.innerHTML = '';

    activeMovies.forEach(activeMovie => {
        //создаём переменные, в которых будут хранится HTML элементы
        const movieItem = document.createElement('li');
        const movieLabel = document.createElement('label');    
        const movieCheckbox = document.createElement('input');    
        const movieRemoveBtn = document.createElement('button');

        //добавляем атрибут 'data-id=newMovie.id'
        movieItem.dataset.id = activeMovie.id;
        //добавляем атрибут 'data-action=delete'
        movieRemoveBtn.dataset.action = 'delete';
        
        //генерируем эти элементы на странице
        movieListNode.appendChild(movieItem);
        movieItem.appendChild(movieCheckbox);
        movieItem.appendChild(movieLabel);
        movieItem.appendChild(movieRemoveBtn);

        //добавляем классы к элементам
        movieItem.className = 'movie__item';
        movieCheckbox.className = 'movie__checkbox';
        movieLabel.className = 'movie__label';
        movieRemoveBtn.className = 'movie__remove';

        //добавляем атрибуты к элементам
        movieCheckbox.setAttribute('type', 'checkbox');
        movieCheckbox.setAttribute('id', activeMovie.id);
        movieLabel.setAttribute('for', activeMovie.id);

        //название фильма отображаем в label
        movieLabel.innerText = activeMovie.movie;

        checkStateCard (movieItem, movieCheckbox, activeMovie);
        });
}

