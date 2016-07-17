---

---

function getSearchResult(post){
  return[
      '<section class="post mdl-color--white mdl-shadow--4dp  mdl-color-text--grey-800">',
        '<header class="post__header"><h1 class="post__title" itemprop="name headline">',
        '<a href="',post.url,'">',post.title,'</a></h1>',
    '<p class="post__meta">',
        '<time datetime="',post.date,'" itemprop="datePublished">Posted on',post.date,
    '</time></p></header><div class="post__content"><p>',
        post.content,'</p></div><div class="post__button">',
        '<a class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored center"',
    'href="',post.url,'"title="Read ', post.title, '">Read more</a></div></section>'
  ].join('')
}

var searchInputs = document.querySelectorAll('.search__input'),
    searchResult = document.getElementById('search__result'),
    pageContainer = document.getElementById('page-container'),
    drawer = document.getElementById('drawer-menu'),
    mobileNav = document.getElementById('mobile-nav'),
    mobileNavClose = document.querySelector('.mobile-nav__close'),
    postSeparetor = '<div class="post-separator"></div>';
    store = [],
    index = lunr(function () {
      this.field('title')
      this.field('content', {boost: 10})
      this.field('tags')
      this.ref('id')
    });


{% assign count = 0 %}
{% for post in site.posts %}
    index.add({
      title: {{ post.title | jsonify }},
      content: {{ post.content | strip_html | jsonify }},
      tags: {{ post.tags | jsonify }},
      id: {{ count }}
    });
    store.push(
        {
          "title": {{post.title | jsonify}},
          "url": {{ post.url | jsonify }},
          "date": {{ post.date | date: '%B %-d, %Y' | jsonify }},
          "tags": {{ post.tags | jsonify }},
          "content": {{ post.content | strip_html | truncatewords: 60 | jsonify }}
        }
    );
{% assign count = count | plus: 1 %}
{% endfor %}


function fetchResults(e) {
    var query = e.target.value.trim(),
        result = index.search(query),
        resultList = [],
        resultLength = result.length,
        count = 0;

    searchResult.innerHTML = '';

    if (query.length > 0 ){
        pageContainer.classList.add('hide');
        resultList.push(
            '<div class="search__result-length"><h3>',
            'Found '+ resultLength +' result(s)</h3></div>');
    } else {
        pageContainer.classList.remove('hide');
    }

    for (var item in result) {
        var ref = result[item].ref;
        var post = store[ref];
        count++;

        resultList.push(
            getSearchResult(post)
        );

        if(count < resultLength) {
            resultList.push(postSeparetor);
        }
    }
    searchResult.innerHTML = resultList.join('');
}

Object.keys(searchInputs).forEach(function(el) {
   searchInputs[el].addEventListener('input', fetchResults);
});

drawer.addEventListener('click', function(e){
    mobileNav.style.width = '100%';
});

mobileNavClose.addEventListener('click', function(){
    mobileNav.style.width = '0';
});