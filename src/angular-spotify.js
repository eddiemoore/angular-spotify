(function (window, angular, undefined) {
  'use strict';

  function getSpotifyId (s) {
    return s.indexOf('spotify:') === -1 ? s : s.split(':')[2];
  }

  function stringToArray (s) {
    if (!s) { return; }
    var arr = angular.isString(s) ? s.split(',') : s;
    return arr.map(function (value) {
      return getSpotifyId(value);
    });
  }

  angular
    .module('spotify', [])
    .provider('Spotify', function () {

      // Module global settings.
      var settings = {};
      settings.clientId = null;
      settings.redirectUri = null;
      settings.scope = null;
      settings.accessToken = null;

      this.setClientId = function (clientId) {
        settings.clientId = clientId;
        return settings.clientId;
      };

      this.getClientId = function () {
        return settings.clientId;
      };

      this.setAccessToken = function (accessToken) {
        settings.accessToken = accessToken;
        return settings.accessToken;
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
          this.accessToken = settings.accessToken;
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
            options.headers = options.headers || {};
            if (this.accessToken) {
              options.headers.Authorization = 'Bearer ' + this.accessToken;
            }

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

          /**
            ====================== Albums =====================
           */

          /**
           * Gets an album
           * Pass in album id or spotify uri
           */
          getAlbum: function (album) {
            var a = getSpotifyId(album);
            return this.api('/albums/' + a);
          },

          /**
           * Gets an album
           * Pass in comma separated string or array of album ids
           */
          getAlbums: function (albums) {
            var a = stringToArray(albums);
            return this.api('/albums', {
              params: {
                ids: a ? a.toString() : ''
              }
            });
          },

          /**
           * Get Album Tracks
           * Pass in album id or spotify uri
           */
          getAlbumTracks: function (album, options) {
            var a = getSpotifyId(album);
            var o = options && { params: options };
            return this.api('/albums/' + a + '/tracks', o);
          },


          /**
            ====================== Artists =====================
           */

          /**
           * Get an Artist
           */
          getArtist: function (artist) {
            var a = getSpotifyId(artist);
            return this.api('/artists/' + a);
          },

          /**
           * Get multiple artists
           */
          getArtists: function (artists) {
            var a = stringToArray(artists);
            return this.api('/artists/', {
              params: {
                ids: a ? a.toString() : ''
              }
            });
          },

          //Artist Albums
          getArtistAlbums: function (artist, options) {
            var a = getSpotifyId(artist);
            var o = options && { params: options };
            return this.api('/artists/' + a + '/albums', o);
          },

          /**
           * Get Artist Top Tracks
           * The country: an ISO 3166-1 alpha-2 country code.
           */
          getArtistTopTracks: function (artist, country) {
            var a = getSpotifyId(artist);
            return this.api('/artists/' + a + '/top-tracks', {
              params: {
                country: country
              }
            });
          },

          getArtistRelatedArtists: function (artist) {
            var a = getSpotifyId(artist);
            return this.api('/artists/' + a + '/related-artists');
          },


          /**
            ====================== Browse =====================
           */
          getFeaturedPlaylists: function (options) {
            return this.api('/browse/featured-playlists', {
              params: options
            });
          },

          getNewReleases: function (options) {
            return this.api('/browse/new-releases', {
              params: options
            });
          },

          getCategories: function (options) {
            var o = {};
            if (options) { o.params = options; }
            return this.api('/browse/categories', o);
          },

          getCategory: function (category_id, options) {
            var o = {};
            if (options) { o.params = options; }
            return this.api('/browse/categories/' + category_id, o);
          },

          getCategoryPlaylists: function (category_id, options) {
            var o = {};
            if (options) { o.params = options; }
            return this.api('/browse/categories/' + category_id + '/playlists', o);
          },

          getRecommendations: function (options) {
            return this.api('/recommendations', {
              params: options
            });
          },

          getAvailableGenreSeeds: function () {
            return this.api('/recommendations/available-genre-seeds');
          },


          /**
            ====================== Following =====================
           */
          getFollowed: function (type, options) {
            var params = options || {};
            params.type = type;
            return this.api('/me/following', {
              params: params
            });
          },

          follow: function (type, ids) {
            return this.api('/me/following', {
              method: 'PUT',
              params: { type: type, ids: ids }
            });
          },

          unfollow: function (type, ids) {
            return this.api('/me/following', {
              method: 'DELETE',
              params: { type: type, ids: ids }
            });
          },

          isFollowing: function (type, ids) {
            return this.api('/me/following/contains', {
              params: { type: type, ids: ids }
            });
          },

          followPlaylist: function (userId, playlistId, isPublic) {
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers', {
              method: 'PUT',
              data: {
                public: isPublic || null
              },
              headers: {
                'Content-Type': 'application/json'
              }
            });
          },

          unfollowPlaylist: function (userId, playlistId) {
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers', {
              method: 'DELETE'
            });
          },

          areFollowingPlaylist: function(userId, playlistId, ids) {
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers/contains', {
              params: {
                ids: ids.toString()
              }
            });
          },


          /**
            ====================== Library =====================
           */
          getMySavedTracks: function (options) {
            var o = {};
            if (options) { o.params = options; }
            return this.api('/me/tracks', o);
          },

          containsMySavedTracks: function (tracks) {
            var trks = stringToArray(tracks);
            return this.api('/me/tracks/contains', {
              params: {
                ids: trks.toString()
              }
            });
          },

          addToMySavedTracks: function (tracks) {
            var trks = stringToArray(tracks);
            return this.api('/me/tracks', {
              method: 'PUT',
              params: {
                ids: trks.toString()
              }
            });
          },

          removeFromMySavedTracks: function (tracks) {
            var trks = stringToArray(tracks);
            return this.api('/me/tracks', {
              method: 'DELETE',
              params: {
                ids: trks.toString()
              },
              headers: {
                'Content-Type': 'application/json'
              }
            });
          },

          addToMySavedAlbums: function (albums) {
            var albs = stringToArray(albums);
            return this.api('/me/albums', {
              method: 'PUT',
              params: {
                ids: albs.toString()
              }
            });
          },

          getMySavedAlbums: function (options) {
            var o = {};
            if (options) { o.params = options; }
            return this.api('/me/albums', o);
          },

          removeFromMySavedAlbums: function (albums) {
            var albs = stringToArray(albums);
            return this.api('/me/albums', {
              method: 'DELETE',
              params: {
                ids: albs.toString()
              },
              headers: {
                'Content-Type': 'application/json'
              }
            });
          },

          containsMySavedAlbums: function (albums) {
            var albs = stringToArray(albums);
            return this.api('/me/albums/contains', {
              params: {
                ids: albs.toString()
              }
            });
          },


          /**
            ====================== Personalization =====================
           */
           getMyTopArtists: function (options) {
             var o = {};
             if (options) { o.params = options; }
             return this.api('/me/top/artists', o);
           },

           getMyTopTracks: function (options) {
             var o = {};
             if (options) { o.params = options; }
             return this.api('/me/top/tracks', o);
           },


          /**
            ====================== Playlists =====================
           */
          getUserPlaylists: function (userId, options) {
            var o = {};
            if (options) { o.params = options; }
            return this.api('/users/' + userId + '/playlists', o);
          },

          getPlaylist: function (userId, playlistId, options) {
            var o = {};
            if (options) { o.params = options; }
            return this.api('/users/' + userId + '/playlists/' + playlistId, o);
          },

          getPlaylistTracks: function (userId, playlistId, options) {
            var o = {};
            if (options) { o.params = options; }
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', o);
          },

          createPlaylist: function (userId, options) {
            return this.api('/users/' + userId + '/playlists', {
              method: 'POST',
              data: options,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          },

          addTracksToPlaylist: function (userId, playlistId, tracks, options) {
            var arr = angular.isArray(tracks) ? tracks : tracks.split(',');
            var trks = arr.map(function (value) {
              return value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
            });
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', {
              method: 'POST',
              params: {
                uris: trks.toString(),
                position: options ? options.position : null
              },
              headers: {
                'Content-Type': 'application/json'
              }
            });
          },

          removeTracksFromPlaylist: function (userId, playlistId, tracks) {
            var arr = angular.isArray(tracks) ? tracks : tracks.split(',');
            var trks = arr.map(function (track) {
              return {
                uri: track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track
              };
            });
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', {
              method: 'DELETE',
              data: {
                tracks: trks
              },
              headers: {
                'Content-Type': 'application/json'
              }
            });
          },

          reorderTracksInPlaylist: function (userId, playlistId, options) {
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', {
              method: 'PUT',
              data: options,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          },

          replaceTracksInPlaylist: function (userId, playlistId, tracks) {
            var arr = tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
            var trks = arr.map(function (track) {
              return track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track;
            });
            return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', {
              method: 'PUT',
              params: {
                uris: trks.toString()
              },
              headers: {
                'Content-Type': 'application/json'
              }
            });
          },

          changePlaylistDetails: function (userId, playlistId, options) {
            return this.api('/users/' + userId + '/playlists/' + playlistId, {
              method: 'PUT',
              data: options,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          },

          /**
            ====================== Profiles =====================
           */

          getUser: function (userId) {
            return this.api('/users/' + userId);
          },

          getMe: function () {
            return this.api('/me');
          },



          /**
           * Search Spotify
           * q = search query
           * type = artist, album or track
           */
          search: function (q, types, options) {
            var params = options || {};
            params.q = q;
            params.type = angular.isArray(types) ? types.join(',') : types;

            return this.api('/search', {
              params: params
            });
          },

          searchAlbums: function (q, options) {
            return this.search(q, 'album', options);
          },

          searchArtists: function (q, options) {
            return this.search(q, 'artist', options);
          },

          searchTracks: function (q, options) {
            return this.search(q, 'track', options);
          },

          searchPlaylists: function (q, options) {
            return this.search(q, 'playlist', options);
          },


          /**
            ====================== Tracks =====================
           */
          getTrack: function (track) {
            var t = getSpotifyId(track);
            return this.api('/tracks/' + t);
          },

          getTracks: function (tracks) {
            var trks = stringToArray(tracks);
            return this.api('/tracks/', {
              params: {
                ids: trks ? trks.toString() : ''
              }
            });
          },

          getAudioFeaturesForTrack: function (track) {
            var t = getSpotifyId(track);
            return this.api('/audio-features/' + t);
          },

          getAudioFeaturesForTracks: function (tracks) {
            var trks = stringToArray(tracks);
            return this.api('/audio-features/', {
              params: {
                ids: trks ? trks.toString() : ''
              }
            });
          },


          /**
            ====================== Login =====================
           */
          setAccessToken: function (accessToken) {
            this.accessToken = accessToken;
            return this.accessToken;
          },

          getAccessToken: function () {
            return this.accessToken;
          },

          login: function () {
            var deferred = $q.defer();
            var that = this;

            var w = 400;
            var h = 500;
            var left = (screen.width / 2) - (w / 2);
            var top = (screen.height / 2) - (h / 2);

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

                that.setAccessToken(e.newValue);
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
