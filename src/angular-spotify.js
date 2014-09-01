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
          options = options || {};
          options.q = q;
          options.type = type;

          return this.api('/search', 'GET', options);
        };

        /**
          ====================== Albums =====================
         */

        /**
         * Gets an album
         * Pass in album id or spotify uri
         */
        NgSpotify.prototype.getAlbum = function(album) {
          album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

          return this.api('/albums/' + album);
        };

        /**
         * Gets an album
         * Pass in comma separated string or array of album ids
         */
        NgSpotify.prototype.getAlbums = function(albums) {
          return this.api('/albums', 'GET', {
            ids: albums
          });
        };

        /**
         * Get Album Tracks
         * Pass in album id or spotify uri
         */
        NgSpotify.prototype.getAlbumTracks = function(album, options) {
          album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

          return this.api('/albums/' + album + '/tracks', 'GET', options);
        };

        /**
          ====================== Artists =====================
         */

        /**
         * Get an Artist
         */
        NgSpotify.prototype.getArtist = function(artist) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist);
        };

        NgSpotify.prototype.getArtists = function(artists) {
          return this.api('/artists/', 'GET', {
            ids: artists.toString()
          });
        };

        //Artist Albums
        NgSpotify.prototype.getArtistAlbums = function(artist, options) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/albums', 'GET', options);
        };

        /**
         * Get Artist Top Tracks
         * The country: an ISO 3166-1 alpha-2 country code.
         */
        NgSpotify.prototype.getArtistTopTracks = function(artist, country) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/top-tracks', 'GET', {
            country: country
          });
        };

        NgSpotify.prototype.getArtistRelated = function(artist) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/related-artists');
        };


        /**
          ====================== Tracks =====================
         */
        NgSpotify.prototype.getTrack = function(track) {
          track = track.indexOf('spotify:') === -1 ? track : track.split(':')[2];

          return this.api('/tracks/' + track);
        };

        NgSpotify.prototype.getTracks = function(tracks) {
          return this.api('/tracks/', 'GET', {
            ids: tracks.toString()
          });
        };

        return new NgSpotify();
      };

    });

}(window, angular));
