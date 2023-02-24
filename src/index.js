import Notiflix from 'notiflix';
import axios, { isCancel, AxiosError } from 'axios';
import ImagesApiService from './js-modules/images-service'
import renderMarkup from './js-modules/renderMarkup';
import LoadMoreButton from './js-modules/load-more';

const refs = {
    galleryContainer: document.querySelector('.gallery'),
    form: document.querySelector('.search-form'),
    // loadMoreBtn: document.querySelector('.load-more'),
};

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreButton({
    selector: '.load-more',
});

refs.form.addEventListener('submit', onFindImages);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);


function onFindImages(e) {
    e.preventDefault();

    const inputValue = e.currentTarget.elements.searchQuery.value;
    imagesApiService.query = inputValue;

    if (inputValue === '') {
        return onError();
    } 
    
    imagesApiService.resetPage();
    imagesApiService.resetHits();
    clearImagesContainer();

    imagesApiService.fetchImages()
        .then(({ hits, totalHits }) => {
            if (hits.length === 0) {
                loadMoreBtn.hide();
                return onError();
            }
            appendImagesMarkup(hits);
            foundTotalHitsNotification(totalHits);
            loadMoreBtn.show();
            loadMoreBtn.enable();
        });
};

function onLoadMore() {
    return imagesApiService.fetchImages()
        .then(({totalHits, hits}) => {
            if (imagesApiService.loadedHits >= totalHits) {
                loadMoreBtn.disable();
                return endLoadMore();
            } else {
                appendImagesMarkup(hits);
            };
        });
}


function onError() {
    return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
}

function endLoadMore() {
    return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
}

function appendImagesMarkup(images) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', renderMarkup(images))
}

function clearImagesContainer() {
    refs.galleryContainer.innerHTML = '';
}

function foundTotalHitsNotification(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
};
