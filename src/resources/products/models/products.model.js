import mongoose from 'mongoose'

/* 
Se define el esquema de mongoose, esta corresponde a la estructura de lo que sería un producto
El id es generado automáticamente
*/
const productSchema = new mongoose.Schema( {
  marca:{
    type: String,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    maxLength: 300,
    minLength: 2
  },
  precio: {
    type: String,
    required: false,
    maxLength: 100,
    minLength: 2
  },
  
  imagenes:[{
    type: String,
  }],

  tipo:{
    type: String,
    enum: ["llantas", "neumáticos", "lonas" ]
  },
  modelo: {
    type: String,
    required: false,
    maxLength: 100,
  }
} )

// Se crea la instancia del modelo.
export const ProductModel = new mongoose.model( 'Product', productSchema )