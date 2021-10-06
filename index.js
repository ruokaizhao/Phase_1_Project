    //Render the page using data from the json-server

    //There are some movies which have no accurate data, so I will be
    //better off exclude those movies to make the page look nice.
    //Also, without removing those data, I will get 
    //"GET file://wsl%24/Ubuntu/home/ruokai/Development/my-projects/phase-1-project/null 
    //net::ERR_FILE_NOT_FOUND" error message, don't know the reason,
    //maybe it's just the code is telling me that "cannot retrieve some 
    //data from remote API.

    //The incoming data is an Object with only one key/value pair,
    //the key is 'data', and value is an array of Objects.

const movieList = [];
document.addEventListener('DOMContentLoaded', () => {
    initialize();  
}) 

    //Add event listener so that when a user choose a phase, the corresponding
    //movies will be shown. I was putting phaseList outside of the event listener,
    //which cause the phaseList array not resetting, and data got piled up,
    //which result in not filtering the correct movies.

document.addEventListener('DOMContentLoaded', () => {
    handleDropdown();
})

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#movie-name');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const section = document.querySelector('section');
        let counter = 0;
        movieList.forEach((movie) => {
            if (movie.title === e.target.movie.value) {
                section.textContent = '';
                renderData(movie);
                counter += 1;
            };
        });
        if (counter === 0) {
            alert('No matches, please check your spelling or try different keywords');
        };
        form.reset();
    });
})

    //If you define the section in the above code block, instead of hard
    //coding it into index.html, somehow, you cannot call section here.
    //So for now, you better hard code the basic structure of html in
    //index.html and only define tags that change with each iteration here.

function renderData(data) {

    //Create a container for each movie
    const section = document.querySelector('section');
    const figure = document.createElement('figure');
    figure.className = 'container';
    section.appendChild(figure);

    //Create image
    const imageHolder = document.createElement('img');
    imageHolder.src = data['cover_url'];
    imageHolder.className = 'image';
    imageHolder.alt = data.title;    
    figure.appendChild(imageHolder);

    //Create title
    const title = document.createElement('h4');
    title.textContent = data.title;
    figure.appendChild(title);

    //Create box office
    const boxOffice = document.createElement('p');
    if (data['box_office'] === '0') {
        boxOffice.textContent = 'Box office: Not yet released'
    } else if (parseInt(data['box_office']) < 1.0e+9) {
        boxOffice.textContent = `Box office: $${Math.floor(parseInt(data['box_office'])/1.0e+6)} million`;
      } else {
        boxOffice.textContent = `Box office: $${Math.floor(parseInt(data['box_office'])/1.0e+9*100)/100} billion`;        
        }
    figure.appendChild(boxOffice);

    //Create increase box office
    const increaseBoxOffice = document.createElement('button');
    increaseBoxOffice.className = 'btn'
    increaseBoxOffice.textContent = 'Increase box office by 10 million'
    increaseBoxOffice.addEventListener('click', (e) => {
        if (data['box_office'] === '0') {
            alert('Movie not yet released');
        } else {
            data['box_office'] = parseInt(data['box_office']) + 1.0e+7;
        }
        if (data['box_office'] === '0') {
            boxOffice.textContent = 'Box office: Not yet released'
        } else if (parseInt(data['box_office']) < 1.0e+9) {
            boxOffice.textContent = `Box office: $${Math.floor(parseInt(data['box_office'])/1.0e+6)} million`;
          } else {
            boxOffice.textContent = `Box office: $${Math.floor(parseInt(data['box_office'])/1.0e+9*100)/100} billion`;        
            }         
    })
    figure.appendChild(increaseBoxOffice);

    //Create release date
    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release date: ${data['release_date']}`;
    figure.appendChild(releaseDate);
    
    //Create storyline
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    details.className = 'btn1';
    summary.className = 'btn2';
    summary.textContent = 'Storyline:';
    details.textContent = data.overview;
    details.appendChild(summary);
    figure.appendChild(details);

    //Create trailer
    const trailer = document.createElement('button')
    trailer.className = 'btn';
    trailer.textContent = 'Play trailer';
    trailer.addEventListener('click', () => {
        if (document.querySelector(`#${data['imdb_id']}`)) {
            document.querySelector(`#${data['imdb_id']}`).remove();
        } else {        
            const iframe = document.createElement('iframe');
            iframe.id = data['imdb_id'];
            iframe.src = data['trailer_url'];
            iframe.width = 400;
            iframe.height = 170
            iframe.allowFullscreen = true;
            iframe.frameborder = 0;
            figure.appendChild(iframe);
        };                
    });
    figure.appendChild(trailer)
}

function initialize() {
    fetch('https://mcuapi.herokuapp.com/api/v1/movies')
    .then((resp) => resp.json())
    .then((json) => {
        json.data.forEach((e) => {
            if (e.phase === null) {
            } else {
                movieList.push(e);
            };
        });
        movieList.forEach((e) => {
            renderData(e);
        })     
    });
}

function handleDropdown() {
    document.querySelector('select').addEventListener('change', (change) => {
        const phaseList = [];
        const section = document.querySelector('section');
        if (change.target.value === '') {
            section.textContent = '';
            movieList.forEach((e) => {
                renderData(e);
            })       
        } else {
            movieList.forEach((e) => {
                if (e.phase === parseInt(change.target.value)) {
                    phaseList.push(e)
                }
            });
            section.textContent = '';
            phaseList.forEach((e) => {
                renderData(e);
            });
        }    
    })
}