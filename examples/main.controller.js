angular
  .module('example', ['spotify'])
  .config(function (SpotifyProvider) {
    console.log(SpotifyProvider);
    SpotifyProvider.setClientId('123456789');
    SpotifyProvider.setRedirectUri('http://www.example.com/callback.html');
  })
  .controller('MainController', ['$scope', 'Spotify', function ($scope, Spotify) {

    $scope.searchArtist = function () {
      Spotify.search($scope.searchartist, 'artist').then(function (data) {
        $scope.artists = data.artists.items;
      });
    };

  }]);
