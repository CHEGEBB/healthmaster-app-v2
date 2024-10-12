import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const Config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.health-master.healthmaster",
  projectId: "6704d37c003c8a2f6a36",
  databaseId: "670a2468000caae299eb",
  userCollectionId: "670a248800049761218e",
  appoinmentsCollectionId: "670a254100339e546aa4",
  medicationCollectionId: "670a256a00336a73c6d3",
  remindersCollectionId: "670a259c000d92ef0f0a",
  storageId: "670a2a300017fdaee701"
};

const client = new Client();
client
  .setEndpoint(Config.endpoint)
  .setProject(Config.projectId)
  .setPlatform(Config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(username);

    const newUser = await databases.createDocument(
      Config.databaseId,
      Config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
};

export async function signIn(email, password) {
  try {
    // Attempt to sign out first
    try {
      await signOut();
    } catch (signOutError) {
      // If sign out fails due to no active session, that's fine, continue with sign in
      console.log("Sign out before sign in failed:", signOutError);
    }

    // Now attempt to create a new session
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function getAccount() {
  try {
    return await account.get();
  } catch (error) {
    if (error.code === 401 || error.code === 403) {
      console.log("No active session or insufficient permissions");
      return null;
    }
    console.error("Get account error:", error);
    throw error;
  }
}

export const getCurrentUser = async () => {
  try {
    const accountDetails = await account.get();
    if (!accountDetails) {
      console.log("No active session");
      return null;
    }

    const users = await databases.listDocuments(
      Config.databaseId,
      Config.userCollectionId,
      [Query.equal("accountId", accountDetails.$id)]
    );
    
    if (users.documents.length > 0) {
      return users.documents[0];
    }
    return null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

export async function signOut() {
  try {
    await account.deleteSession('current');
  } catch (error) {
    if (error.code === 401 || error.code === 403) {
      console.log("No active session to sign out from");
    } else {
      console.error("Sign out error:", error);
      throw error;
    }
  }
}

export const uploadImage = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const fileName = `image_${Date.now()}.jpg`;
    
    const file = await storage.createFile(
      Config.storageId,
      ID.unique(),
      blob,
      fileName
    );

    const fileUrl = storage.getFileView(Config.storageId, file.$id);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export {storage};