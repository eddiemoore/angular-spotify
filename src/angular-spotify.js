(function (window, angular, undefined) {
  'use strict';

  // Module global settings.
  var settings = {};

  angular
    .module('spotify', [])
    // Declare module settings value
    .value('settings', settings)
    .provider('Spotify', function () {

      /**
       * Spotify Client ID
       * @type {Number}
       */
      settings.clientId = null;
      settings.redirectUri = null;

      this.setClientId = function (clientId) {
        console.log('set clientId');
        settings.clientId = clientId;
      };

      this.getClientId = function () {
        return settings.clientId;
      };

      this.setRedirectUri = function (redirectUri) {
        settings.redirectUri = redirectUri;
      };

      this.getRedirectUri = function () {
        return settings.redirectUri;
      };

      /**
       * SDK version
       */
      settings.version = 'v1';

      settings.apiBase = 'https://api.spotify.com/' + settings.version;

      this.$get = function ($q, $http) {

        function NgSpotify () {
          this.clientId = settings.clientId;
          this.apiBase = settings.apiBase;
        }

        NgSpotify.prototype.api = function(endpoint, method, params, headers) {
          var deferred = $q.defer();

          $http({
            url: this.apiBase + endpoint,
            method: method ? method : 'GET',
            params: params,
            headers: headers
          })
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (data) {
            deferred.reject(data);
          });

          return deferred.promise;
        };

        /**
         * Search Spotify
         * q = search query
         * type = artist, album or track
         */
        NgSpotify.prototype.search = function(q, type, options) {
          var deferred = $q.defer();

          options = options || {};
          options.q = q;
          options.type = type;

          this
            .api('/search', 'GET', options)
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };

        /**
          ====================== Albums =====================
         */

        /**
         * Gets an album
         * Pass in album id or spotify uri
         */
        NgSpotify.prototype.getAlbum = function(album) {
          var deferred = $q.defer();

          album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

          this
            .api('/albums/' + album)
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };

        /**
         * Gets an album
         * Pass in comma separated string or array of album ids
         */
        NgSpotify.prototype.getAlbums = function(albums) {
          var deferred = $q.defer();

          this
            .api('/albums', 'GET', {
              ids: albums
            })
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };

        /**
         * Get Album Tracks
         * Pass in album id or spotify uri
         */
        NgSpotify.prototype.getAlbumTracks = function(album, options) {
          var deferred = $q.defer();

          album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

          this
            .api('/albums/' + album + '/tracks', 'GET', options)
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };

        /**
          ====================== Artists =====================
         */

        /**
         * Get an Artist
         */
        NgSpotify.prototype.getArtist = function(artist) {
          var deferred = $q.defer();

          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          this
            .api('/artists/' + artist)
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };

        NgSpotify.prototype.getArtists = function(artists) {
          var deferred = $q.defer();

          this
            .api('/artists/', 'GET', {
              ids: artists.toString()
            })
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };

        //Artist Albums
        NgSpotify.prototype.getArtistAlbums = function(artist, options) {
          var deferred = $q.defer();

          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          this
            .api('/artists/' + artist + '/albums', 'GET', options)
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };

        /**
         * Get Artist Top Tracks
         * The country: an ISO 3166-1 alpha-2 country code.
         */
        NgSpotify.prototype.getArtistTopTracks = function(artist, country) {
          var deferred = $q.defer();

          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          this
            .api('/artists/' + artist + '/top-tracks', 'GET', {
              country: country
            })
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };

        NgSpotify.prototype.getArtistRelated = function(artist) {
          var deferred = $q.defer();

          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          this
            .api('/artists/' + artist + '/related-artists')
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };


        /**
          ====================== Tracks =====================
         */
        NgSpotify.prototype.getTrack = function(track) {
          var deferred = $q.defer();

          track = track.indexOf('spotify:') === -1 ? track : track.split(':')[2];

          this
            .api('/tracks/' + track)
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };

        NgSpotify.prototype.getTracks = function(tracks) {
          var deferred = $q.defer();

          this
            .api('/tracks/', 'GET', {
              ids: tracks.toString()
            })
            .then(function(data) {
              deferred.resolve(data);
            }, function(data) {
              deferred.reject(data);
            });

          return deferred.promise;
        };

        return new NgSpotify();
      };

    });

}(window, angular));
