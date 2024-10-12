import { Client, Account, ID , Avatars} from 'react-native-appwrite';



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

export const createUser = async (email, password, username) =>{
    try {
      const newAccount =  await account.create(
        ID.unique(),
        email,
        password,
        username
      )
      if(!newAccount) throw  Error;

      const avatarUrl = avatars.getInitials();
        
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}

