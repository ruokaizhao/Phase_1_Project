const movieList = [];
document.addEventListener('DOMContentLoaded', () => {
    initialize();
    handleDropdown();
    const form = document.querySelector('#movie-name');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const section = document.querySelector('section');
        let counter = 0;
        const searchingList = [];
        movieList.forEach((movie) => {
            if (movie.title.toLowerCase().includes(e.target.movie.value.toLowerCase())) {
                searchingList.push(movie);
                counter += 1;
            };
        });
        if (counter === 0) {
            alert('No matches, please check your spelling or try different keywords');
        } else {
            section.textContent = '';
            searchingList.forEach((e) => renderData(e))
        }
        form.reset();
    });
})

function renderData(data) {

    const section = document.querySelector('section');
    const figure = document.createElement('figure');
    figure.className = 'container';
    section.appendChild(figure);

    const imageHolder = document.createElement('img');
    imageHolder.src = data['cover_url'];
    imageHolder.className = 'image';
    imageHolder.alt = data.title;    
    figure.appendChild(imageHolder);

    const title = document.createElement('h4');
    title.textContent = data.title;
    figure.appendChild(title);

    const boxOffice = document.createElement('p');
    if (data['box_office'] === '0') {
        boxOffice.textContent = 'Box office: Not yet released'
    } else if (parseInt(data['box_office']) < 1.0e+9) {
        boxOffice.textContent = `Box office: $${Math.floor(parseInt(data['box_office'])/1.0e+6)} million`;
      } else {
        boxOffice.textContent = `Box office: $${Math.floor(parseInt(data['box_office'])/1.0e+9*100)/100} billion`;        
        }
    figure.appendChild(boxOffice);

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

    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release date: ${data['release_date']}`;
    figure.appendChild(releaseDate);
    
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    details.className = 'btn1';
    summary.className = 'btn2';
    summary.textContent = 'Storyline:';
    details.textContent = data.overview;
    details.appendChild(summary);
    figure.appendChild(details);

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
            if (e.phase !== null) {
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