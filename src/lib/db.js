import Datastore from '@seald-io/nedb';

export const users = new Datastore({ filename: './data/users.db', autoload: true });
