(function (window, angular, undefined) {
  'use strict';

  angular
    .module('spotify', [])
    .provider('Spotify', function () {

      // Module global settings.
      var settings = {};
      settings.clientId = null;
      settings.redirectUri = null;
      settings.scope = null;
      settings.authToken = null;

      this.setClientId = function (clientId) {
        settings.clientId = clientId;
        return settings.clientId;
      };

      this.getClientId = function () {
        return settings.clientId;
      };

      this.setAuthToken = function (authToken) {
        settings.authToken = authToken;
        return settings.authToken;
      };

      this.setRedirectUri = function (redirectUri) {
        settings.redirectUri = redirectUri;
        return settings.redirectUri;
      };

      this.getRedirectUri = function () {
        return settings.redirectUri;
      };

      this.setScope = function (scope) {
        settings.scope = scope;
        return settings.scope;
      };

      var utils = {};
      utils.toQueryString = function (obj) {
        var parts = [];
        angular.forEach(obj, function (value, key) {
          this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }, parts);
        return parts.join('&');
      };

      /**
       * API Base URL
       */
      settings.apiBase = 'https://api.spotify.com/v1';

      this.$get = ['$q', '$http', '$window', function ($q, $http, $window) {

        function NgSpotify () {
          this.clientId = settings.clientId;
          this.redirectUri = settings.redirectUri;
          this.apiBase = settings.apiBase;
          this.scope = settings.scope;
          this.authToken = settings.authToken;
          this.toQueryString = utils.toQueryString;
        }

        function openDialog (uri, name, options, cb) {
          var win = window.open(uri, name, options);
          var interval = window.setInterval(function () {
            try {
              if (!win || win.closed) {
                window.clearInterval(interval);
                cb(win);
              }
            } catch (e) {}
          }, 1000);
          return win;
        }

        NgSpotify.prototype = {
          api: function (endpoint, options) {
            var deferred = $q.defer();
            options = options || {};
            options.method = options.method || 'GET';

            $http({
              url: this.apiBase + endpoint,
              method: options.method,
              params: options.params,
              data: options.data,
              headers: options.headers,
              withCredentials: false
            })
            .success(function (data) {
              deferred.resolve(data);
            })
            .error(function (data) {
              deferred.reject(data);
            });
            return deferred.promise;
          },

          _auth: function (isJson) {
            var auth = {
              'Authorization': 'Bearer ' + this.authToken
            };
            if (isJson) {
              auth['Content-Type'] = 'application/json';
            }
            return auth;
          },

          /**
            ====================== Albums =====================
           */

          /**
           * Gets an album
           * Pass in album id or spotify uri
           */
          getAlbum: function (album) {
            album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

            return this.api('/albums/' + album);
          },

          /**
           * Gets an album
           * Pass in comma separated string or array of album ids
           */
          getAlbums: function (albums) {
            albums = angular.isString(albums) ? albums.split(',') : albums;
            angular.forEach(albums, function (value, index) {
              albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
            });
            return this.api('/albums', {
              params: {
                ids: albums ? albums.toString() : ''
              }
            });
          },

          /**
           * Get Album Tracks
           * Pass in album id or spotify uri
           */
          getAlbumTracks: function (album, options) {
            album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];
            var o = options && { params: options };
            return this.api('/albums/' + album + '/tracks', o);
          },


          /**
            ====================== Artists =====================
           */

          /**
           * Get an Artist
           */
          getArtist: function (artist) {
            artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

            return this.api('/artists/' + artist);
          },

          /**
           * Get multiple artists
           */
          getArtists: function (artists) {
            artists = angular.isString(artists) ? artists.split(',') : artists;
            angular.forEach(artists, function (value, index) {
              artists[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
            });
            return this.api('/artists/', {
              params: {
                ids: artists ? artists.toString() : ''
              }
            });
          },

          //Artist Albums
          getArtistAlbums: function (artist, options) {
            artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];
            var o = options && { params: options };
            return this.api('/artists/' + artist + '/albums', o);
          },

          /**
           * Get Artist Top Tracks
           * The country: an ISO 3166-1 alpha-2 country code.
           */
          getArtistTopTracks: function (artist, country) {
            artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

            return this.api('/artists/' + artist + '/top-tracks', {
              params: {
                country: country
              }
            });
          },

          getRelatedArtists: function (artist) {
            artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

            return this.api('/artists/' + artist + '/related-artists');
          },


          /**
            ====================== Browse =====================
           */
          getFeaturedPlaylists: function (options) {
            return this.api('/browse/featured-playlists', {
              params: options,
              headers: this._auth()
            });
          },

          getNewReleases: function (options) {
            return this.api('/browse/new-releases', {
              params: options,
              headers: this._auth()
            });
          },

          getCategories: function (options) {
            var o = { headers: this._auth() };
            if (options) { o.params = options; }
            return this.api('/browse/categories', o);
          },

          getCategory: function (category_id, options) {
            var o = { headers: this._auth() };
            if (options) { o.params = options; }
            return this.api('/browse/categories/' + category_id, o);
          },

          getCategoryPlaylists: function (category_id, options) {
            var o = { headers: this._auth() };
            if (options) { o.params = options; }
            return this.api('/browse/categories/' + category_id + '/playlists', o);
          },

          getRecommendations: function (options) {
            return this.api('/recommendations', {
              params: options,
              headers: this._auth()
            });
          },

          getAvailableGenreSeeds: function () {
            return this.api('/recommendations/available-genre-seeds', {
              headers: this._auth()
            });
          },


          /**
            ====================== Following =====================
           */
          following: function (type, options) {
            options = options || {};
            options.type = type;
            return this.api('/me/following', {
              params: options,
              headers: this._auth()
            });
          },

          follow: function (type, ids) {
            return this.api('/me/following', {
              method: 'PUT',
              params: { type: type, ids: ids },
              headers: this._auth()
            });
          },

          unfollow: function (type, ids) {
            return this.api('/me/following', {
              method: 'DELETE',
              params: { type: type, ids: ids },
              headers: this._auth()
            });
          },

          userFollowingContains: function (type, ids) {
            return this.api('/me/following/contains', {
              params: { type: type, ids: ids },
              headers: this._auth()
            });
          },

          followPlaylist: function (userId, playlistId, isPublic) {
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers', {
              method: 'PUT',
              data: {
                public: isPublic || null
              },
              headers: this._auth(true)
            });
          },

          unfollowPlaylist: function (userId, playlistId) {
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers', {
              method: 'DELETE',
              headers: this._auth()
            });
          },

          playlistFollowingContains: function(userId, playlistId, ids) {
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers/contains', {
              params: {
                ids: ids.toString()
              },
              headers: this._auth()
            });
          },


          /**
            ====================== Library =====================
           */
          getSavedUserTracks: function (options) {
            var o = { headers: this._auth() };
            if (options) { o.params = options; }
            return this.api('/me/tracks', o);
          },

          userTracksContains: function (tracks) {
            tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
            angular.forEach(tracks, function (value, index) {
              tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
            });
            return this.api('/me/tracks/contains', {
              params: {
                ids: tracks.toString()
              },
              headers: this._auth()
            });
          },

          saveUserTracks: function (tracks) {
            tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
            angular.forEach(tracks, function (value, index) {
              tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
            });
            return this.api('/me/tracks', {
              method: 'PUT',
              params: {
                ids: tracks.toString()
              },
              headers: this._auth()
            });
          },

          removeUserTracks: function (tracks) {
            tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
            angular.forEach(tracks, function (value, index) {
              tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
            });
            return this.api('/me/tracks', {
              method: 'DELETE',
              params: {
                ids: tracks.toString()
              },
              headers: this._auth(true)
            });
          },

          saveUserAlbums: function (albums) {
            albums = angular.isString(albums) ? albums.split(',') : albums;
            angular.forEach(albums, function (value, index) {
              albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
            });
            return this.api('/me/albums', {
              method: 'PUT',
              params: {
                ids: albums.toString()
              },
              headers: this._auth()
            });
          },

          getSavedUserAlbums: function (options) {
            var o = { headers: this._auth() };
            if (options) { o.params = options; }
            return this.api('/me/albums', o);
          },

          removeUserAlbums: function (albums) {
            albums = angular.isString(albums) ? albums.split(',') : albums;
            angular.forEach(albums, function (value, index) {
              albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
            });
            return this.api('/me/albums', {
              method: 'DELETE',
              params: {
                ids: albums.toString()
              },
              headers: this._auth(true)
            });
          },

          userAlbumsContains: function (albums) {
            albums = angular.isString(albums) ? albums.split(',') : albums;
            angular.forEach(albums, function (value, index) {
              albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
            });
            return this.api('/me/albums/contains', {
              params: {
                ids: albums.toString()
              },
              headers: this._auth()
            });
          },


          /**
            ====================== Personalization =====================
           */
           getUserTopArtists: function (options) {
             var o = { headers: this._auth() };
             if (options) { o.params = options; }
             return this.api('/me/top/artists', o);
           },

           getUserTopTracks: function (options) {
             var o = { headers: this._auth() };
             if (options) { o.params = options; }
             return this.api('/me/top/tracks', o);
           },


          /**
            ====================== Playlists =====================
           */
          getUserPlaylists: function (userId, options) {
            var o = { headers: this._auth() };
            if (options) { o.params = options; }
            return this.api('/users/' + userId + '/playlists', o);
          },

          getPlaylist: function (userId, playlistId, options) {
            var o = { headers: this._auth() };
            if (options) { o.params = options; }
            return this.api('/users/' + userId + '/playlists/' + playlistId, o);
          },

          getPlaylistTracks: function (userId, playlistId, options) {
            var o = { headers: this._auth() };
            if (options) { o.params = options; }
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', o);
          },

          createPlaylist: function (userId, options) {
            return this.api('/users/' + userId + '/playlists', {
              method: 'POST',
              data: options,
              headers: this._auth(true)
            });
          },

          addPlaylistTracks: function (userId, playlistId, tracks, options) {
            tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
            angular.forEach(tracks, function (value, index) {
              tracks[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
            });
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', {
              method: 'POST',
              params: {
                uris: tracks.toString(),
                position: options ? options.position : null
              },
              headers: this._auth(true)
            });
          },

          removePlaylistTracks: function (userId, playlistId, tracks) {
            tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
            var track;
            angular.forEach(tracks, function (value, index) {
              track = tracks[index];
              tracks[index] = {
                uri: track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track
              };
            });
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', {
              method: 'DELETE',
              data: {
                tracks: tracks
              },
              headers: this._auth(true)
            });
          },

          reorderPlaylistTracks: function (userId, playlistId, options) {
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', {
              method: 'PUT',
              data: options,
              headers: this._auth(true)
            });
          },

          replacePlaylistTracks: function (userId, playlistId, tracks) {
            tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
            var track;
            angular.forEach(tracks, function (value, index) {
              track = tracks[index];
              tracks[index] = track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track;
            });
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', {
              method: 'PUT',
              params: {
                uris: tracks.toString()
              },
              headers: this._auth(true)
            });
          },

          updatePlaylistDetails: function (userId, playlistId, options) {
            return this.api('/users/' + userId + '/playlists/' + playlistId, {
              method: 'PUT',
              data: options,
              headers: this._auth(true)
            });
          },

          /**
            ====================== Profiles =====================
           */

          getUser: function (userId) {
            return this.api('/users/' + userId);
          },

          getCurrentUser: function () {
            return this.api('/me', {
              headers: this._auth()
            });
          },



          /**
           * Search Spotify
           * q = search query
           * type = artist, album or track
           */
          search: function (q, type, options) {
            options = options || {};
            options.q = q;
            options.type = type;

            return this.api('/search', {
              params: options
            });
          },


          /**
            ====================== Tracks =====================
           */
          getTrack: function (track) {
            track = track.indexOf('spotify:') === -1 ? track : track.split(':')[2];

            return this.api('/tracks/' + track);
          },

          getTracks: function (tracks) {
            tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
            angular.forEach(tracks, function (value, index) {
              tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
            });
            return this.api('/tracks/', {
              params: {
                ids: tracks ? tracks.toString() : ''
              }
            });
          },

          getTrackAudioFeatures: function (track) {
            track = track.indexOf('spotify:') === -1 ? track : track.split(':')[2];
            return this.api('/audio-features/' + track);
          },

          getTracksAudioFeatures: function (tracks) {
            tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
            angular.forEach(tracks, function (value, index) {
              tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
            });
            return this.api('/audio-features/', {
              params: {
                ids: tracks ? tracks.toString() : ''
              }
            });
          },


          /**
            ====================== Login =====================
           */
          setAuthToken: function (authToken) {
            this.authToken = authToken;
            return this.authToken;
          },

          login: function () {
            var deferred = $q.defer();
            var that = this;

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

            var authCompleted = false;
            var authWindow = openDialog(
              'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
              'Spotify',
              'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left,
              function () {
                if (!authCompleted) {
                  deferred.reject();
                }
              }
            );

            function storageChanged (e) {
              if (e.key === 'spotify-token') {
                if (authWindow) { authWindow.close(); }
                authCompleted = true;

                that.setAuthToken(e.newValue);
                $window.removeEventListener('storage', storageChanged, false);

                deferred.resolve(e.newValue);
              }
            }

            $window.addEventListener('storage', storageChanged, false);

            return deferred.promise;
          }
        };

        return new NgSpotify();
      }];

    });

}(window, angular));
