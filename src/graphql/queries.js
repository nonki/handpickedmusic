/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDailyTrack = /* GraphQL */ `
  query GetDailyTrack {
    getDailyTrack
  }
`;
export const enrichTrack = /* GraphQL */ `
  query EnrichTrack($spotifyId: String, $accessToken: String) {
    enrichTrack(spotifyId: $spotifyId, accessToken: $accessToken) {
      id
      colorHex
      createdAt
      updatedAt
      spotifyId
      trackName
      artistName
      albumName
      imageUrl
      previewUrl
      externalUrl
    }
  }
`;
export const authUser = /* GraphQL */ `
  query AuthUser($code: String, $refreshToken: String, $redirectUri: String) {
    authUser(
      code: $code
      refreshToken: $refreshToken
      redirectUri: $redirectUri
    ) {
      id
      createdAt
      updatedAt
      accessToken
      refreshToken
      expiry
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
      createdAt
      updatedAt
      spotifyId
      trackName
      artistName
      albumName
      imageUrl
      previewUrl
      externalUrl
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
        createdAt
        updatedAt
        spotifyId
        trackName
        artistName
        albumName
        imageUrl
        previewUrl
        externalUrl
      }
      nextToken
    }
  }
`;
export const getAuth = /* GraphQL */ `
  query GetAuth($id: ID!) {
    getAuth(id: $id) {
      id
      createdAt
      updatedAt
      accessToken
      refreshToken
      expiry
    }
  }
`;
export const listAuths = /* GraphQL */ `
  query ListAuths(
    $filter: ModelAuthFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAuths(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
        accessToken
        refreshToken
        expiry
      }
      nextToken
    }
  }
`;
