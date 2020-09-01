/** 
* Junio Marques - Frontend Developer
* personal web: http://juniomarques.com
**/
let categoryListCopy;
let dataCategory;
let title = document.getElementsByClassName('inner-title')[0];
const urlBase = 'https://www.netflix.com/browse/genre/';
// DOM Elements
const inputSearch = document.getElementById('search-category'),
      btnLang = document.querySelectorAll('.btn-lang'),
      mainList = document.getElementById('main-list');

function openinCurrentTab(href){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {chrome.tabs.update(tabs[0].id, {url: href});
    });
}

fetch('./category.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    dataCategory = data;
    const { category_data_eng } = data;
    categoryListCopy = category_data_eng;
    selectedSearch();
    translaterText('btn-lang-eng');
    let categoryList = category_data_eng.map((category)=>{  return `<li class="go-category" data-url=${category.url}>
                    <a title=${category.name}>
                      ${category.name}
                    </a>
                </li>`;
    }).join('')
    innerNumberTotalCategories(categoryListCopy.length);
    mainList.innerHTML = categoryList;
  });

// Events DOM
inputSearch.addEventListener('keyup', evt => {

  const newCategoryList = [...categoryListCopy];
  const query = evt.target.value.replace(/\w\S*/g, function(query){
      return query.charAt(0).toUpperCase() + query.substr(1).toLowerCase();
  });
  let count = 0;
  let categoryFilter = newCategoryList.map((category)=>{

    const categoryName = category.name.replace(/\w\S*/g, function(query){
      return query.charAt(0).toUpperCase() + query.substr(1).toLowerCase();
    });

    if(categoryName.indexOf(query)>-1) {
      count ++;
      return `<li class="go-category" data-url=${category.url}><a title=${category.name}>${category.name}</a></li>`;
    }
    
  }).join('');

  mainList.innerHTML = categoryFilter;
  innerNumberTotalCategories(count);
});

btnLang.forEach(item => {

  item.addEventListener('click', e => {

    let elPath = e.path[1],
        dataLang = elPath.attributes[2].nodeValue;
        lang = elPath.id;
        
    deleteClassesBtn();
    item.classList.add('lang-active');
    translaterLang(dataLang);
    translaterText(lang);

    selectedSearch();
    inputSearch.value = '';

  });

  
});

function deleteClassesBtn() {
  document.querySelectorAll('.btn-lang').forEach(item => {
    item.classList.remove('lang-active');
  });
}

function innerNumberTotalCategories(totalCategories) {
  document.getElementsByClassName('count')[0].innerHTML = totalCategories;
}

function translaterText(lang) {
  textTranslater = {
    en: 'Categories',
    por: 'Categorias',
    es: 'Categorías'
  };
  if(lang.indexOf('btn-lang-eng') > -1){
    title.innerHTML = textTranslater.en;
  } else if(lang.indexOf('btn-lang-por') > -1) {
    title.innerHTML = textTranslater.por;
  } else {
    title.innerHTML = textTranslater.es;
  }
}

function translaterLang(lang) {

  let langList;

  if(lang.indexOf('category_data_eng')>-1) {
    langList = dataCategory.category_data_eng;
    innerNumberTotalCategories(dataCategory.category_data_eng.length);
  } else if(lang.indexOf('category_data_por')>-1) {
    langList = dataCategory.category_data_por;
    innerNumberTotalCategories(dataCategory.category_data_por.length);
  } else {
    langList = dataCategory.category_data_es;
    innerNumberTotalCategories(dataCategory.category_data_es.length);
  }

  categoryListCopy = langList; 

  let categoryList = langList.map((category)=>{
      return `<li class="go-category" data-url=${category.url}>
                  <a title=${category.name}>
                    ${category.name}
                  </a>
              </li>`;
  }).join('')

  mainList.innerHTML = categoryList;
}

$('#main-list').on('click', '.go-category', function(){
  let _this = $(this),
      urlId = _this.data('url').split('/').pop();

  $('.go-category').removeClass('active');
  _this.addClass('active');

  const url = urlBase+urlId;
  openinCurrentTab(url);

});



inputSearch.addEventListener('click', e => {
  e.target.value = '';
});

function selectedSearch() { document.getElementById('search-category').focus() }