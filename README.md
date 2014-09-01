# angular-spotify

angular service to connect to the Spotify Web API

angular-spotify makes heavy use of promises throughout the service

## Usage

Install angular-spotify via bower. Use the --save property to save into your bower.json file.
```shell
bower install angular-spotify --save
```

Include spotify into your angular module
```javascript
var app = angular.module('example', ['spotify']);
```

Most of the functions in Spotify do not require you to authenticate your application. However if you do need to gain access to playlists or a user's data then configure it like this:
```javascript
app.config(function (SpotifyProvider) {
  SpotifyProvider.setClientId('<CLIENT_ID>');
  SpotifyProvider.setRedirectUri('<CALLBACK_URI>');
  SpotifyProvider.setScope('<SCOPE>');
});
```
For example:
```javascript
app.config(function (SpotifyProvider) {
  SpotifyProvider.setClientId('ABC123DEF456GHI789JKL');
  SpotifyProvider.setRedirectUri('http://www.example.com/callback.html');
  SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');
});
```


Inject Spotify into a controller to gain access to all the functions available
```javascript
app.controller('MainCtrl', function (Spotify) {

});
```


###Albums

####Get an Album
Get Spotify catalog information for a single album.
```javascript
Spotify.getAlbum('AlbumID or Spotify Album URI');
```
Example:
```javascript
Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(function (data) {
  console.log(data);
});
```


####Get Several Albums
Get Spotify catalog information for multiple albums identified by their Spotify IDs.
```javascript
Spotify.getAlbums('Array or comma separated list of Album IDs');
```
Example:
```javascript
Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').then(function (data) {
  console.log(data);
});
```


####Get an Album’s Tracks
Get Spotify catalog information about an album’s tracks. Optional parameters can be used to limit the number of tracks returned.
```javascript
Spotify.getAlbumTracks('AlbumID or Spotify Album URI', options);
```
#####Options Object (Optional)
 - limit - Optional. The maximum number of tracks to return. Default: 20. Minimum: 1. Maximum: 50.
 - offset - Optional. The index of the first track to return. Default: 0 (the first object). Use with limit to get the next set of tracks.

Example:
```javascript
Spotify.getAlbumTracks('6akEvsycLGftJxYudPjmqK').then(function (data) {
  console.log(data);
});
```


###Artists
####Get an Artist
Get Spotify catalog information for a single artist identified by their unique Spotify ID or Spotify URI.

```javascript
Spotify.getArtist('Artist Id or Spotify Artist URI');
```
Example
```javascript
Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
  console.log(data);
});
```

####Get Several Artists
Get Spotify catalog information for several artists based on their Spotify IDs.
```javascript
Spotify.getArtists('Comma separated string or array of Artist Ids');
```
Example:
```javascript
Spotify.getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin').then(function (data) {
  console.log(data);
});
```

####Get an Artist’s Albums
Get Spotify catalog information about an artist’s albums. Optional parameters can be passed in to filter and sort the response.
```javascript
Spotify.getArtistAlbums('Artist Id or Spotify Artist URI', options);
```

#####Options Object (Optional)
 - album_type - Optional A comma-separated list of keywords that will be used to filter the response. If not supplied, all album types will be returned. Valid values are:
   - album
   - single
   - appears_on
   - compilation

Example: { album_type: 'album,single' }
 - country - Optional. An ISO 3166-1 alpha-2 country code. Supply this parameter to limit the response to one particular country. Note if you do not provide this field, you are likely to get duplicate results per album, one for each country in which the album is available!
 - limit - The number of album objects to return. Default: 20. Minimum: 1. Maximum: 50. For example: { limit: 2 }
 - offset - Optional. The index of the first album to return. Default: 0 (i.e., the first album). Use with limit to get the next set of albums. 


Example:
```javascript
Spotify.getArtistAlbums('1vCWHaC5f2uS3yhpwWbIA6').then(function (data) {
  console.log(data);
});
```


####Get an Artist’s Top Tracks
Get Spotify catalog information about an artist’s top tracks by country.
```javascript
Spotify.getArtistTopTracks('Artist Id or Spotify Artist URI', 'Country Code');
```
The country: an ISO 3166-1 alpha-2 country code. 
Example:
```javascript
Spotify.getArtistTopTracks('1vCWHaC5f2uS3yhpwWbIA6', 'AU').then(function (data) {
  console.log(data);
});
```


####Get an Artist’s Related Artists
Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community’s listening history.
```javascript
Spotify.getRelatedArtists('Artist Id or Spotify Artist URI');
```
Example:
```javascript
Spotify.getRelatedArtists('1vCWHaC5f2uS3yhpwWbIA6').then(function (data) {
  console.log(data);
});
```



###Tracks
####Get a Track
Get Spotify catalog information for a single track identified by its unique Spotify ID or Spotify URI.
```javascript
Spotify.getTrack('Track Id or Spotify Track URI');
```
Example:
```javascript
Spotify.getTrack('0eGsygTp906u18L0Oimnem').then(function (data) {
  console.log(data);
});
```

####Get Several Tracks
Get Spotify catalog information for multiple tracks based on their Spotify IDs.
```javascript
Spotify.getTracks('Comma separated list or array of Track Ids');
```
Example:
```javascript
Spotify.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').then(function (data) {
  console.log(data);
});
```




# More documentation coming soon.
