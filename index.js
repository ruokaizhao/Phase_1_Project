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

    //Reset the json-server to empty and POST the data retrieved from
    //remote API to json-server so that the data is not duplicately added
    //to the database.

    //Add a button to manually reset database and retrieve and POST data
    //to the database.

    //The purpose of this is that because if the database is not fresh 
    //POST(for instance, close vs code and reopen it), it cannot be accessed 
    //by "http://localhost:3000/data/1", so I came up with this solution. 
    //It may be difficult to read and does not make a lot of sense, but I sure learned
    //something from it.

const movieList = [];
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/data')
        .then((resp) => resp.json())        
        .then((json) => {
            if (json.length === 0) {
                postDatabase();                          
            }
        })
        //The page will be rendered after 2 seconds to allow the database to be POSTed.
        setTimeout(function() {
            initialize();    
            const reset = document.querySelector('#reset');
            reset.addEventListener('click', () => {
                resetDatabase();
            })          
        }, 2000)           
})

document.addEventListener('DOMContentLoaded', () => {    
    const empty = document.querySelector('#empty');
    empty.addEventListener('click', () => {
        emptyDatabase();
    })
})   

    //Add event listener so that when a user choose a phase, the corresponding
    //movies will be shown. I was putting phaseList outside of the event listener,
    //which cause the phaseList array not resetting, and data got piled up,
    //which result in not filtering the correct movies.

document.addEventListener('DOMContentLoaded', () => {
    handleDropdown();
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
    figure.appendChild(trailer)
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
}

//Modular functions
function initialize() {
    fetch('http://localhost:3000/data/')
    .then((resp) => resp.json())
    .then((json) => {
        json[0].forEach((e) => {
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

function postDatabase() {
    fetch('https://mcuapi.herokuapp.com/api/v1/movies')
    .then((resp) => resp.json())        
    .then((json) => {
        fetch('http://localhost:3000/data', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json', 
            Accept: 'application/json'
            },
            body: JSON.stringify(json.data)
        })           
    })   
}

function emptyDatabase() {
    fetch('http://localhost:3000/data/1', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json', 
            Accept: 'application/json'
        }
    })   
}

function resetDatabase() {
    emptyDatabase();
    setTimeout(postDatabase, 1000);
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