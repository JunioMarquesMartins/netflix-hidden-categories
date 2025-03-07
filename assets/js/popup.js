/** 
* Junio Marques - Frontend Developer
* WEB: http://juniomarques.com
**/

let categoryListCopy;
let dataCategory;

let setGlobalElements = {
  title: document.getElementsByClassName('inner-title')[0],
  inputSearch: document.getElementById('search-category'),
  btnLang: document.querySelectorAll('.btn-lang'),
  mainList: document.getElementById('main-list'),
  urlBase: 'https://www.netflix.com/browse/genre/'
}

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
    let categoryList = category_data_eng.map((category)=>{
      return `<li class="go-category" data-url=${setGlobalElements.urlBase.concat(category.id)}>
                    <a title=${category.name}>
                      ${category.name}
                    </a>
                </li>`;
    }).join('')
    innerNumberTotalCategories(categoryListCopy.length);
    setGlobalElements.mainList.innerHTML = categoryList;
  });


  setGlobalElements.inputSearch.addEventListener('keyup', evt => {

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
      return `<li class="go-category" data-url=${setGlobalElements.urlBase.concat(category.id)}>
                <a title=${category.name}>${category.name}</a>
              </li>`;
    }
    
  }).join('');

  setGlobalElements.mainList.innerHTML = categoryFilter;
  innerNumberTotalCategories(count);
});

setGlobalElements.btnLang.forEach(item => {

  item.addEventListener('click', e => {

    let pathArray = e.composedPath();
    let dataLang, lang;
    if (pathArray.length > 1) {
        let elPath = pathArray[1]; 
        lang = elPath.id;
        dataLang = elPath.getAttribute("data-lang"); 
    } else {
        console.warn("path not found");
    }
        
    deleteClassesBtn();
    item.classList.add('lang-active');
    translaterLang(dataLang);
    translaterText(lang);

    selectedSearch();
    setGlobalElements.inputSearch.value = '';

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
  if(lang.includes('btn-lang-eng')) { setGlobalElements.title.innerHTML = textTranslater.en; } 
  if(lang.includes('btn-lang-por')) { setGlobalElements.title.innerHTML = textTranslater.por; } 
  if(lang.includes('btn-lang-es')) { setGlobalElements.title.innerHTML = textTranslater.es; }
}

function translaterLang(lang) {

  let langList;

  if(lang.includes('category_data_eng')) {
    langList = dataCategory.category_data_eng;
    innerNumberTotalCategories(dataCategory.category_data_eng.length);
  } 
  if(lang.includes('category_data_por')) {
    langList = dataCategory.category_data_por;
    innerNumberTotalCategories(dataCategory.category_data_por.length);
  }
  if(lang.includes('category_data_es')){
    langList = dataCategory.category_data_es;
    innerNumberTotalCategories(dataCategory.category_data_es.length);
  }

  categoryListCopy = langList; 

  let categoryList = langList.map((category)=>{
      return `<li class="go-category" data-url=${setGlobalElements.urlBase.concat(category.id)}>
                  <a title=${category.name}>
                    ${category.name}
                  </a>
              </li>`;

  }).join('')

  setGlobalElements.mainList.innerHTML = categoryList;
}

function openCategory(url) {
  console.log(url)
}



document.addEventListener("DOMContentLoaded", function() {
  
  setTimeout(() => {


    document.getElementById('main-list').addEventListener('click', function(event) {
      const item = event.target.closest('.go-category');
      if (!item) return; 

      const urlId = item.getAttribute('data-url').split('/').pop();
        deleteClassesActive();
        item.className = 'go-category active';

        const url = setGlobalElements.urlBase.concat(urlId);
        openinCurrentTab(url);
    });

  }, 1000);

});

function deleteClassesActive() {
  document.querySelectorAll('.go-category').forEach(item => {
    item.classList.remove('active');
  });
}

setGlobalElements.inputSearch.addEventListener('click', e => {
  e.target.value = '';
});

function selectedSearch() { document.getElementById('search-category').focus() }