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

        return new NgSpotify();
      };

    });

}(window, angular));
