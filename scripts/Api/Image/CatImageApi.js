const URL_CAT_IMAGES = 'https://cataas.com/api/cats?limit=';
const URL_CAT_ID_IMAGE = 'https://cataas.com/cat/';
const CAT_ID_KEY = 'id'

export function fetchImages(count){
   return  fetch(`${URL_CAT_IMAGES}${count}`)
        .then(response => response.json())
        .then(json => toList(Object.values(json)))
        .catch(error => { console.error(error); return []; });
}

function toList(json){
    const catsData = Object.values(json);
    const catIds = catsData.map((cat) => cat[CAT_ID_KEY])
    return catIds.map(id => `${URL_CAT_ID_IMAGE}${id}`);
}