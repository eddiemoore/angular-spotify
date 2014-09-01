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
      settings.scope = null;
      settings.accessToken = null;

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

      this.setScope = function (scope) {
        settings.scope = scope;
      };

      var toQueryString = function (obj) {
        var parts = [];
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
          }
        }
        return parts.join('&');
      };

      /**
       * SDK version
       */
      settings.version = 'v1';

      settings.apiBase = 'https://api.spotify.com/' + settings.version;

      this.$get = function ($q, $http, $window) {

        function NgSpotify () {
          this.clientId = settings.clientId;
          this.redirectUri = settings.redirectUri;
          this.apiBase = settings.apiBase;
        }

        NgSpotify.prototype.api = function(endpoint, method, params, data, headers) {
          var deferred = $q.defer();

          $http({
            url: this.apiBase + endpoint,
            method: method ? method : 'GET',
            params: params,
            data: data,
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
            ids: albums.toString()
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

        NgSpotify.prototype.getRelatedArtists = function(artist) {
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


        /**
          ====================== Playlists =====================
         */
        NgSpotify.prototype.getUserPlaylists = function(userId, options) {
          return this.api('/users/' + userId + '/playlists', 'GET', options, null, {
            'Authorization': 'Bearer ' + settings.authToken
          });
        };

        NgSpotify.prototype.getPlaylist = function(userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId, 'GET', options, null, {
            'Authorization': 'Bearer ' + settings.authToken
          });
        };

        NgSpotify.prototype.getPlaylistTracks = function(userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'GET', options, null, {
            'Authorization': 'Bearer ' + settings.authToken
          });
        };

        NgSpotify.prototype.createPlaylist = function(userId, options) {
          return this.api('/users/' + userId + '/playlists', 'POST', null, options, {
            'Authorization': 'Bearer ' + settings.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.addPlaylistTracks = function(userId, playlistId, tracks) {
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'POST', {
            uris: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + settings.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.removePlaylistTracks = function(userId, playlistId, tracks) {
          var t = [];
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          var track;
          for (var i = 0; i < tracks.length; i++) {
            track = tracks[i];
            t.push({
              uri: track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track
            });
          }
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'DELETE', null, {
            tracks: t
          }, {
            'Authorization': 'Bearer ' + settings.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.replacePlaylistTracks = function(userId, playlistId, tracks) {
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          var track;
          for (var i = 0; i < tracks.length; i++) {
            track = tracks[i];
            tracks[i] = track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track;
          }
          return this.api('/users/' + userId + '/playlistId' + playlistId + '/tracks', 'PUT', {
            uris: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + settings.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.updatePlaylistDetails = function(userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId, 'PUT', null, options, {
            'Authorization': 'Bearer ' + settings.authToken,
            'Content-Type': 'application/json'
          });
        };

        /**
          ====================== User =====================
         */

        NgSpotify.prototype.getUser = function(userId) {
          return this.api('/users/' + userId);
        };

        NgSpotify.prototype.getCurrentUser = function() {
          return this.api('/me', 'GET', null, null, {
            'Authorization': 'Bearer ' + settings.authToken
          });
        };

        /**
          ====================== User Library =====================
         */
        NgSpotify.prototype.getSavedUserTracks = function(options) {
          return this.api('/me/tracks', 'GET', options, null, {
            'Authorization': 'Bearer ' + settings.authToken
          });
        };

        NgSpotify.prototype.userTracksContains = function(tracks) {
          return this.api('/me/tracks', 'GET', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + settings.authToken
          });
        };

        NgSpotify.prototype.saveUserTracks = function(tracks) {
          return this.api('/me/tracks', 'PUT', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + settings.authToken
          });
        };

        NgSpotify.prototype.removeUserTracks = function(tracks) {
          return this.api('/me/tracks', 'DELETE', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + settings.authToken,
            'Content-Type': 'application/json'
          });
        };

        /**
          ====================== Login =====================
         */
        NgSpotify.prototype.login = function() {
          var deferred = $q.defer();

          var w = 400,
              h = 500,
              left = (screen.width / 2) - (w / 2),
              top = (screen.height / 2) - (h / 2);

          var params = {
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope || '',
            response_type: 'token'
          };

          var authWindow = window.open(
            'https://accounts.spotify.com/authorize?' + toQueryString(params),
            'Spotify',
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left
          );

          function receiveMessage(event) {
            if (authWindow) {
              authWindow.close();
            }

            settings.accessToken = event.data;
            deferred.resolve(event.data);
          }

          $window.addEventListener('message', receiveMessage, false);

          return deferred.promise;
        };

        return new NgSpotify();
      };

    });

}(window, angular));
