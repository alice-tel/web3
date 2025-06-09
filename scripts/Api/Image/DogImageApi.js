const URL_DOG_IMAGES = 'https://dog.ceo/api/breeds/image/random/';


export function fetchImages(count){
    return fetch(`${URL_DOG_IMAGES}${count}`)
        .then(response => response.json())
        .then(json => Object.values(json)[0])
        .catch(error => { console.error(error); return []; });
}