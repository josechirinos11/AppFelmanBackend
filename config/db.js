import mongoose from "mongoose";

const conectarDB = async () => {
  try {

    
      // Configurar strictQuery a true o false según prefieras
      mongoose.set('strictQuery', true); // O false, dependiendo de tu preferencia
  
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1);
  }
};

export default conectarDB;
