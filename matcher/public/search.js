angular.module('search', ['ngRoute']).config(config);

function config($routeProvider, $sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://devdocs.io/**',
        'https://www.w3schools.com/**'
       ]
    );
    $routeProvider
        .when('/', {
            templateUrl: 'home/home.html',
            controller: HomeController,
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });
}