


var app = angular.module('app', []);
app.controller('formCtrl', function ($scope) {
    $scope.user = {};
    $scope.username = "juliotorresmoreno";
    $scope.repos = [];
    $scope.followers = [];
    $scope.following = [];
    $scope.events = [];

    $scope.fetch = function () {
        const url = 'https://api.github.com/users/' + $scope.username;
        fetch(url)
            .then(response => response.json())
            .then((response) => {
                $scope.$apply(function () {
                    $scope.user = response.id ? response : {};
                    $scope.repos = [];
                });
                fetch(response.repos_url)
                    .then(response => response.json())
                    .then(function (response) {
                        $scope.$apply(function () {
                            $scope.repos = response;
                        });
                    });
                fetch(response.followers_url)
                    .then(response => response.json())
                    .then(function (response) {
                        $scope.$apply(function () {
                            $scope.followers = response;
                        });
                    });
                fetch(url + '/following')
                    .then(response => response.json())
                    .then(function (response) {
                        $scope.$apply(function () {
                            $scope.following = response;
                        });
                    });
                fetch(response.received_events_url)
                    .then(response => response.json())
                    .then(function (response) {
                        $scope.$apply(function () {
                            $scope.events = response;
                            console.log(response);
                        });
                    });
            });
    }
});