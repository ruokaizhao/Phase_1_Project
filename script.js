document.addEventListener('DOMContentLoaded', () => {   
    fetch('https://mcuapi.herokuapp.com/api/v1/movies')
    .then((resp) => resp.json())
    .then((json) => {
        json.data.forEach((e) => {
            renderData(e);
        });
    }) 
})

function renderData(data) {
    const section = document.querySelector('section');
    const figure = document.createElement('figure');
    figure.className = 'card';
    section.appendChild(figure);
    const imageHolder = document.createElement('img');
    imageHolder.src = data.cover_url;
    imageHolder.className = 'image';
    imageHolder.alt = data.title;  
    const title = document.createElement('h4');
    title.textContent = data.title;
    const boxOffice = document.createElement('p');
    boxOffice.textContent = data['box_office'];
    figure.appendChild(imageHolder);
    figure.appendChild(title);
    figure.addEventListener('click', (e) => {
        figure.textContent = data.overview;
    })
    // if (data['box_office'] === '0') {
    //     figure.appendChild(`Will be released on: ${data['release_date']}`)            
    // } else {
    //     figure.appendChild(boxOffice)
    //   };
}