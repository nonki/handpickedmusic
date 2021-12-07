/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTrack = /* GraphQL */ `
  mutation CreateTrack(
    $input: CreateTrackInput!
    $condition: ModelTrackConditionInput
  ) {
    createTrack(input: $input, condition: $condition) {
      id
      spotifyId
      date
      createdAt
      updatedAt
    }
  }
`;
export const updateTrack = /* GraphQL */ `
  mutation UpdateTrack(
    $input: UpdateTrackInput!
    $condition: ModelTrackConditionInput
  ) {
    updateTrack(input: $input, condition: $condition) {
      id
      spotifyId
      date
      createdAt
      updatedAt
    }
  }
`;
export const deleteTrack = /* GraphQL */ `
  mutation DeleteTrack(
    $input: DeleteTrackInput!
    $condition: ModelTrackConditionInput
  ) {
    deleteTrack(input: $input, condition: $condition) {
      id
      spotifyId
      date
      createdAt
      updatedAt
    }
  }
`;
export const createMusic = /* GraphQL */ `
  mutation CreateMusic(
    $input: CreateMusicInput!
    $condition: ModelMusicConditionInput
  ) {
    createMusic(input: $input, condition: $condition) {
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
export const updateMusic = /* GraphQL */ `
  mutation UpdateMusic(
    $input: UpdateMusicInput!
    $condition: ModelMusicConditionInput
  ) {
    updateMusic(input: $input, condition: $condition) {
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
export const deleteMusic = /* GraphQL */ `
  mutation DeleteMusic(
    $input: DeleteMusicInput!
    $condition: ModelMusicConditionInput
  ) {
    deleteMusic(input: $input, condition: $condition) {
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
export const createAuth = /* GraphQL */ `
  mutation CreateAuth(
    $input: CreateAuthInput!
    $condition: ModelAuthConditionInput
  ) {
    createAuth(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      accessToken
      refreshToken
      expiry
    }
  }
`;
export const updateAuth = /* GraphQL */ `
  mutation UpdateAuth(
    $input: UpdateAuthInput!
    $condition: ModelAuthConditionInput
  ) {
    updateAuth(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      accessToken
      refreshToken
      expiry
    }
  }
`;
export const deleteAuth = /* GraphQL */ `
  mutation DeleteAuth(
    $input: DeleteAuthInput!
    $condition: ModelAuthConditionInput
  ) {
    deleteAuth(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      accessToken
      refreshToken
      expiry
    }
  }
`;
