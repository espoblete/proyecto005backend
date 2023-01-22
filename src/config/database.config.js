import mongoose from 'mongoose';
import environment from './environment.js';

mongoose.set( 'strictQuery', false );

// Obtenemos la URI de la base de datos MONGODB de las variables de entorno.
const mongoDbURI = environment.DB_URI

// Definimos un método para la conexión a la base de datos
export const startConnection = () => {
  mongoose.connect( mongoDbURI ).then( () => console.log( 'Conexión correcta' ) ).catch( error => console.error( error ) )
}

// Definimos y exportamos el objeto de la conexión
const db = mongoose.connection
export default db