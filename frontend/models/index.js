// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Track, Artist } = initSchema(schema);

export {
  Track,
  Artist
};