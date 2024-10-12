import { Client, Account, ID , Avatars, Databases} from 'react-native-appwrite';



export const Config ={
    endpoint :"https://cloud.appwrite.io/v1",
    platform : "com.health-master.healthmaster",
    projectId : "6704d37c003c8a2f6a36",
    databaseId : "670a2468000caae299eb",
    userCollectionId : "670a248800049761218e",
    appoinmentsCollectionId: "670a254100339e546aa4",
    medicationCollectionId: "670a256a00336a73c6d3",
    remindersCollectionId : "670a259c000d92ef0f0a",
    storageId : "670a2a300017fdaee701"
}
const client = new Client();

client
    .setEndpoint(Config.endpoint) 
    .setProject(Config.projectId)
    .setPlatform(Config.platform) 
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) =>{
    try {
      const newAccount =  await account.create(
        ID.unique(),
        email,
        password,
        username
      )
      if(!newAccount) throw  Error;

      const avatarUrl = avatars.getInitials(username);

      await signIn(email , password);

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
      )

        return newUser;
        
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}

export async function signIn(email, password){
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
        
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}