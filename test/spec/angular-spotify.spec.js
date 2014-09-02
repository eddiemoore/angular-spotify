'use strict';

describe('angular-spotify', function () {

  describe('Spotify', function () {

    beforeEach(module('spotify'));

    var Spotify;

    beforeEach(inject(function (_Spotify_) {
      Spotify = _Spotify_;
    }));

    it('should be defined', function () {
      expect(Spotify).toBeDefined();
    });

    it('should be a function object', function () {
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

  });

});