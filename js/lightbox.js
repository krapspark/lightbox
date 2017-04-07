(function() {

var PLACEHOLDER = '%NAME%';
var URL = 'https://www.googleapis.com/customsearch/v1?cx=006168523920436498670:-alofrs5wsa&key=AIzaSyDV2IycU_06wj4R8aE7ozfyer4iRu7FiJQ&searchType=image&q='
  + PLACEHOLDER;

var rootNode = document.getElementById('image-container');
var animalData;

var DATA_ID = 'data-id';
var THUMBNAIL_CLASS = 'thumbnail';

var currentIndex = 0;

var cachedData = {};

function el(type) {
  return document.createElement(type);
};

function getEl(id) {
  return document.getElementById(id);
}

function fetchImageData(name, callback) {
  var url = URL.replace(PLACEHOLDER, encodeURIComponent(name));

  if (cachedData[url]) {
    callback(cachedData[url]);
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      cachedData[url] = data; 
      callback(data);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

function fetchAnimals(animal) {
  fetchImageData(animal, renderThumbnails);
}

function renderThumbnails(data) {
  while (rootNode.firstChild) {
    rootNode.removeChild(rootNode.firstChild);
  }

  if (data && data.items && data.items.length > 0) {
    animalData = data.items;
    data.items.forEach(function(item, index) {
      var container = el('div');
      container.classList.add(THUMBNAIL_CLASS);
      container.setAttribute(DATA_ID, index);

      var image = el('img');
      image.src = item.image.thumbnailLink;
      container.appendChild(image);

      rootNode.appendChild(container);
    });
  }
}

function addAnimalButtonHandlers() {
  var buttonRow = getEl('button-row'); 
  buttonRow.onclick = function(e) {
    if (e.target && e.target.nodeName === 'BUTTON') {
      fetchAnimals(e.target.getAttribute('data-animal'));
    }
  };
}

function addLightboxButtonHandlers() {
  getEl('left-button').onclick = showLeftPicture; 
  getEl('right-button').onclick = showRightPicture; 
  getEl('close-button').onclick = dismissLightbox;
}

function showLeftPicture() {
  showLightbox(--currentIndex);
}

function showRightPicture() {
  showLightbox(++currentIndex);
}

function showLightbox(index) {
  if (index) {
    var data = animalData[index];
    currentIndex = index;
    var lightboxContainer = getEl('lightbox-container');
    lightboxContainer.classList.add('visible');

    var imageTitle = getEl('image-title');
    imageTitle.innerText = data.title;

    var imageContainer = getEl('lightbox-image-container');

    while(imageContainer.firstChild) {
      imageContainer.removeChild(imageContainer.firstChild);
    }

    var image = el('img');
    image.src = data.link;
    imageContainer.appendChild(image);
  }
}

function dismissLightbox() {
  var lightboxContainer = getEl('lightbox-container');
  lightboxContainer.classList.remove('visible');
}

function attachThumbnailHandler() {
  var container = getEl('image-container');

  container.onclick = function(e) {
    var target = e.target;
    while(target && target.getAttribute('id') !== 'image-container') {
      if (target.classList.contains(THUMBNAIL_CLASS)) {
        showLightbox(target.getAttribute(DATA_ID));
      }

      target = target.parentNode;
    }
  }
}

fetchAnimals('dog');
addAnimalButtonHandlers();
addLightboxButtonHandlers();
attachThumbnailHandler();

})();