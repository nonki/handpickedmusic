/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDailyTrack = /* GraphQL */ `
  query GetDailyTrack {
    getDailyTrack
  }
`;
export const enrichTrack = /* GraphQL */ `
  query EnrichTrack($spotifyId: String) {
    enrichTrack(spotifyId: $spotifyId) {
      id
      colorHex
      spotifyId
      date
      trackName
      artistName
      albumName
      previewUrl
      createdAt
      updatedAt
    }
  }
`;
export const getTrack = /* GraphQL */ `
  query GetTrack($id: ID!) {
    getTrack(id: $id) {
      id
      spotifyId
      date
      createdAt
      updatedAt
    }
  }
`;
export const listTracks = /* GraphQL */ `
  query ListTracks(
    $filter: ModelTrackFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTracks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        spotifyId
        date
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMusic = /* GraphQL */ `
  query GetMusic($id: ID!) {
    getMusic(id: $id) {
      id
      colorHex
      spotifyId
      date
      trackName
      artistName
      albumName
      previewUrl
      createdAt
      updatedAt
    }
  }
`;
export const listMusics = /* GraphQL */ `
  query ListMusics(
    $filter: ModelMusicFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMusics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        colorHex
        spotifyId
        date
        trackName
        artistName
        albumName
        previewUrl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
