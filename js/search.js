---

---

function getSearchResult(post){
  return [
    '<section class="post"><header class="post-header"><h1 class="post-title" itemprop="name headline">',
    '<a href="',post.url,'">', post.title,'</a></h1><p class="post-meta">',
    '<time datetime="',post.date,'" itemprop="datePublished">Posted on ',post.date,'</time>',
    '</p></header><div class="post-content"><p>',
    post.content,'</p></div><div class="post-button">',
    '<a class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored center"',
  'href="', post.url,'" title="Read ', post.title,'">Read more</a></div></section>'
  ].join('');
}

var searchInput = document.getElementById('search__input'),
    searchResult = document.getElementById('search__result'),
    pageContainer = document.getElementById('page-container'),
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


searchInput.addEventListener('input', function (e) {
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
)