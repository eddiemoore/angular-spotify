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

    describe('Spotify.search', function () {

      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      it('should make an ajax call to https://api.spotify.com/v1/search', function () {

        $httpBackend.when('GET', api + '/search', {
          q: 'Nirvana',
          type: 'artist'
        }).respond({});

        expect(Spotify.search('Nirvana', 'artist')).toBeDefined();
      });

      it('should resolve to an object of artists', function () {
        $httpBackend.when('GET', api + '/search?q=Nirvana&type=artist').respond(200, { 'artists': { } });

        var promise = Spotify.search('Nirvana', 'artist'),
            result;

        promise.then(function (data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toBeDefined();
        expect(result instanceof Object).toBeTruthy();
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
      describe('Spotify.getAlbum', function () {
        var $httpBackend;
        var Spotify;
        var api = 'https://api.spotify.com/v1';

        beforeEach(inject(function(_Spotify_, _$httpBackend_) {
          Spotify = _Spotify_;
          $httpBackend = _$httpBackend_;
        }));

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
        var $httpBackend;
        var Spotify;
        var api = 'https://api.spotify.com/v1';

        beforeEach(inject(function(_Spotify_, _$httpBackend_) {
          Spotify = _Spotify_;
          $httpBackend = _$httpBackend_;
        }));

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
        var $httpBackend;
        var Spotify;
        var api = 'https://api.spotify.com/v1';

        beforeEach(inject(function(_Spotify_, _$httpBackend_) {
          Spotify = _Spotify_;
          $httpBackend = _$httpBackend_;
        }));

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
      describe('Spotify.getArtist', function () {
        var $httpBackend;
        var Spotify;
        var api = 'https://api.spotify.com/v1';

        beforeEach(inject(function(_Spotify_, _$httpBackend_) {
          Spotify = _Spotify_;
          $httpBackend = _$httpBackend_;
        }));

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
        var $httpBackend;
        var Spotify;
        var api = 'https://api.spotify.com/v1';

        beforeEach(inject(function(_Spotify_, _$httpBackend_) {
          Spotify = _Spotify_;
          $httpBackend = _$httpBackend_;
        }));

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
    });

    describe('Tracks', function () {

    });

    describe('Playlists', function () {

    });

  });

});
