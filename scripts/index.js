/*Находим элементы с html*/
//Form:
const movieFormNode = document.querySelector('.movie__form');
//Input:
const movieInputNode = document.querySelector('.movie__form-input');
//ul:
const movieListNode = document.querySelector('.movie__list');

/*Создаём массив, в который будут помещаться наши фильмы*/
let movies = [];

/*Объявляем событие по форме(если нажать enter/button, то происходит отправка)*/
movieFormNode.addEventListener('submit', addMovie);
movieListNode.addEventListener('click', deleteMovie);
movieListNode.addEventListener('click', doneMovie);

/*Функции*/
function addMovie(event) {
    event.preventDefault(); // отменяет стандартное поведение формы

    if (movieInputNode.value === '') { //если в инпуте пусто, выходим из функции
        return;
    }
    
    const movieName = movieInputNode.value; // берём значение с инпута и заносим в переменную

    const newMovie = { //создаём объект(фильм)
        done: false, // выполнен/не вынополнен
        movie: movieName, //Название фильма
        id: Math.random(), // индивидуальный идентификатор для фильма
    }

    movies.push(newMovie);//заносим в массив наш объект(фильм)

    //формируем css класс
    //если newMovie.done = true, то добавляем класс 'inactive', если false - оставляем как есть

    //добавление элемента в список HTML
    let movieHTML = '';
    movies.forEach(function(newMovie, index) {
        movieHTML += `
        <li id="${newMovie.id}" class="movie__item">
            <input
                id="movie_${index}"
                class="movie__checkbox"
                type="checkbox"
            />
            <label class="movie__label" for="movie_${index}"
                >${newMovie.movie}</label
            >
            <button class="movie__remove" data-action="delete"></button>
        </li>
        `;
        
        movieListNode.innerHTML = movieHTML;
    });

    saveToLocalStorage();

    movieInputNode.value = ''; //очищаем инпут
    movieInputNode.focus(); //фокусируем на инпуте обратно
}

function deleteMovie(event) {
    if (event.target.dataset.action !== 'delete') {
        return;
    }

    const parentNode = event.target.closest('.movie__item'); //находим элемент по классу
    
    const id = Number(parentNode.id); //находим id 

    movies = movies.filter(function(newMovie) { //изменяем массив, с помощью фильрации
        if (id === newMovie.id) {
            return false;
        } else {
            return true;
        }
    }) // те айдишники newMovie.id, которые не равны parentNode.id попадают в массив, остальные нет

    saveToLocalStorage();
    
    parentNode.remove();
}

function doneMovie(event) {
    if (!event.target.classList.contains('movie__label')) {
        return;
    }

    const parentNode = event.target.closest('.movie__item');
    
    const id = Number(parentNode.id);

    const newMovie = movies.find(function(newMovie) {
        if (id === newMovie.id) {
            return true;
        }
    })

    newMovie.done = !newMovie.done

    saveToLocalStorage();

    parentNode.classList.toggle('inactive')
}

function saveToLocalStorage() {
    localStorage.setItem('movies', JSON.stringify(movies));
}

if (localStorage.getItem('movies')) {
    movies = JSON.parse(localStorage.getItem('movies'));

    let movieHTML = '';
    movies.forEach(function(newMovie, index) {
        movieHTML += `
        <li id="${newMovie.id}" class="movie__item">
            <input
                id="movie_${index}"
                class="movie__checkbox"
                type="checkbox"
            />
            <label class="movie__label" for="movie_${index}"
                >${newMovie.movie}</label
            >
            <button class="movie__remove" data-action="delete"></button>
        </li>
        `;
        
        movieListNode.innerHTML = movieHTML;
    });
}

