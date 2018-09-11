
var limit = 5;
var app = angular.module('app', []);

app.controller('formCtrl', ['$scope', function ($scope) {
    $scope.user = {};
    $scope.username = "juliotorresmoreno";
    $scope.repos = [];
    $scope.followers = [];
    $scope.following = [];
    $scope.events = [];
    $scope.errors = {};
    $scope.repos_page = 1;
    $scope.order_page = 1;
    $scope.getPage = function (source, page) {
        let start = (page - 1) * limit;
        let data = $scope.buscar_repos();
        return data.slice(start, start + limit);
    }
    $scope.back = function (source, page = 1) {
        let length = ($scope[source] || []).length;
        let last = (length % limit > 0 ? 1 : 0) + length / limit;
        if ($scope[page] === 1) {
            $scope[page] = last;
            return;
        }
        $scope[source]--;
    }

    $scope.order = function (source, field) {
        $scope.order['_' + field] = ($scope.order['_' + field] || 1) * -1;
        let order = $scope.order['_' + field];
        $scope[source].sort((x, y) => {
            let v1 = x[field] || '', v2 = y[field] || '';
            return order === -1 ? v1 > v2 : v1 < v2;
        });
    }

    $scope.search_repo = '';
    $scope.buscar_repos = function () {
        let b = $scope.search_repo || '';
        let data = $scope.repos || [];
        if (b === '') return data;
        if (!Array.isArray(data)) return [];
        return data.filter((x) => {
            let name = x.name || '',
                language = x.language || '',
                default_branch = x.default_branch || '',
                html_url = x.html_url || '';
            return (name && name.includes(b)) ||
                (language && language).includes(b) ||
                (default_branch && default_branch).includes(b) ||
                (html_url && html_url).includes(b);
        });
    }

    $scope.order._name = 1;
    $scope.order._language = 1;
    $scope.order._default_branch = 1;
    $scope.order._html_url = 1;

    $scope.next = function (source, page = 1) {
        let length = ($scope[source] || []).length;
        let last = (length % limit > 0 ? 1 : 0) + length / limit;
        if ($scope[page] === last) {
            $scope[page] = 1;
            return;
        }
        $scope[page]++;
    }
    $scope.cookie = '';
    $scope.registrar = function () {
        if ($scope.validate_form()) {
            const data = {
                user: $scope.user,
                username: $scope.username,
                repos: $scope.repos,
                followers: $scope.followers,
                following: $scope.following
            };
            var d = new Date(); //Create an date object
            d.setTime(d.getTime() + (1 * 1000 * 60 * 60 * 24)); //Set the time to exdays from the current date in milliseconds. 1000 milliseonds = 1 second
            var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
            window.document.cookie = "info=" + JSON.stringify(data) + "; " + expires;//Set the cookie with value and the expiration date
            $scope.cookie = "info=" + JSON.stringify(data) + "; " + expires;
        }
    }

    $scope.getCookie = function () {
        return window.document.cookie;
    }

    $scope.validate_form = function (e) {
        $scope.errors = {};
        if (!/^[0-9]{10,15}$/.test($scope.user.documento.trim() || '')) {
            $scope.errors.documento = 'No es un documento valido';
        }
        if (!/^[A-Za-z]{2,}(( )[A-Za-z]{2,}){0,4}$/.test($scope.user.nombres.trim() || '')) {
            $scope.errors.nombres = 'No es un nombre valido';
        }
        if (!/^[A-Za-z]{2,}(( )[A-Za-z]{2,}){0,4}$/.test($scope.user.apellidos.trim() || '')) {
            $scope.errors.apellidos = 'No es un apellido valido';
        }
        if (new Date($scope.user.fecha_nacimiento.trim()).toString() === 'Invalid Date') {
            $scope.errors.fecha_nacimiento = 'No es una fecha de nacimiento valida, el formato debe ser YYYY-MM-DD eje: 1995-10-30';
        }
        return Object.keys($scope.errors).length === 0;
    }

    $scope.fetch = function () {
        const url = 'https://api.github.com/users/' + $scope.username;
        fetch(url)
            .then(response => response.json())
            .then((response) => {
                $scope.$apply(function () {
                    $scope.user = Object.assign({}, response.id ? response : {}, {
                        documento: '1140831019',
                        nombres: 'julio',
                        apellidos: 'torres',
                        fecha_nacimiento: '1990-01-01'
                    });
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
                        });
                    });
            });
    }
}]);