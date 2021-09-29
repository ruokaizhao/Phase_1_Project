const movieList = [];
document.addEventListener('DOMContentLoaded', () => {   
    fetch('https://mcuapi.herokuapp.com/api/v1/movies')
    .then((resp) => resp.json())
    .then((json) => {
    //The incoming data is an Object with only one key/value pair,
    //the key is 'data', and value is an array of Objects.
    //So here e would be one element of the array which is an Object.
        json.data.forEach((e) => {
            if (e.phase === null) {
    //There are some movies which have no accurate data, so I will be
    //better off exclude those movies to make the page look nice.
    //Also, without removing those data, I will get 
    //"GET file://wsl%24/Ubuntu/home/ruokai/Development/my-projects/phase-1-project/null 
    //net::ERR_FILE_NOT_FOUND" error message, don't know the reason,
    //maybe it's just the code is telling me that "cannot retrieve some 
    //data from remote API.
            } else {
                movieList.push(e);
            };
        });
        movieList.forEach((e) => {
            renderData(e);
        });
    });
})

document.querySelector('select#select').addEventListener('change', (change) => {
    const phaseList = [];
    const figure = document.querySelector('figure');
    movieList.forEach((e) => {
        if (e.phase === parseInt(change.target.value)) {
            phaseList.push(e)
        }
    });
    figure.textContent = '';
    phaseList.forEach((e) => {
        renderData(phaseList);
    });
})

function renderData(data) {
    //If you define the section in the above code block, instead of hard
    //coding it into index.html, somehow, you cannot call section here.
    //So for now, you better hard code the basic structure of html in
    //index.html and only define tags that change with each iteration here.
    const section = document.querySelector('section');
    const figure = document.createElement('figure');
    figure.className = data.phase;
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
    } else {
        boxOffice.textContent = `Box office: ${data['box_office']}`;
    }    
    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release date: ${data['release_date']}`;
    figure.appendChild(imageHolder);
    figure.appendChild(title);
    figure.addEventListener('click', (e) => {
        figure.textContent = data.overview;
    });
    figure.appendChild(boxOffice);
    figure.appendChild(releaseDate);            
}