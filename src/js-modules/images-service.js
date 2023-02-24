const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '33896615-ace76cd589cb7d39e22f51a75';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.loadedHits = 0;
    }

    fetchImages() {
    return fetch(`${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&per_page=40&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`)
            .then(response => response.json())
        .then(images => {
            this.page += 1;
            this.loadedHits += images.hits.length;
            return images;
        })
    }

    resetPage() {
        this.page = 1;
    }

    resetHits() {
        this.loadedHits = 0;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}