import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type TrackMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ArtistMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Track {
  readonly id: string;
  readonly name: string;
  readonly artistID: string;
  readonly albumName: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Track, TrackMetaData>);
  static copyOf(source: Track, mutator: (draft: MutableModel<Track, TrackMetaData>) => MutableModel<Track, TrackMetaData> | void): Track;
}

export declare class Artist {
  readonly id: string;
  readonly name: string;
  readonly Tracks?: (Track | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Artist, ArtistMetaData>);
  static copyOf(source: Artist, mutator: (draft: MutableModel<Artist, ArtistMetaData>) => MutableModel<Artist, ArtistMetaData> | void): Artist;
}