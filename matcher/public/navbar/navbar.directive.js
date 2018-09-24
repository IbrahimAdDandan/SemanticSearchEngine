angular.module('search').directive('navbar', navbar);

function navbar () {
    return {
        restrict: 'E',
        templateUrl: 'navbar/navbar.html',
        controller: Navbar,
        controllerAs: 'nav'
    };
}