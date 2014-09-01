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

    // Gets an album
    Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(function (data){
      console.log(data);
    });
    // Works with Spotify uri too
    Spotify.getAlbum('spotify:album:0sNOF9WDwhWunNAHPD3Baj').then(function (data){
      console.log(data);
    });

    //Get multiple Albums
    Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').then(function (data) {
      console.log(data);
    });
    Spotify.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ','6JWc4iAiJ9FjyK0B59ABb4','6UXCm6bOO4gFlDQZV5yL37']).then(function (data) {
      console.log(data);
    });

  }]);
