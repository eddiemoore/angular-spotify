# angular-spotify

angular service to connect to the Spotify Web API

angular-spotify makes heavy use of promises throughout the service

## Usage

Include spotify into your module
```
var app = angular.module('example', ['spotify']);
```

Most of the functions in Spotify do not require you to authenticate your application. However if you do need to gain access to playlists or a user's data then configure it like this:
```
app.config(function (SpotifyProvider) {
  SpotifyProvider.setClientId('<CLIENT_ID>');
  SpotifyProvider.setRedirectUri('<CALLBACK_URI>');
  SpotifyProvider.setScope('<SCOPE>');
});
```
For example:
```
app.config(function (SpotifyProvider) {
  SpotifyProvider.setClientId('ABC123DEF456GHI789JKL');
  SpotifyProvider.setRedirectUri('http://www.example.com/callback.html');
  SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');
});
```


Inject Spotify into a controller to gain access to all the functions available
```
app.controller('MainCtrl', function (Spotify) {

});
```


###Albums

####Get an Album
Get Spotify catalog information for a single album.
```
Spotify.getAlbum('AlbumID or Spotify Album URI');
```
Example:
```
Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(function (data) {
  console.log(data);
});
```


####Get Several Albums
Get Spotify catalog information for multiple albums identified by their Spotify IDs.
```
Spotify.getAlbums('Array or comma separated list of Album IDs');
```
Example:
```
Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').then(function (data) {
  console.log(data);
});
```


####Get an Album’s Tracks
Get Spotify catalog information about an album’s tracks. Optional parameters can be used to limit the number of tracks returned.
```
Spotify.getAlbumTracks('AlbumID or Spotify Album URI', options);
```
#####Options Object
 - limit - Optional. The maximum number of tracks to return. Default: 20. Minimum: 1. Maximum: 50.
 - offset - Optional. The index of the first track to return. Default: 0 (the first object). Use with limit to get the next set of tracks.

Example:
```
Spotify.getAlbumTracks('6akEvsycLGftJxYudPjmqK').then(function (data) {
  console.log(data);
});
```



# More documentation coming soon.
