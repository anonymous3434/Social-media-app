import { Client, Databases, Storage, Account, Avatars } from "appwrite";

export const client = new Client();
export const appwriteconfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  endpointurl: import.meta.env.VITE_APPWRITE_ENDPOINT,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
};
client
  .setEndpoint(appwriteconfig.endpointurl)
  .setProject(appwriteconfig.projectId);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatar = new Avatars(client);
