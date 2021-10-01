const movieList = [];

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

document.addEventListener('DOMContentLoaded', () => {
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
    const reset = document.querySelector('#reset');
    reset.addEventListener('click', () => {
        fetch('http://localhost:3000/data/1', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
                Accept: 'application/json'
            }
        })
        .then(() => {
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
        })
    })
})

    //Add event listener so that when a user choose a phase, the corresponding
    //movies will be shown. I was putting phaseList outside of the event listener,
    //which cause the phaseList array not resetting, and data got piled up,
    //which result in not filtering the correct movies.

document.addEventListener('DOMContentLoaded', () => {
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
}) 

    //If you define the section in the above code block, instead of hard
    //coding it into index.html, somehow, you cannot call section here.
    //So for now, you better hard code the basic structure of html in
    //index.html and only define tags that change with each iteration here.

function renderData(data) {
    const section = document.querySelector('section');
    const figure = document.createElement('figure');
    figure.className = 'container-fluid';
    section.appendChild(figure);
    const imageHolder = document.createElement('img');
    imageHolder.src = data['cover_url'];
    imageHolder.className = 'image';
    imageHolder.alt = data.title;  
    const title = document.createElement('h4');
    title.textContent = data.title;
    const boxOffice = document.createElement('p');
    if (data['box_office'] === '0') {
        boxOffice.textContent = 'Box office: Not yet released'
    } else if (parseInt(data['box_office']) < 1.0e+9) {
        boxOffice.textContent = `Box office: $${Math.floor(parseInt(data['box_office'])/1.0e+6)} million`;
      } else {
        boxOffice.textContent = `Box office: $${Math.floor(parseInt(data['box_office'])/1.0e+9*100)/100} billion`;        
        }  
    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release date: ${data['release_date']}`;
    figure.appendChild(imageHolder);
    figure.appendChild(title);
    const increaseBoxOffice = document.createElement('button');
    increaseBoxOffice.className = 'btn btn-info'
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
    figure.appendChild(boxOffice);
    figure.appendChild(releaseDate);
    figure.appendChild(increaseBoxOffice);    
    
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'Storyline';
    details.textContent = data.overview;
    details.appendChild(summary);
    figure.appendChild(details);

    const trailer = document.createElement('button')
    figure.appendChild(trailer)
    trailer.textContent = 'Play trailer';
    trailer.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = data['trailer_url'];
        iframe.allowFullscreen;
        iframe.frameborder = 0
        figure.appendChild(iframe);
    })
}
