/** 
* Junio Marques - Frontend Developer
* personal web: http://juniomarques.com
**/
let categoryListCopy;
let dataCategory;
// DOM Elements
const inputSearch = $('#search-category'),
      btnLang = $('.btn-lang'),
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
inputSearch.on('keyup', function(evt) {

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

btnLang.on('click', function(e){

  const dataLang = $(this).attr("data-langType"),
        lang = $(this)[0].id;

  btnLang.removeClass('lang-active');
  $(this).addClass('lang-active');
  translaterLang(dataLang);
  translaterText(lang);

  selectedSearch();
  inputSearch.val('');
});

function innerNumberTotalCategories(totalCategories) {
  $('.count').text(totalCategories);
}

function translaterText(lang) {
  let title = $('.inner-title'),
  textTranslater = {
    en: 'Categories',
    por: 'Categorias',
    es: 'Categorías'
  };
  if(lang.indexOf('btn-lang-eng') > -1){
    title.text(textTranslater.en)
  } else if(lang.indexOf('btn-lang-por') > -1) {
    title.text(textTranslater.por)
  } else {
    title.text(textTranslater.es)
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
      _thisUrl = _this.data('url'),
      urlSplit = _thisUrl.split('/'),
      urlId = urlSplit.pop();

  $('.go-category').removeClass('active');
  _this.addClass('active');

  const url = `https://www.netflix.com/browse/genre/${urlId}`;
  openinCurrentTab(url);

});

inputSearch.on('click', function(e){
  e.target.value = '';
});

function selectedSearch() { document.getElementById('search-category').focus() }