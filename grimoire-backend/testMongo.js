const { MongoClient, ServerApiVersion } = require('mongodb');

// Mets bien l'URI avec ton identifiant et ton mot de passe
const uri = "mongodb+srv://Amir:Grimoire%40123@cluster0.tr777gw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connexion réussie à MongoDB Atlas !");
  } catch (error) {
    console.error("❌ Échec de connexion :", error);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
