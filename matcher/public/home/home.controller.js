angular.module('search').controller('HomeController', HomeController);

function HomeController($http, $sce) {
    const vm = this;

    vm.search = function () {
        vm.timeElapsed = null;
        vm.data = null;
        let q = {
            query: vm.query
        };
        $http
            .post('/api/search', q)
            .then((response) => {
                console.log(response.data);
                vm.data = response.data.result;
                console.log('time elapsed: ' + response.data.timeElapsed);
                vm.timeElapsed = response.data.timeElapsed / 1000;
                if (response.status != 200) {
                    vm.noResults = true;
                } else {
                    vm.noResults = false;
                }
            })
            .catch((er) => {
                console.log(er);
                vm.noResults = true;
                vm.timeElapsed = er.data.timeElapsed / 1000;
            });

    };

    vm.expandedSearch = function () {
        vm.timeElapsed = null;
        vm.data = null;
        let q = {
            query: vm.query
        };
        $http
            .post('/api/lexsearch', q)
            .then((response) => {
                console.log(response.data);
                vm.data = response.data.result;
                console.log('time elapsed: ' + response.data.timeElapsed);
                vm.timeElapsed = response.data.timeElapsed / 1000;
                if (response.status != 200) {
                    vm.noResults = true;
                } else {
                    vm.noResults = false;
                }
            })
            .catch((er) => {
                console.log(er);
                vm.noResults = true;
                vm.timeElapsed = er.data.timeElapsed / 1000;
            });

    };

    vm.searching = function () {
        //console.log('search button is clicked');
        if (vm.expand) {
            //console.log('expand is checked');
            vm.expandedSearch();
        } else {
            vm.search();
        }
    };
}