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
const deleteCompletedMoviesNode = document.querySelector('.deleteCompletedMovies');

/*Создаём массив, в который будут помещаться наши фильмы*/
let movies = [];

let activeMovies = []; //для вкладки "активные"
let completedMovies = []; //для вкладки "выполненные"

init();
showListMenu();
showDeleteCompletedBtn();


//Работа формы
movieFormNode.addEventListener('submit', addMovie);
//Работа кнопки удаления карточки
movieListNode.addEventListener('click', deleteMovie);
//Работа кнопки изменения содержимого карточки
movieListNode.addEventListener('click', editMovie);
//Работа кнопки изменения состояния карточки
movieListNode.addEventListener('click', doneMovie); /*ДОДЕЛАТЬ*/

//Показать все карточки
allMoviesNode.addEventListener('click', showAllMovies);
//Показать активные карточки
activeMoviesNode.addEventListener('click', showActiveMovies);
//Показать выполненные карточки
completedMoviesNode.addEventListener('click', showCompletedMovies);

//Удалить все выполненные карточки
deleteCompletedMoviesNode.addEventListener('click', deleteCompletedMovies);

/*Функции*/
//Добавляет карточку
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

/*ДОДЕЛАТЬ*/
function editMovie(event) {
    //если кликл произошел не по элементу с атрибутом, выходим из функции
    if (event.target.dataset.action !== 'edit') {
        return;
    }

    //Находим айди конкретного элемента
    const parentNode = event.target.closest('.movie__item');
    const id = Number(parentNode.dataset.id);

    //Новое название
    const newName = prompt('Введите новое значение:');

    //Объявляем элемент label, для дальнейшего его изменения
    const movieLabelNode = document.querySelector('.movie__label');

    //если пользователь ничего не ввёл, выходим из функции
    if (newName === '' || newName == null) {
        return;
    }

    //изменения для вкладки "все"
    if (allMoviesNode.classList.contains('active')) {
        movies.forEach(newMovie => {
            if (id === newMovie.id) {
                movieLabelNode.innerText = newName;
                newMovie.movie = newName;
            }
        });
        renderMovie(movies);
    }

    //изменения для вкладки "активные"
    if (activeMoviesNode.classList.contains('active')) {
        activeMovies.forEach(activeMovie => {
            if (id === activeMovie.id) {
                movieLabelNode.innerText = newName;
                activeMovie.movie = newName;
            }
        });
        renderActive(activeMovies);
    }

    //изменения для вкладки "выполненные"
    if (completedMoviesNode.classList.contains('active')) {
        completedMovies.forEach(completedMovie => {
            if (id === completedMovie.id) {
                movieLabelNode.innerText = newName;
                completedMovie.movie = newName;
            }
        });
        renderCompleted(completedMovies);
    }

    saveToLocalStorage();
}

//Удаляет карточку
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

//Изменяет состояние карточки
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

//Отображение карточки
function renderMovie(movies) {
    movieListNode.innerHTML = '';

    movies.forEach(newMovie => {
        //создаём переменные, в которых будут хранится HTML элементы
        const movieItem = document.createElement('li');
        const movieLabel = document.createElement('label');    
        const movieCheckbox = document.createElement('input');    
        const movieEditBtn = document.createElement('button');
        const movieRemoveBtn = document.createElement('button');

        //добавляем атрибут 'data-id=newMovie.id'
        movieItem.dataset.id = newMovie.id;
        //добавляем атрибут 'data-action=edit'
        movieEditBtn.dataset.action = 'edit'
        //добавляем атрибут 'data-action=delete'
        movieRemoveBtn.dataset.action = 'delete';
        
        //генерируем эти элементы на странице
        movieListNode.appendChild(movieItem);
        movieItem.appendChild(movieCheckbox);
        movieItem.appendChild(movieLabel);
        movieItem.appendChild(movieEditBtn);
        movieItem.appendChild(movieRemoveBtn);

        //добавляем классы к элементам
        movieItem.className = 'movie__item';
        movieCheckbox.className = 'movie__checkbox';
        movieLabel.className = 'movie__label';
        movieEditBtn.className = 'movie__edit';
        movieRemoveBtn.className = 'movie__remove';

        //изменяем текст кнопки 'изменить'
        movieEditBtn.innerText = 'EDIT';

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

//--------------------------------------------------------------------

/*Все*/
function showAllMovies() {
    allMoviesNode.classList.add('active');
    activeMoviesNode.classList.remove('active');
    completedMoviesNode.classList.remove('active');
    renderMovie(movies);
    showDeleteCompletedBtn();
}

/*Активные*/
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
    showDeleteCompletedBtn();
}

function renderActive(activeMovies) {
    movieListNode.innerHTML = '';

    activeMovies.forEach(activeMovie => {
        //создаём переменные, в которых будут хранится HTML элементы
        const movieItem = document.createElement('li');
        const movieLabel = document.createElement('label');    
        const movieCheckbox = document.createElement('input');    
        const movieEditBtn = document.createElement('button');
        const movieRemoveBtn = document.createElement('button');

        //добавляем атрибут 'data-id=newMovie.id'
        movieItem.dataset.id = activeMovie.id;
        //добавляем атрибут 'data-action=edit'
        movieEditBtn.dataset.action = 'edit';
        //добавляем атрибут 'data-action=delete'
        movieRemoveBtn.dataset.action = 'delete';
        
        //генерируем эти элементы на странице
        movieListNode.appendChild(movieItem);
        movieItem.appendChild(movieCheckbox);
        movieItem.appendChild(movieLabel);
        movieItem.appendChild(movieEditBtn);
        movieItem.appendChild(movieRemoveBtn);

        //добавляем классы к элементам
        movieItem.className = 'movie__item';
        movieCheckbox.className = 'movie__checkbox';
        movieLabel.className = 'movie__label';
        movieEditBtn.className = 'movie__edit';
        movieRemoveBtn.className = 'movie__remove';

        //
        movieEditBtn.innerText = 'EDIT';

        //добавляем атрибуты к элементам
        movieCheckbox.setAttribute('type', 'checkbox');
        movieCheckbox.setAttribute('id', activeMovie.id);
        movieLabel.setAttribute('for', activeMovie.id);

        //название фильма отображаем в label
        movieLabel.innerText = activeMovie.movie;

        checkStateCard (movieItem, movieCheckbox, activeMovie);
        });
}

/*Выполненные*/
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
    showDeleteCompletedBtn();
}

function renderCompleted(completedMovies) {
    movieListNode.innerHTML = '';

    completedMovies.forEach(completedMovie => {
        //создаём переменные, в которых будут хранится HTML элементы
        const movieItem = document.createElement('li');
        const movieLabel = document.createElement('label');    
        const movieCheckbox = document.createElement('input');  
        const movieEditBtn = document.createElement('button');  
        const movieRemoveBtn = document.createElement('button');

        //добавляем атрибут 'data-id=newMovie.id'
        movieItem.dataset.id = completedMovie.id;
        //добавляем атрибут 'data-action=remove'
        movieEditBtn.dataset.action = 'edit';
        //добавляем атрибут 'data-action=delete'
        movieRemoveBtn.dataset.action = 'delete';
        
        //генерируем эти элементы на странице
        movieListNode.appendChild(movieItem);
        movieItem.appendChild(movieCheckbox);
        movieItem.appendChild(movieLabel);
        movieItem.appendChild(movieEditBtn);
        movieItem.appendChild(movieRemoveBtn);

        //добавляем классы к элементам
        movieItem.className = 'movie__item';
        movieCheckbox.className = 'movie__checkbox';
        movieLabel.className = 'movie__label';
        movieEditBtn.className = 'movie__edit';
        movieRemoveBtn.className = 'movie__remove';

        //изменяем текст кнопки 'изменить'
        movieEditBtn.innerText = 'EDIT';

        //добавляем атрибуты к элементам
        movieCheckbox.setAttribute('type', 'checkbox');
        movieCheckbox.setAttribute('id', completedMovie.id);
        movieLabel.setAttribute('for', completedMovie.id);

        //название фильма отображаем в label
        movieLabel.innerText = completedMovie.movie;

        checkStateCard (movieItem, movieCheckbox, completedMovie);
        });
}
//--------------------------------------------------------------------

//Функция для удаления выполненных карточек
function deleteCompletedMovies() {
    movies = movies.filter(function(newMovie) {
        if (newMovie.checked === true) {
            return false;
        } else {
            return true;
        }
    })

    renderMovie(movies);
    showListMenu();

    saveToLocalStorage();
}

// Функция показа кнопки для удаления выполненных карточек
function showDeleteCompletedBtn() {
    if (completedMoviesNode.classList.contains('active') || activeMoviesNode.classList.contains('active')) {
        deleteCompletedMoviesNode.classList.add('deleteCompletedMovies_hidden');
    } else {
        deleteCompletedMoviesNode.classList.remove('deleteCompletedMovies_hidden');
    }
}
