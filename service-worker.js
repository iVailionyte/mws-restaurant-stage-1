
var version = 'v1.0.0';

var offlineFundamentals = [
  'index.html',
  'restaurant.html',
  'css/styles.css',
  'data/restaurants.json',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
  'js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
     
      .open(version + 'fundamentals')
      .then(function(cache) {
        return cache.addAll(offlineFundamentals);
      })
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(
    caches
      .match(event.request)
      .then(function(cached) {
        var networked = fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);
        return cached || networked;

        function fetchedFromNetwork(response) {
          var cacheCopy = response.clone();

          caches
            .open(version + 'pages')
            .then(function add(cache) {
              return cache.put(event.request, cacheCopy);
            })
          return response;
        }
        function unableToResolve () {
          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !key.startsWith(version);
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
  );
});