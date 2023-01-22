### ASESORÍA GRUPAL 21: VALIDACIÓN DE DATOS EN BACKEND Y CAPTURA DE ERRORES + REPASO MONGODB/MONGOOSE

Cuando se construyen aplicaciones de lado de servidor o API's, es necesario realizar la validación de los datos que se reciben.  Los principales motivos de realizar esto es por seguridad y mantener integros los datos a guardar.

Para realizar las validaciones existen muchas formas, pero nos centraremos en dos formas complementarias. A continuación se implementará las validaciones desde los controllers de nuestra api por medio de una librería llamada JOI y además se utilizarán las validaciones de mongodb por medio de mongoose.

### 1. VALIDACIONES USANDO JOI

Para implementar las validaciones a nuestra API que hemos ido trabajando durante las asesorías, se deberá realizar la siguiente secuencia de pasos:

- [x] Primero instalar la librería usando el comando `npm i -s joi`

- [x] Luego dentro de `products` crearemos un directorio llamado `validators` y dentro un archivo llamado `products.validator.js`

- [x] Al archivo creado anteriormente, agregar el siguiente código.

```javascript
import joi from 'joi'

const createProductSchemaValidator = joi.object( {
  name: joi.string().max( 100 ).required(),
  description: joi.string().max( 300 ),
  price: joi.number().required(),
  stock: joi.number().integer().required()
} )

const validateCreateProductBody = async ( body ) => {
  return createProductSchemaValidator.validateAsync( body, { abortEarly: false } )
}

export default validateCreateProductBody
```

- [x] Luego actualizaremos el controller para agregar un paso extra para validar la data entrante al momento de crear un producto.

```javascript
import { ProductModel } from '../models/products.model.js'
import validateCreateProductBody from '../validators/products.validators.js'


export const createProduct = async ( req, res ) => {
  const body = req.body
  try{
    const value = await validateCreateProductBody( body )
    const newProduct = await ProductModel.create( value )
    return res.json( newProduct )
  } catch (error) {
    const errorResponse = {
      status: 'FAILED',
      details: error.message
    }
    return res.status( 400 ).json( errorResponse )

  }
}
```

### 2. VALIDACIONES USANDO MONGOOSE

Para complementar las validaciones generadas, actualizaremos el schema de mongoose para agregar validaciones y los campos que faltan. Estas validaciones de ejecutaran antes de insertar o actualizar los documentos en nuestra base de datos mongodb.

- [ ] Modificaremos el archivo `products.models.js` con lo siguiente

```javascript
import mongoose from 'mongoose'

/* 
Se define el esquema de mongoose, esta corresponde a la estructura de lo que sería un producto
El id es generado automáticamente
*/
const productSchema = new mongoose.Schema( {
  name: {
    type: String,
    maxLength: 100,
    required: true,
  },
  description: {
    type: String,
    required: false,
    maxLength: 300,
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  }
} )

// Se crea la instancia del modelo.
export const ProductModel = new mongoose.model( 'Product', productSchema )
```

### 3. CAPTURA DE ERRORES USANDO AWAIT-CATCHER

Es común usar un try catch para capturar posibles errores al realizar operaciones asíncronas, pero el uso en exceso puede conducir al conocido try catch hell.

![Say goodbye Trycatch Hell - DEV Community 👩‍💻👨‍💻](https://res.cloudinary.com/practicaldev/image/fetch/s--3WkKkbUE--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qxq0uis5ffx039it6y8m.png)

Debido a esto es común cambiar el enfoque y una opción es utilizar una librería llamada **await-catcher**. Esta es un wrapper de try catch pero usando una forma más simple de leer. Para implementarlo se debe realizar lo siguiente.

- [ ] Instalar la librería usando `npm i -s await-catcher`

- [ ] Implementar lo siguiente en el controller de products lo siguiente:

```javascript
import { awaitCatcher } from 'await-catcher'
import { ProductModel } from '../models/products.model.js'
import validateCreateProductBody from '../validators/products.validators.js'

export const createProduct = async ( req, res ) => {
  const body = req.body
  const [ bodyValidated, validationError ] = await awaitCatcher( validateCreateProductBody( body ) )
  if ( validationError ) {
    console.log( `🚀 ~ error`, validationError );
    const errorResponse = {
      status: 'FAILED',
      details: validationError.message
    }
    return res.status( 400 ).json( errorResponse )
  }

  const [ newProduct, creationError ] = await awaitCatcher( ProductModel.create( bodyValidated ) )
  if ( creationError ) {
    console.log( `🚀 ~ error`, creationError );
    const errorResponse = {
      status: 'FAILED',
      details: creationError.message
    }
    return res.status( 400 ).json( errorResponse )
  }
  return res.json( newProduct )
}

export const getProducts = async ( req, res ) => {
  const [ products, getProductsError ] = await awaitCatcher( ProductModel.find() )
  if ( getProductsError ) {
    console.log( `🚀 ~ error`, getProductsError );
    const errorResponse = {
      status: 'FAILED',
      details: getProductsError.message
    }
    return res.status( 400 ).json( errorResponse )
  }
  return res.json( products )
}

export const getProductById = async ( req, res ) => {
  const id = req.params.id
  const [ product, getProductError ] = await awaitCatcher( ProductModel.findById( id ) )
  if ( getProductError ) {
    console.log( `🚀 ~ error`, getProductError );
    const errorResponse = {
      status: 'FAILED',
      details: getProductError.message
    }
    return res.status( 400 ).json( errorResponse )
  }
  return res.json( product )
}

export const updateProductById = async ( req, res ) => {
  const body = req.body
  const id = req.params.id
  // TODO: AGREGAR VALIDACIÓN DE BODY USANDO JOI
  const [ productUpdated, updateError ] = await awaitCatcher( ProductModel.findByIdAndUpdate( id, body, { new: true } ) )
  if ( updateError ) {
    console.log( `🚀 ~ error`, updateError );
    const errorResponse = {
      status: 'FAILED',
      details: updateError.message
    }
    return res.status( 400 ).json( errorResponse )
  }
  return res.json( productUpdated )
}

export const deleteProductById = async ( req, res ) => {
  const id = req.params.id
  const [ productRemoved, removeError ] = await awaitCatcher( ProductModel.findByIdAndDelete( id ) )
  if ( removeError ) {
    console.log( `🚀 ~ error`, removeError );
    const errorResponse = {
      status: 'FAILED',
      details: removeError.message
    }
    return res.status( 400 ).json( errorResponse )
  }
  return res.json( productRemoved )
}
```

### 4. REPASO MONGODB/MONGOOSE

## 4.1 ¿Qué es mongodb?

Corresponde a una base de datos NoSQL que permite altas velocidades de lecturas. Es orientado a documentos y utiliza schemas BSON.

## 4.2 ¿Qué son los BSON?

Son los JSON Binarios, es similar a los JSON tradicionales, pero agregan más compatibilidad con otros tipos de datos. Toda data guardada en mongodb se guarda como BSON.

## 4.3 ¿Cómo usar MongoDB?

Para poder usar mongodb se puede instalar y levantar una instancia de forma local o utilizar un servicio de terceros como **mongodb atlas**

![The MongoDB Basics: Databases, Collections & Documents | Studio 3T](https://studio3t.com/wp-content/uploads/2022/04/hierachy.png)



## 4.4 Jerarquía de estructuras (Más grande a menor)

## 4.4.1 Databases

Es el nivel más grande, corresponde al lugar donde se guardará toda la data. Un proyecto puede tener una base de datos o varias. En una base de datos puede haber una o varias **colecciones** (***collections***).



## 4.4.2 Collections

Las colecciones corresponden a la agrupación de datos que hacen referencia a una misma entidad o recurso. Una colección puede tener uno o varios documentos. Suele llamarse en plural como: Productos, Usuarios.



## 4.4.3 Documents

Los documentos corresponden a la agrupación mínima de data y hacen referencia a un concepto o entidad. Estas entidades suelen tener una estructura definida, pero puede ir cambiando en el tiempo. Por ejemplo: Producto, Usuario. 



![What is MongoDB and why use it for modern web applications? | Canonical](https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_720/https://lh5.googleusercontent.com/Q0nYWmsiQHeBcDKD1jlYGc0288hxYWNfqap5lCbjrp84XqTe6fSJ2zDvnW7LDcQrLQtbNSKl_FIDkhDd2vsbshBV97icjB5Uu1GNgNqpMJwP-7Zj_ZVOuV8pXYtUQ4KbCla9V85q)



## 4.5 Equivalencia SQL o Excel  a MONGODB

![SQL Database vs MongoDB Part 2. What are they and how are they… | by  Iftekher Mamun | Medium](https://miro.medium.com/max/702/1*fQbtENxfv757UXuzGQQ3gQ.png)

![Mapping Relational Databases to MongoDB](https://beginnersbook.com/wp-content/uploads/2017/09/Format_mapping_relational_database_to_MongoDB.jpg)



## 4.6 Mongoose

Es una librería construída en javascript que nos permitirá gestionar nuestras base de datos MongoDB de manera más simple. Ofrece muchas opciones y funciones.



<img title="" src="data:image/png;base64,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" alt="Building data model with MongoDB and Mongoose" width="636">



## 4.6.1 Schemas Mongoose

Los schemas en mongoose nos permiten definir la estructura que tendrán los documentos en nuestra base de datos. Además, nos permite agregar validaciones adicionales que se ejecutarán antes de agregar o actualizar la información.



## 4.6.2 Modelos Mongoose

Los modelos definidos en mongoose nos permiten realizar una abstracción de las colecciones, entregándonos métodos y otras herramientas para facilitar la conversación con la base de datos . Cuando construimos un modelo, este hará varias cosas por nosotros automaticamente. Por ejemplo:

1. Si se agrega un nuevo documento a la base de datos y la **colección** definida no se encuentra creada en mongodb, la creará automaticamente a partir del nombre definido en el modelo.

2. Al agregar un nuevo documento, se generará un ID único y se agregará a este.

![User Registration with Mongoose models | by Soufiane Oucherrou | Medium](https://miro.medium.com/max/1400/1*G-yPxYEp-tT1LjkO1RKMbw.png)

## 4.6.3 Métodos importantes

- ***create***: permite generar un nuevo documento y guardarlo en la base de datos.

- ***find***: permite realizar una búsqueda de documentos en base a ciertos criterios.

- ***findById***: permite buscar un documento por medio de su id.

- ***findByIdAndUpdate***: permite buscar un documento por medio de su id y realizar la actualización de los valores.

- ***findByIdAndDelete***: permite buscar un documetos por medio de su id y eliminarlo de la base de datos.
