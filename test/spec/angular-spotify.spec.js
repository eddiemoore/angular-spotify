'use strict';

describe('angular-spotify', function () {

  //For the config
  describe('SpotifyProvider', function () {

    var spotifyProvider;

    beforeEach(function () {
      // Initialize the service provider by injecting it to a fake module's config block
      angular.module('testApp', function () {})
        .config(function (SpotifyProvider) {
        spotifyProvider = SpotifyProvider;
      });
      // Initialize angular-spotify injector
      module('spotify', 'testApp');

      // Kickstart the injectors previously registered with calls to angular.mock.module
      inject(function () {});
    });

    it('should be defined', function () {
      expect(spotifyProvider).toBeDefined();
    });

    it('should have a method setClientId()', function () {
      expect(spotifyProvider.setClientId).toBeDefined();
    });

    it('should have a method getClientId()', function () {
      expect(spotifyProvider.getClientId).toBeDefined();
    });

    it('should have a method setRedirectUri()', function () {
      expect(spotifyProvider.setRedirectUri).toBeDefined();
    });

    it('should have a method getRedirectUri()', function () {
      expect(spotifyProvider.getRedirectUri).toBeDefined();
    });

    it('should have a method setScope()', function () {
      expect(spotifyProvider.setScope).toBeDefined();
    });

    it('should have a method setScope()', function () {
      expect(spotifyProvider.setScope).toBeDefined();
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

  });

  //For injecting into controllers
  describe('Spotify', function () {

    beforeEach(module('spotify'));

    var Spotify;

    beforeEach(inject(function (_Spotify_) {
      Spotify = _Spotify_;
    }));

    it('should be defined', function () {
      expect(Spotify).toBeDefined();
    });

    it('should be an object', function () {
      expect(typeof Spotify).toBe('object');
    });

    it('should have a method api()', function () {
      expect(Spotify.api).toBeDefined();
    });

    it('should have a method search()', function () {
      expect(Spotify.search).toBeDefined();
    });

    it('should have a method getAlbum()', function () {
      expect(Spotify.getAlbum).toBeDefined();
    });

    it('should have a method getAlbums()', function () {
      expect(Spotify.getAlbums).toBeDefined();
    });

    it('should have a method getAlbumTracks()', function () {
      expect(Spotify.getAlbumTracks).toBeDefined();
    });

    it('should have a method getArtist()', function () {
      expect(Spotify.getArtist).toBeDefined();
    });

    it('should have a method getArtists()', function () {
      expect(Spotify.getArtists).toBeDefined();
    });

    it('should have a method getArtistAlbums()', function () {
      expect(Spotify.getArtistAlbums).toBeDefined();
    });

    it('should have a method getArtistTopTracks()', function () {
      expect(Spotify.getArtistTopTracks).toBeDefined();
    });

    it('should have a method getRelatedArtists()', function () {
      expect(Spotify.getRelatedArtists).toBeDefined();
    });

    it('should have a method getTrack()', function () {
      expect(Spotify.getTrack).toBeDefined();
    });

    it('should have a method getTracks()', function () {
      expect(Spotify.getTracks).toBeDefined();
    });

    it('should have a method getUserPlaylists()', function () {
      expect(Spotify.getUserPlaylists).toBeDefined();
    });

    it('should have a method getPlaylist()', function () {
      expect(Spotify.getPlaylist).toBeDefined();
    });

    it('should have a method getPlaylistTracks()', function () {
      expect(Spotify.getPlaylistTracks).toBeDefined();
    });

    it('should have a method createPlaylist()', function () {
      expect(Spotify.createPlaylist).toBeDefined();
    });

    it('should have a method addPlaylistTracks()', function () {
      expect(Spotify.addPlaylistTracks).toBeDefined();
    });

    it('should have a method removePlaylistTracks()', function () {
      expect(Spotify.removePlaylistTracks).toBeDefined();
    });

    it('should have a method replacePlaylistTracks()', function () {
      expect(Spotify.replacePlaylistTracks).toBeDefined();
    });

    it('should have a method updatePlaylistDetails()', function () {
      expect(Spotify.updatePlaylistDetails).toBeDefined();
    });

    it('should have a method getUser()', function () {
      expect(Spotify.getUser).toBeDefined();
    });

    it('should have a method getCurrentUser()', function () {
      expect(Spotify.getCurrentUser).toBeDefined();
    });

    it('should have a method getSavedUserTracks()', function () {
      expect(Spotify.getSavedUserTracks).toBeDefined();
    });

    it('should have a method userTracksContains()', function () {
      expect(Spotify.userTracksContains).toBeDefined();
    });

    it('should have a method saveUserTracks()', function () {
      expect(Spotify.saveUserTracks).toBeDefined();
    });

    it('should have a method removeUserTracks()', function () {
      expect(Spotify.removeUserTracks).toBeDefined();
    });

    it('should have a method setAuthToken()', function () {
      expect(Spotify.setAuthToken).toBeDefined();
    });

    it('should have a method login()', function () {
      expect(Spotify.login).toBeDefined();
    });

    it('should set the AuthToken', function () {
      expect(Spotify.setAuthToken('ABCDEFGHIJKLMNOP')).toBe('ABCDEFGHIJKLMNOP');
    });

    it('should turn an object into a query string', function () {
      expect(Spotify.toQueryString({a: 't', b: 4, c: 'q'})).toBe('a=t&b=4&c=q');
    });

    describe('Spotify.search', function () {

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

      it('should make an ajax call to https://api.spotify.com/v1/search', function () {

        $httpBackend.when('GET', api + '/search', {
          q: 'Nirvana',
          type: 'artist'
        }).respond({});

        expect(Spotify.search('Nirvana', 'artist')).toBeDefined();
      });

      it('should return an array of artists', function () {
        $httpBackend.when('GET', api + '/search?q=Nirvana&type=artist').respond(
          getJSONFixture('search.artist.json')
        );

        Spotify.search('Nirvana', 'artist').then(function (data) {
          expect(data).toBeDefined();
          expect(data.artists.items.length).toBeGreaterThan(0);
        });

        $httpBackend.flush();
      });

      it('should reject the promise and respond with error', function () {
        $httpBackend.when('GET', api + '/search?q=Nirvana').respond(400, {
          'error': {
            'status': 400,
            'message': 'Missing parameter type'
          }
        });

        var promise = Spotify.search('Nirvana'),
            result;

        promise.then(function (data) {
          result = data;
        }, function (reason) {
          result = reason;
        });

        $httpBackend.flush();
        expect(result).toBeDefined();
        expect(result instanceof Object).toBeTruthy();
        expect(result.error.status).toBe(400);
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

          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj').respond({});

          expect(Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj').respond({});

          var promise = Spotify.getAlbum('spotify:album:0sNOF9WDwhWunNAHPD3Baj'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should resolve to an object of an album', function () {
          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj').respond(200, { 'album_type': { } });

          var promise = Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/albums/ABCDEFGHIJKLMNOP').respond(404, {
            'error': {
              'status': 404,
              'message': 'non existing id'
            }
          });

          var promise = Spotify.getAlbum('ABCDEFGHIJKLMNOP'),
              result;

          promise.then(function (data) {
            result = data;
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

          $httpBackend.when('GET', api + '/albums?ids=41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').respond({});

          expect(Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37')).toBeDefined();
        });

        it('should resolve to an array of albums', function () {
          $httpBackend.when('GET', api + '/albums?ids=41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').respond(200, { 'albums': [] });

          var promise = Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.albums instanceof Array).toBeTruthy();
        });

        it('should resolve to an array of albums when sending an array', function () {
          $httpBackend.when('GET', api + '/albums?ids=41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').respond(200, { 'albums': [] });

          var promise = Spotify.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ','6JWc4iAiJ9FjyK0B59ABb4','6UXCm6bOO4gFlDQZV5yL37']),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.albums instanceof Array).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/albums?ids=').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var promise = Spotify.getAlbums(),
              result;

          promise.then(function (data) {
            result = data;
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

          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj/tracks').respond({});

          expect(Spotify.getAlbumTracks('0sNOF9WDwhWunNAHPD3Baj')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj/tracks').respond({});

          var promise = Spotify.getAlbumTracks('spotify:album:0sNOF9WDwhWunNAHPD3Baj'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should resolve to an object of album tracks', function () {
          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj/tracks').respond(200, { 'items': [] });

          var promise = Spotify.getAlbumTracks('0sNOF9WDwhWunNAHPD3Baj'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/albums/ABCDEFGHIJKLMNOP/tracks').respond(404, {
            'error': {
              'status': 404,
              'message': 'non existing id'
            }
          });

          var promise = Spotify.getAlbumTracks('ABCDEFGHIJKLMNOP'),
              result;

          promise.then(function (data) {
            result = data;
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

          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV').respond({});

          expect(Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV').respond({});

          var promise = Spotify.getArtist('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should resolve to an object of an artist', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV').respond(200, { 'external_urls': {} });

          var promise = Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV'),
              result;

          promise.then(function (data) {
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

          var promise = Spotify.getArtist('ABCDEFGHIJKLMNOP'),
              result;

          promise.then(function (data) {
            result = data;
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

          $httpBackend.when('GET', api + '/artists?ids=0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin').respond({});

          expect(Spotify.getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin')).toBeDefined();
        });

        it('should resolve to an object of an artist', function () {
          $httpBackend.when('GET', api + '/artists/?ids=0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin').respond(200, { 'artists': [] });

          var promise = Spotify.getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/artists/?ids=').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var promise = Spotify.getArtists(),
              result;

          promise.then(function (data) {
            result = data;
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

          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/albums').respond({});

          expect(Spotify.getArtistAlbums('0LcJLqbBmaGUft1e9Mm8HV')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/albums').respond({});

          var promise = Spotify.getArtistAlbums('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should resolve to an array of artist albums', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/albums').respond(200, { 'albums': [] });

          var promise = Spotify.getArtistAlbums('0LcJLqbBmaGUft1e9Mm8HV'),
              result;

          promise.then(function (data) {
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

          var promise = Spotify.getArtistAlbums('ABCDEFGHIJKLMNOP'),
              result;

          promise.then(function (data) {
            result = data;
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

          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/top-tracks').respond({});

          expect(Spotify.getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/top-tracks').respond({});

          var promise = Spotify.getArtistTopTracks('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should resolve to an array of artist albums', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/top-tracks').respond(200, { 'albums': [] });

          var promise = Spotify.getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/artists/ABCDEFGHIJKLMNOP/top-tracks').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var promise = Spotify.getArtistTopTracks('ABCDEFGHIJKLMNOP'),
              result;

          promise.then(function (data) {
            result = data;
          }, function (reason) {
            result = reason;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getRelatedArtists', function() {
        it('should make an ajax call to https://api.spotify.com/v1/artists/{id}/related-artists', function () {

          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/related-artists').respond({});

          expect(Spotify.getRelatedArtists('0LcJLqbBmaGUft1e9Mm8HV')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/related-artists').respond({});

          var promise = Spotify.getRelatedArtists('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should resolve to an array of artists', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/related-artists').respond(200, { 'albums': [] });

          var promise = Spotify.getRelatedArtists('0LcJLqbBmaGUft1e9Mm8HV'),
              result;

          promise.then(function (data) {
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

          var promise = Spotify.getRelatedArtists('ABCDEFGHIJKLMNOP'),
              result;

          promise.then(function (data) {
            result = data;
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

          $httpBackend.when('GET', api + '/tracks/0eGsygTp906u18L0Oimnem').respond({});

          expect(Spotify.getTrack('0eGsygTp906u18L0Oimnem')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          $httpBackend.when('GET', api + '/tracks/0eGsygTp906u18L0Oimnem').respond({});

          var promise = Spotify.getTrack('spotify:artist:0eGsygTp906u18L0Oimnem'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should resolve to an object of a track', function () {
          $httpBackend.when('GET', api + '/tracks/0eGsygTp906u18L0Oimnem').respond(200, { 'albums': [] });

          var promise = Spotify.getTrack('0eGsygTp906u18L0Oimnem'),
              result;

          promise.then(function (data) {
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

          var promise = Spotify.getTrack('ABCDEFGHIJKLMNOP'),
              result;

          promise.then(function (data) {
            result = data;
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

          $httpBackend.when('GET', api + '/tracks/?ids=0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').respond({});

          expect(Spotify.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G')).toBeDefined();
        });

        it('should resolve to an array of tracks', function () {
          $httpBackend.when('GET', api + '/tracks/?ids=0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').respond(200, { 'tracks': [] });

          var promise = Spotify.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G'),
              result;

          promise.then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/tracks/?ids=').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var promise = Spotify.getTracks(),
              result;

          promise.then(function (data) {
            result = data;
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

          $httpBackend.when('GET', api + '/users/wizzler').respond({});

          expect(Spotify.getUser('wizzler')).toBeDefined();
        });

        it('should resolve to an object of a user', function () {
          $httpBackend.when('GET', api + '/users/wizzler').respond(200, { });

          var promise = Spotify.getUser('wizzler'),
              result;

          promise.then(function (data) {
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

          var promise = Spotify.getUser(':":ADSAD'),
              result;

          promise.then(function (data) {
            result = data;
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

  });

});
