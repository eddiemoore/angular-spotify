'use strict';
/* global getJSONFixture */
describe('angular-spotify', function () {

  //For the config
  describe('SpotifyProvider', function () {

    var spotifyProvider;

    beforeEach(function () {
      module('spotify', function (_SpotifyProvider_) {
        spotifyProvider = _SpotifyProvider_;
      });
      inject(function () {});
    });

    it('should set the client id', function () {
      expect(spotifyProvider.setClientId('ABCDEFGHIJKLMNOP')).toBe('ABCDEFGHIJKLMNOP');
    });

    it('should get the client id', function () {
      spotifyProvider.setClientId('ABCDEFGHIJKLMNOP');
      expect(spotifyProvider.getClientId()).toBe('ABCDEFGHIJKLMNOP');
    });

    it('should set the Redirect Uri', function () {
      expect(spotifyProvider.setRedirectUri('http://example.com/callback.html')).toBe('http://example.com/callback.html');
    });

    it('should get the Redirect Uri', function () {
      spotifyProvider.setRedirectUri('http://example.com/callback.html');
      expect(spotifyProvider.getRedirectUri()).toBe('http://example.com/callback.html');
    });

    it('should set the scope', function () {
      expect(spotifyProvider.setScope('user-read-private playlist-read-private')).toBe('user-read-private playlist-read-private');
    });

    it('should set the authToken', function () {
      expect(spotifyProvider.setAccessToken('ABCDEFGHIJKLMNOP')).toBe('ABCDEFGHIJKLMNOP');
    });

  });

  //For injecting into controllers
  describe('Spotify', function () {

    beforeEach(module('spotify'));

    var Spotify;

    beforeEach(inject(function (_Spotify_) {
      Spotify = _Spotify_;
    }));

    it('should be an object', function () {
      expect(typeof Spotify).toBe('object');
    });

    it('should set the AuthToken', function () {
      expect(Spotify.setAccessToken('ABCDEFGHIJKLMNOP')).toBe('ABCDEFGHIJKLMNOP');
    });

    it('should get the AuthToken', function () {
      Spotify.setAccessToken('ABCDEFGHIJKLMNOP');
      expect(Spotify.getAccessToken()).toBe('ABCDEFGHIJKLMNOP');
    });

    it('should turn an object into a query string', function () {
      expect(Spotify.toQueryString({ a: 't', b: 4, c: 'q' })).toBe('a=t&b=4&c=q');
    });

    describe('Spotify.api', function () {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
        jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';
      }));

      afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should call the api with params', function () {
        $httpBackend.when('GET', api + '/search?q=Nirvana&type=artist').respond(
          getJSONFixture('search.artist.json')
        );

        var result;
        Spotify.api('/search', {
          params: {
            q: 'Nirvana',
            type: 'artist'
          }
        }).then(function (data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
      });

      it('should call the api with data', function () {
        $httpBackend.when('POST', api + '/users/wizzler/playlists', {
          name: 'TESTING',
          public: false
        }).respond({});

        var result;
        Spotify.api('/users/wizzler/playlists', {
          method: 'POST',
          data: {
            name: 'TESTING',
            public: false
          }
        }).then(function (data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
      });

      it('should call the api with headers', function () {
        $httpBackend.when('POST', api + '/users/wizzler/playlists', {
          name: 'TESTING',
          public: false
        }, function (headers) {
          return headers.Authorization === 'Bearer TESTING';
        }).respond({});

        var result;
        Spotify.setAccessToken('TESTING');
        Spotify.api('/users/wizzler/playlists', {
          method: 'POST',
          data: {
            name: 'TESTING',
            public: false
          }
        }).then(function (data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
      });
    });

    describe('Search', function () {
      var $httpBackend;
      var $rootScope;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_, _$rootScope_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        jasmine.getJSONFixtures().fixturesPath='base/test/mock';
      }));

      describe('Spotify.search', function () {
        it('should make an ajax call to https://api.spotify.com/v1/search', function () {

          spyOn(Spotify, 'api');

          Spotify.search('Nirvana', 'artist');

          expect(Spotify.api).toHaveBeenCalledWith('/search', {
            params: {
              q: 'Nirvana',
              type: 'artist'
            }
          });
        });

        it('should call with multiple types', function () {

          spyOn(Spotify, 'api');

          Spotify.search('Muse', ['artist', 'track']);

          expect(Spotify.api).toHaveBeenCalledWith('/search', {
            params: {
              q: 'Muse',
              type: 'artist,track'
            }
          });
        });

        it('should return an array of artists', function () {
          $httpBackend.when('GET', api + '/search?q=Nirvana&type=artist').respond(
            getJSONFixture('search.artist.json')
          );

          Spotify.search('Nirvana', 'artist').then(function (data) {
            expect(data).toBeDefined();
            expect(data.artists.items.length).toBe(20);
          });

          $httpBackend.flush();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/search?q=Nirvana').respond(400, getJSONFixture('search.missing-type.json'));

          var result;
          Spotify.search('Nirvana').then(function () {
          }, function (reason) {
            result = reason;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.searchAlbums', function () {
        it('should call the api with the correct params', function () {
          spyOn(Spotify, 'api');

          Spotify.searchAlbums('Nevermind');

          expect(Spotify.api).toHaveBeenCalledWith('/search', {
            params: {
              q: 'Nevermind',
              type: 'album'
            }
          });
        });

        it('should search with options', function () {
          spyOn(Spotify, 'api');

          Spotify.searchAlbums('Nevermind', { limit: 10 });

          expect(Spotify.api).toHaveBeenCalledWith('/search', {
            params: {
              q: 'Nevermind',
              type: 'album',
              limit: 10
            }
          });
        });
      });

      describe('Spotify.searchArtists', function () {
        it('should call the api with the correct params', function () {
          spyOn(Spotify, 'api');

          Spotify.searchArtists('Nirvana');

          expect(Spotify.api).toHaveBeenCalledWith('/search', {
            params: {
              q: 'Nirvana',
              type: 'artist'
            }
          });
        });

        it('should search with options', function () {
          spyOn(Spotify, 'api');

          Spotify.searchArtists('Nirvana', { limit: 10 });

          expect(Spotify.api).toHaveBeenCalledWith('/search', {
            params: {
              q: 'Nirvana',
              type: 'artist',
              limit: 10
            }
          });
        });
      });

      describe('Spotify.searchTracks', function () {
        it('should call the api with the correct params', function () {
          spyOn(Spotify, 'api');

          Spotify.searchTracks('Smells Like Teen Spirit');

          expect(Spotify.api).toHaveBeenCalledWith('/search', {
            params: {
              q: 'Smells Like Teen Spirit',
              type: 'track'
            }
          });
        });

        it('should search with options', function () {
          spyOn(Spotify, 'api');

          Spotify.searchTracks('Smells Like Teen Spirit', { limit: 10 });

          expect(Spotify.api).toHaveBeenCalledWith('/search', {
            params: {
              q: 'Smells Like Teen Spirit',
              type: 'track',
              limit: 10
            }
          });
        });
      });

      describe('Spotify.searchPlaylists', function () {
        it('should call the api with the correct params', function () {
          spyOn(Spotify, 'api');

          Spotify.searchPlaylists('#ThrowbackThursday');

          expect(Spotify.api).toHaveBeenCalledWith('/search', {
            params: {
              q: '#ThrowbackThursday',
              type: 'playlist'
            }
          });
        });

        it('should search with options', function () {
          spyOn(Spotify, 'api');

          Spotify.searchPlaylists('#ThrowbackThursday', { limit: 10 });

          expect(Spotify.api).toHaveBeenCalledWith('/search', {
            params: {
              q: '#ThrowbackThursday',
              type: 'playlist',
              limit: 10
            }
          });
        });
      });

    });

    //Albums
    describe('Albums', function () {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Spotify.getAlbum', function () {

        it('should make an ajax call to https://api.spotify.com/v1/albums', function () {

          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj').respond(getJSONFixture('album.json'));

          expect(Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');

          Spotify.getAlbum('spotify:album:0sNOF9WDwhWunNAHPD3Baj');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/albums/0sNOF9WDwhWunNAHPD3Baj');
        });

        it('should resolve to an object of an album', function () {
          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj').respond(200, getJSONFixture('album.json'));

          var result;
          Spotify
            .getAlbum('0sNOF9WDwhWunNAHPD3Baj')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/albums/ABCDEFGHIJKLMNOP').respond(404, getJSONFixture('album.error.json'));

          var result;
          Spotify.getAlbum('ABCDEFGHIJKLMNOP').then(function () {
          }, function (reason) {
            result = reason;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(404);
        });
      });

      describe('Spotify.getAlbums', function () {

        it('should make an ajax call to https://api.spotify.com/v1/albums?ids={ids}', function () {

          $httpBackend.when('GET', api + '/albums?ids=41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').respond(getJSONFixture('albums.json'));

          expect(Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37')).toBeDefined();
        });

        it('should resolve to an array of albums', function () {
          $httpBackend.when('GET', api + '/albums?ids=41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').respond(200, getJSONFixture('albums.json'));

          var result;
          Spotify
            .getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.albums instanceof Array).toBeTruthy();
          expect(result.albums.length).toBe(3);
        });

        it('should convert spotify uris to ids', function () {
          spyOn(Spotify, 'api');

          Spotify.getAlbums('spotify:album:41MnTivkwTO3UUJ8DrqEJJ,spotify:album:6JWc4iAiJ9FjyK0B59ABb4,spotify:album:6UXCm6bOO4gFlDQZV5yL37');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/albums', {
            params: {
              ids: '41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37'
            }
          });
        });

        it('should resolve to an array of albums when sending an array', function () {
          $httpBackend.when('GET', api + '/albums?ids=41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').respond(200, getJSONFixture('albums.json'));

          var result;
          Spotify
            .getAlbums(['41MnTivkwTO3UUJ8DrqEJJ','6JWc4iAiJ9FjyK0B59ABb4','6UXCm6bOO4gFlDQZV5yL37'])
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.albums instanceof Array).toBeTruthy();
          expect(result.albums.length).toBe(3);
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/albums?ids=').respond(400, getJSONFixture('albums.invalid-id.json'));

          var result;
          Spotify.getAlbums().then(function () {
          }, function (reason) {
            result = reason;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getAlbumTracks', function () {

        it('should make an ajax call to https://api.spotify.com/v1/albums/{id}/tracks', function () {

          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj/tracks').respond(getJSONFixture('albums.tracks.json'));

          expect(Spotify.getAlbumTracks('0sNOF9WDwhWunNAHPD3Baj')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');
          Spotify.getAlbumTracks('spotify:album:0sNOF9WDwhWunNAHPD3Baj');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/albums/0sNOF9WDwhWunNAHPD3Baj/tracks', undefined);
        });

        it('should resolve with options', function () {
          spyOn(Spotify, 'api');
          Spotify.getAlbumTracks('spotify:album:0sNOF9WDwhWunNAHPD3Baj', { limit: 20 });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/albums/0sNOF9WDwhWunNAHPD3Baj/tracks', {
            params: {
              limit: 20
            }
          });
        });

        it('should resolve to an object of album tracks', function () {
          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj/tracks').respond(200, getJSONFixture('albums.tracks.json'));

          var result;
          Spotify
            .getAlbumTracks('0sNOF9WDwhWunNAHPD3Baj')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.items.length).toBe(13);
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/albums/ABCDEFGHIJKLMNOP/tracks').respond(404, getJSONFixture('album.error.json'));

          var result;
          Spotify
            .getAlbumTracks('ABCDEFGHIJKLMNOP')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(404);
        });
      });
    });

    describe('Artists', function () {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Spotify.getArtist', function () {

        it('should make an ajax call to https://api.spotify.com/v1/artists/{id}', function () {
          expect(Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');

          Spotify.getArtist('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/0LcJLqbBmaGUft1e9Mm8HV');
        });

        it('should resolve to an object of an artist', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV').respond(200, { 'external_urls': {} });

          var result;
          Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/artists/ABCDEFGHIJKLMNOP').respond(404, {
            'error': {
              'status': 404,
              'message': 'non existing id'
            }
          });

          var result;
          Spotify.getArtist('ABCDEFGHIJKLMNOP').then(function () {
          }, function (reason) {
            result = reason;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(404);
        });
      });

      describe('Spotify.getArtists', function () {

        it('should make an ajax call to https://api.spotify.com/v1/artists?ids={id}', function () {
          expect(Spotify.getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin')).toBeDefined();
        });

        it('should resolve to an object of an artist', function () {
          $httpBackend.when('GET', api + '/artists/?ids=0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin').respond(200, { 'artists': [] });

          var result;
          Spotify
            .getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should convert spotify uris to ids', function () {
          spyOn(Spotify, 'api');

          Spotify.getArtists('spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy,spotify:artist:3dBVyJ7JuOMt4GE9607Qin');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/', {
            params: {
              ids: '0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin'
            }
          });
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/artists/?ids=').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getArtists()
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getArtistAlbums', function() {
        it('should make an ajax call to https://api.spotify.com/v1/artists/{id}/albums', function () {
          expect(Spotify.getArtistAlbums('0LcJLqbBmaGUft1e9Mm8HV')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');

          Spotify.getArtistAlbums('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV');
          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/0LcJLqbBmaGUft1e9Mm8HV/albums', undefined);
        });

        it('should resolve with options', function () {
          spyOn(Spotify, 'api');

          Spotify.getArtistAlbums('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV', { limit: 20 });
          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/0LcJLqbBmaGUft1e9Mm8HV/albums', {
            params: {
              limit: 20
            }
          });
        });

        it('should resolve to an array of artist albums', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/albums').respond(200, { 'albums': [] });

          var result;
          Spotify.getArtistAlbums('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/artists/ABCDEFGHIJKLMNOP/albums').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getArtistAlbums('ABCDEFGHIJKLMNOP')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getArtistTopTracks', function() {
        it('should make an ajax call to https://api.spotify.com/v1/artists/{id}/top-tracks', function () {
          expect(Spotify.getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV', 'AU')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          spyOn(Spotify, 'api');

          Spotify.getArtistTopTracks('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV', 'AU');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/0LcJLqbBmaGUft1e9Mm8HV/top-tracks', {
            params: {
              country: 'AU'
            }
          });
        });

        it('should resolve to an array of artist albums', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/top-tracks?country=AU').respond(200, { 'albums': [] });

          var result;
          Spotify
            .getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV', 'AU')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise if the id is incorrect', function () {
          $httpBackend.when('GET', api + '/artists/ABCDEFGHIJKLMNOP/top-tracks?country=AU').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getArtistTopTracks('ABCDEFGHIJKLMNOP', 'AU')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });

        it('should reject if the country is not defined', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/top-tracks').respond(400, {
            'error': {
              'status': 400,
              'message': 'missing country parameter'
            }
          });

          var result;
          Spotify
            .getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getArtistRelatedArtists', function() {
        it('should make an ajax call to https://api.spotify.com/v1/artists/{id}/related-artists', function () {
          expect(Spotify.getArtistRelatedArtists('0LcJLqbBmaGUft1e9Mm8HV')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');

          Spotify.getArtistRelatedArtists('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/0LcJLqbBmaGUft1e9Mm8HV/related-artists');
        });

        it('should resolve to an array of artists', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/related-artists').respond(200, { 'albums': [] });

          var result;
          Spotify
            .getArtistRelatedArtists('0LcJLqbBmaGUft1e9Mm8HV')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/artists/ABCDEFGHIJKLMNOP/related-artists').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getArtistRelatedArtists('ABCDEFGHIJKLMNOP')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });
    });

    describe('Tracks', function () {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Spotify.getTrack', function() {

        it('should make an ajax call to https://api.spotify.com/v1/tracks/{id}', function () {
          expect(Spotify.getTrack('0eGsygTp906u18L0Oimnem')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          spyOn(Spotify, 'api');

          Spotify.getTrack('spotify:artist:0eGsygTp906u18L0Oimnem');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/tracks/0eGsygTp906u18L0Oimnem');
        });

        it('should resolve to an object of a track', function () {
          $httpBackend.when('GET', api + '/tracks/0eGsygTp906u18L0Oimnem').respond(200, { 'albums': [] });

          var result;
          Spotify
            .getTrack('0eGsygTp906u18L0Oimnem')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/tracks/ABCDEFGHIJKLMNOP').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getTrack('ABCDEFGHIJKLMNOP')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getTracks', function() {
        it('should make an ajax call to https://api.spotify.com/v1/tracks?ids={id}', function () {
          expect(Spotify.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G')).toBeDefined();
        });

        it('should resolve to an array of tracks', function () {
          $httpBackend.when('GET', api + '/tracks/?ids=0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').respond(200, { 'tracks': [] });

          var result;
          Spotify
            .getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should convert spotify uris to Ids', function () {
          spyOn(Spotify, 'api');

          Spotify.getTracks('spotify:track:0eGsygTp906u18L0Oimnem,spotify:track:1lDWb6b6ieDQ2xT7ewTC3G');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/tracks/', {
            params: {
              ids: '0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G'
            }
          });
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/tracks/?ids=').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getTracks()
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getAudioFeaturesForTrack', function () {
        it('should make an ajax call to https://api.spotify.com/v1/audio-features/{id}', function () {
          expect(Spotify.getAudioFeaturesForTrack('0eGsygTp906u18L0Oimnem')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');

          Spotify.getAudioFeaturesForTrack('spotify:artist:0eGsygTp906u18L0Oimnem');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/audio-features/0eGsygTp906u18L0Oimnem');
        });

        it('should resolve to an object of a track', function () {
          $httpBackend.when('GET', api + '/audio-features/0eGsygTp906u18L0Oimnem').respond(200, {
            'danceability': 0.735
          });

          var result;
          Spotify
            .getAudioFeaturesForTrack('0eGsygTp906u18L0Oimnem')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/audio-features/ABCDEFGHIJKLMNOP').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getAudioFeaturesForTrack('ABCDEFGHIJKLMNOP')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getAudioFeaturesForTracks', function() {
        it('should make an ajax call to https://api.spotify.com/v1/audio-features?ids={id}', function () {
          expect(Spotify.getAudioFeaturesForTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G')).toBeDefined();
        });

        it('should resolve to an array of tracks', function () {
          $httpBackend.when('GET', api + '/audio-features/?ids=0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').respond(200, { 'tracks': [] });

          var result;
          Spotify
            .getAudioFeaturesForTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should convert spotify uris to Ids', function () {
          spyOn(Spotify, 'api');

          Spotify.getAudioFeaturesForTracks('spotify:track:0eGsygTp906u18L0Oimnem,spotify:track:1lDWb6b6ieDQ2xT7ewTC3G');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/audio-features/', {
            params: {
              ids: '0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G'
            }
          });
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/audio-features/?ids=').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getAudioFeaturesForTracks()
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

    });

    describe('Playlists', function () {

      describe('Spotify.getUserPlaylists', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getUserPlaylists('wizzler');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/wizzler/playlists', {});
        });

      });

      describe('Spotify.getPlaylist', function() {

        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getPlaylist('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb', {});
        });

      });

      describe('Spotify.getPlaylistTracks', function() {

        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getPlaylistTracks('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', {});
        });

      });

      describe('Spotify.createPlaylist', function() {

        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.createPlaylist('1176458919', {
            name: 'Awesome Mix Vol. 1'
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/1176458919/playlists', {
            method: 'POST',
            data:{
              name: 'Awesome Mix Vol. 1'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

      });

      describe('Spotify.addTracksToPlaylist', function() {

        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.addTracksToPlaylist('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            'spotify:track:5LwukQO2fCx35GUUN6d6NW',
            'spotify:track:4w8CsAnzn0lXJxYlAuCtCW',
            'spotify:track:2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', {
            method: 'POST',
            params: {
              uris: 'spotify:track:5LwukQO2fCx35GUUN6d6NW,spotify:track:4w8CsAnzn0lXJxYlAuCtCW,spotify:track:2Foc5Q5nqNiosCNqttzHof',
              position: null
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

        it('should be able to pass Track IDs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.addTracksToPlaylist('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            '5LwukQO2fCx35GUUN6d6NW',
            '4w8CsAnzn0lXJxYlAuCtCW',
            '2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', {
            method: 'POST',
            params: {
              uris: 'spotify:track:5LwukQO2fCx35GUUN6d6NW,spotify:track:4w8CsAnzn0lXJxYlAuCtCW,spotify:track:2Foc5Q5nqNiosCNqttzHof',
              position: null
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

      });

      describe('Spotify.removeTracksFromPlaylist', function() {
        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.removeTracksFromPlaylist('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            'spotify:track:5LwukQO2fCx35GUUN6d6NW',
            'spotify:track:4w8CsAnzn0lXJxYlAuCtCW',
            'spotify:track:2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', {
            method: 'DELETE',
            data: {
              tracks: [
                {uri: 'spotify:track:5LwukQO2fCx35GUUN6d6NW'},
                {uri: 'spotify:track:4w8CsAnzn0lXJxYlAuCtCW'},
                {uri: 'spotify:track:2Foc5Q5nqNiosCNqttzHof'}
              ]
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

        it('should be able to pass track IDs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.removeTracksFromPlaylist('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            '5LwukQO2fCx35GUUN6d6NW',
            '4w8CsAnzn0lXJxYlAuCtCW',
            '2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', {
            method: 'DELETE',
            data: {
              tracks: [
                {uri: 'spotify:track:5LwukQO2fCx35GUUN6d6NW'},
                {uri: 'spotify:track:4w8CsAnzn0lXJxYlAuCtCW'},
                {uri: 'spotify:track:2Foc5Q5nqNiosCNqttzHof'}
              ]
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });
      });

      describe('Spotify.reorderTracksInPlaylist', function () {
        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.reorderTracksInPlaylist('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', {
            range_start: 2,
            range_length: 10,
            insert_before: 15
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', {
            method: 'PUT',
            data: {
              range_start: 2,
              range_length: 10,
              insert_before: 15
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });
      });

      describe('Spotify.replaceTracksInPlaylist', function() {
        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.replaceTracksInPlaylist('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            'spotify:track:5LwukQO2fCx35GUUN6d6NW',
            'spotify:track:4w8CsAnzn0lXJxYlAuCtCW',
            'spotify:track:2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', {
            method: 'PUT',
            params: {
              uris: 'spotify:track:5LwukQO2fCx35GUUN6d6NW,spotify:track:4w8CsAnzn0lXJxYlAuCtCW,spotify:track:2Foc5Q5nqNiosCNqttzHof'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

        it('should be able to pass track IDs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.replaceTracksInPlaylist('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            '5LwukQO2fCx35GUUN6d6NW',
            '4w8CsAnzn0lXJxYlAuCtCW',
            '2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', {
            method: 'PUT',
            params: {
              uris: 'spotify:track:5LwukQO2fCx35GUUN6d6NW,spotify:track:4w8CsAnzn0lXJxYlAuCtCW,spotify:track:2Foc5Q5nqNiosCNqttzHof'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });
      });

      describe('Spotify.changePlaylistDetails', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.changePlaylistDetails('1176458919', '3ygKiRcD8ed3i2g8P7jlXr', {
            name: 'Awesome Mix Vol. 2'
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/1176458919/playlists/3ygKiRcD8ed3i2g8P7jlXr', {
            method: 'PUT',
            data: {
              name: 'Awesome Mix Vol. 2'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

      });

    });

    describe('User Profiles', function() {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Spotify.getUser', function() {
        it('should make an ajax call to https://api.spotify.com/v1/users/{id}', function () {
          expect(Spotify.getUser('wizzler')).toBeDefined();
        });

        it('should resolve to an object of a user', function () {
          $httpBackend.when('GET', api + '/users/wizzler').respond(200, { });

          var result;
          Spotify.getUser('wizzler').then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/users/:":ADSAD').respond(404, {
            'error': {
              'status': 404,
              'message': 'No such user'
            }
          });

          var result;
          Spotify.getUser(':":ADSAD').then(function () {
          }, function (reason) {
            result = reason;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(404);
        });
      });

      describe('Spotify.getMe', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getMe();

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me');
        });

      });

    });

    describe('User Library', function () {

      describe('Spotify.getMySavedTracks', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getMySavedTracks();

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks', {});
        });

      });

      describe('Spotify.containsMySavedTracks', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.containsMySavedTracks(['0udZHhCi7p1YzMlvI4fXoK','3SF5puV5eb6bgRSxBeMOk9']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks/contains', {
            params: {
              ids: '0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9'
            }
          });
        });

        it('should be able to pass Spotify URIs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.containsMySavedTracks(['spotify:track:0udZHhCi7p1YzMlvI4fXoK','spotify:track:3SF5puV5eb6bgRSxBeMOk9']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks/contains', {
            params: {
              ids: '0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9'
            }
          });
        });

      });

      describe('Spotify.addToMySavedTracks', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.addToMySavedTracks(['4iV5W9uYEdYUVa79Axb7Rh','1301WleyT98MSxVHPZCA6M']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks', {
            method: 'PUT',
            params: {
              ids: '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M'
            }
          });
        });

        it('should be able to pass Spotify URIs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.addToMySavedTracks(['spotify:track:0udZHhCi7p1YzMlvI4fXoK','spotify:track:3SF5puV5eb6bgRSxBeMOk9']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks', {
            method: 'PUT',
            params: {
              ids: '0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9'
            }
          });
        });

      });

      describe('Spotify.removeFromMySavedTracks', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.removeFromMySavedTracks(['4iV5W9uYEdYUVa79Axb7Rh','1301WleyT98MSxVHPZCA6M']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks', {
            method: 'DELETE',
            params: {
              ids: '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

        it('should be able to pass Spotify URIs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.removeFromMySavedTracks(['spotify:track:0udZHhCi7p1YzMlvI4fXoK','spotify:track:3SF5puV5eb6bgRSxBeMOk9']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks', {
            method: 'DELETE',
            params: {
              ids: '0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

      });

      describe('Spotify.getMySavedAlbums', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getMySavedAlbums();

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/albums', {});
        });

      });

      describe('Spotify.addToMySavedAlbums', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.addToMySavedAlbums(['4iV5W9uYEdYUVa79Axb7Rh','1301WleyT98MSxVHPZCA6M']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/albums', {
            method: 'PUT',
            params: {
              ids: '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M'
            }
          });
        });

        it('should be able to pass Spotify URIs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.addToMySavedAlbums(['spotify:album:4iV5W9uYEdYUVa79Axb7Rh','spotify:album:1301WleyT98MSxVHPZCA6M']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/albums', {
            method: 'PUT',
            params: {
              ids: '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M'
            }
          });
        });

      });

      describe('Spotify.removeFromMySavedAlbums', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.removeFromMySavedAlbums(['4iV5W9uYEdYUVa79Axb7Rh','1301WleyT98MSxVHPZCA6M']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/albums', {
            method: 'DELETE',
            params: {
              ids: '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

        it('should be able to pass Spotify URIs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.removeFromMySavedAlbums(['spotify:album:4iV5W9uYEdYUVa79Axb7Rh','spotify:album:1301WleyT98MSxVHPZCA6M']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/albums', {
            method: 'DELETE',
            params: {
              ids: '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

      });

      describe('Spotify.containsMySavedAlbums', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.containsMySavedAlbums(['4iV5W9uYEdYUVa79Axb7Rh','1301WleyT98MSxVHPZCA6M']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/albums/contains', {
            params: {
              ids: '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M'
            }
          });
        });

        it('should be able to pass Spotify URIs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.containsMySavedAlbums(['spotify:album:4iV5W9uYEdYUVa79Axb7Rh','spotify:album:1301WleyT98MSxVHPZCA6M']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/albums/contains', {
            params: {
              ids: '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M'
            }
          });
        });

      });

    });

    describe('Personalization', function () {
      describe('Spotify.getMyTopArtists', function () {
        it('should call the correct URL with authentication', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getMyTopArtists();

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/top/artists', {});
        });

        it('should call the correct URL with authentication and options', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getMyTopArtists({
            limit: 50,
            offset: 50
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/top/artists', {
            params: {
              limit: 50,
              offset: 50
            }
          });
        });
      });

      describe('Spotify.getMyTopTracks', function () {
        it('should call the correct URL with authentication', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getMyTopTracks();

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/top/tracks', {});
        });

        it('should call the correct URL with authentication and options', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getMyTopTracks({
            limit: 50,
            offset: 50
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/top/tracks', {
            params: {
              limit: 50,
              offset: 50
            }
          });
        });
      });
    });

    describe('Browse', function() {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Browse.getFeaturedPlaylists', function() {

        it('should call the correct URL with authentication and options', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getFeaturedPlaylists({ country: 'NL', locale: 'nl_NL' });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/browse/featured-playlists', {
            params: {
              country: 'NL',
              locale: 'nl_NL'
            }
          });
        });

        it('should resolve to an object with a message and playlists', function () {
          $httpBackend.when('GET', api + '/browse/featured-playlists').respond(200, getJSONFixture('featured-playlists.json'));

          var result;
          Spotify.getFeaturedPlaylists().then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.message).toBeDefined();
          expect(result.playlists).toBeDefined();
        });

      });

      describe('Browse.getNewReleases', function() {

        it('should call the correct URL with authentication and options', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getNewReleases({ country: 'NL' });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/browse/new-releases', {
            params: {
              country: 'NL'
            }
          });
        });

        it('should resolve to an object with albums', function () {
          $httpBackend.when('GET', api + '/browse/new-releases').respond(200, getJSONFixture('new-releases.json'));

          var result;
          Spotify.getNewReleases().then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.albums).toBeDefined();
        });

      });

      describe('Spotify.getCategories', function () {
        it('should call the correct URL with authentication', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getCategories();

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/browse/categories', {});
        });

        it('should call the correct URL with authentication and options', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getCategories({
            country: 'SG',
            limit: 20
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/browse/categories', {
            params: {
              country: 'SG',
              limit: 20
            }
          });
        });
      });

      describe('Spotify.getCategory', function () {
        it('should call the correct URL with authentication', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getCategory('party');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/browse/categories/party', {});
        });

        it('should call the correct URL with authentication and options', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getCategory('party', {
            country: 'SG'
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/browse/categories/party', {
            params: {
              country: 'SG'
            }
          });
        });
      });

      describe('Spotify.getCategoryPlaylists', function () {
        it('should call the correct URL with authentication', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getCategoryPlaylists('party');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/browse/categories/party/playlists', {});
        });

        it('should call the correct URL with authentication with options', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getCategoryPlaylists('party', {
            country: 'SG',
            limit: 20
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/browse/categories/party/playlists', {
            params: {
              country: 'SG',
              limit: 20
            }
          });
        });
      });

      describe('Spotify.getRecommendations', function () {
        it('should call the correct URL with authentication', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getRecommendations({
            seed_artists: '4NHQUGzhtTLFvgF5SZesLK'
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/recommendations', {
            params: {
              seed_artists: '4NHQUGzhtTLFvgF5SZesLK'
            }
          });
        });
      });

      describe('Spotify.getAvailableGenreSeeds', function () {
        it('should call the correct URL with authentication', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getAvailableGenreSeeds();

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/recommendations/available-genre-seeds');
        });
      });
    });

    describe('Follow', function () {
      var $httpBackend;
      var Spotify;

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Spotify.getFollowed', function () {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getFollowed('artist');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            params: {
              type: 'artist'
            }
          });
        });

        it('should call with options', function() {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.getFollowed('artist', { limit: 30 });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            params: {
              type: 'artist',
              limit: 30
            }
          });
        });
      });

      describe('Spotify.follow', function () {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.follow('user', 'exampleuser01');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'PUT',
            params: {
              type: 'user',
              ids: 'exampleuser01'
            }
          });
        });

        it('should call with multiple ids', function() {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.follow('artist', '74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'PUT',
            params: {
              type: 'artist',
              ids: '74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q'
            }
          });
        });
      });

      describe('Spotify.followUsers', function () {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.followUsers('exampleuser01');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'PUT',
            params: {
              type: 'user',
              ids: 'exampleuser01'
            }
          });
        });

        it('should call with multiple ids', function() {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.followUsers(['74ASZWbe4lXaubB36ztrGX','08td7MxkoHQkXnWAYD8d6Q']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'PUT',
            params: {
              type: 'user',
              ids: '74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q'
            }
          });
        });
      });

      describe('Spotify.followArtists', function () {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.followArtists('exampleartist01');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'PUT',
            params: {
              type: 'artist',
              ids: 'exampleartist01'
            }
          });
        });

        it('should call with multiple ids', function() {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.followArtists('74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'PUT',
            params: {
              type: 'artist',
              ids: '74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q'
            }
          });
        });
      });

      describe('Spotify.unfollow', function () {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.unfollow('user', 'exampleuser01');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'DELETE',
            params: {
              type: 'user',
              ids: 'exampleuser01'
            }
          });
        });

        it('should call with multiple ids', function() {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.unfollow('artist', '74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'DELETE',
            params: {
              type: 'artist',
              ids: '74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q'
            }
          });
        });
      });

      describe('Spotify.unfollowUsers', function () {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.unfollowUsers('exampleuser01');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'DELETE',
            params: {
              type: 'user',
              ids: 'exampleuser01'
            }
          });
        });

        it('should call with multiple ids', function() {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.unfollowUsers('74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'DELETE',
            params: {
              type: 'user',
              ids: '74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q'
            }
          });
        });
      });

      describe('Spotify.unfollowArtists', function () {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.unfollowArtists('exampleartist01');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'DELETE',
            params: {
              type: 'artist',
              ids: 'exampleartist01'
            }
          });
        });

        it('should call with multiple ids', function() {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.unfollowArtists('74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following', {
            method: 'DELETE',
            params: {
              type: 'artist',
              ids: '74ASZWbe4lXaubB36ztrGX,08td7MxkoHQkXnWAYD8d6Q'
            }
          });
        });
      });

      describe('Spotify.isFollowing', function() {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.isFollowing('user', 'exampleuser01');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following/contains', {
            params: {
              type: 'user',
              ids: 'exampleuser01'
            }
          });
        });

        it('should call with multiple ids', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.isFollowing('user', ['exampleuser01', 'exampleuser02']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following/contains', {
            params: {
              type: 'user',
              ids: 'exampleuser01,exampleuser02'
            }
          });
        });
      });

      describe('Spotify.isFollowingUsers', function() {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.isFollowingUsers('exampleuser01');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following/contains', {
            params: {
              type: 'user',
              ids: 'exampleuser01'
            }
          });
        });
      });

      describe('Spotify.isFollowingArtists', function() {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.isFollowingArtists('exampleartist01');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/following/contains', {
            params: {
              type: 'artist',
              ids: 'exampleartist01'
            }
          });
        });
      });

      describe('Spotify.followPlaylist', function () {
        it ('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.followPlaylist('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/jmperezperez/playlists/2v3iNvBX8Ay1Gt2uXtUKUT/followers', {
            method: 'PUT',
            data: {
              public: null
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });

        it('should be able to follow and set to public', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.followPlaylist('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT', true);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/jmperezperez/playlists/2v3iNvBX8Ay1Gt2uXtUKUT/followers', {
            method: 'PUT',
            data: {
              public: true
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });
      });

      describe('Spotify.unfollowPlaylist', function () {
        it ('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.unfollowPlaylist('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/jmperezperez/playlists/2v3iNvBX8Ay1Gt2uXtUKUT/followers', {
            method: 'DELETE'
          });
        });
      });

      describe('Spotify.areFollowingPlaylist', function () {
        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.areFollowingPlaylist('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT', 'possan,elogain');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/jmperezperez/playlists/2v3iNvBX8Ay1Gt2uXtUKUT/followers/contains', {
            params: {
              ids: 'possan,elogain'
            }
          });
        });

        it('should be able to be called with an array of users', function () {
          spyOn(Spotify, 'api');

          Spotify.setAccessToken('TESTING');

          Spotify.areFollowingPlaylist('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT', ['possan','elogain']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/jmperezperez/playlists/2v3iNvBX8Ay1Gt2uXtUKUT/followers/contains', {
            params: {
              ids: 'possan,elogain'
            }
          });
        });
      });
    });


    describe('Spotify.login', function () {
      it('should open the login window', function () {
        spyOn(window, 'open');

        Spotify.login();

        var w = 400,
            h = 500,
            left = (screen.width / 2) - (w / 2),
            top = (screen.height / 2) - (h / 2);

        var params = {
          client_id: null,
          redirect_uri: null,
          scope: '',
          response_type: 'token'
        };

        expect(window.open).toHaveBeenCalled();
        expect(window.open).toHaveBeenCalledWith('https://accounts.spotify.com/authorize?' + Spotify.toQueryString(params),
            'Spotify',
            'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left);
      });

      // it('should set the auth token', function (done) {
      //   spyOn(Spotify, 'setAccessToken');
      //   Spotify.login();
      //   setTimeout(function () {
      //     localStorage.setItem('spotify-token', 'TESTINGTOKEN');
      //   }, 1000);
      //   // console.log('spotify token: ', localStorage.getItem('spotify-token'));
      //   setTimeout(function () {
      //     expect(Spotify.setAccessToken).toHaveBeenCalled();
      //     expect(Spotify.setAccessToken).toHaveBeenCalledWith('TESTINGTOKEN');
      //     done();
      //   }, 3500);
      // });
    });
  });

});
