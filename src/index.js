import ImagesApiService from './js-modules/images-service';
import renderMarkup from './js-modules/renderMarkup';
import LoadMoreButton from './js-modules/load-more';
import Notiflix from 'notiflix';
import axios, { isCancel, AxiosError } from 'axios';



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


async function onFindImages(e) {
    e.preventDefault();

    const inputValue = e.currentTarget.elements.searchQuery.value;
    imagesApiService.query = inputValue;

    if (inputValue === '') {
        return onError();
    } 
    imagesApiService.resetPage();
    imagesApiService.resetHits();
    clearImagesContainer();

    try {
        const {hits, totalHits} = await imagesApiService.fetchImages();
        if (hits.length === 0) {
            loadMoreBtn.hide();
            return onError();
    }
            foundTotalHitsNotification(totalHits);
            appendImagesMarkup(hits);
            loadMoreBtn.show();
            loadMoreBtn.enable();
    } catch (error) {
        console.log(error)
    }
};

async function onLoadMore() {
    const { totalHits, hits } = await imagesApiService.fetchImages();
    try {
        if (imagesApiService.loadedHits >= totalHits) {
        loadMoreBtn.disable();
        return endLoadMore();
    } else {
        return appendImagesMarkup(hits);
    };
    } catch (error) {
        console.log(error)
    }
};




function onError() {
    return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
};

function endLoadMore() {
    return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
};

function appendImagesMarkup(images) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', renderMarkup(images));
};

function clearImagesContainer() {
    refs.galleryContainer.innerHTML = '';
};

function foundTotalHitsNotification(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
};


