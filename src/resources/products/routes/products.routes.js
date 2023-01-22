import { Router } from 'express'
import { verifyToken } from '../../auth/middlewares/auth.middlewares.js'
import { createProduct, deleteProductById, getProductById, getProducts, updateProductById } from '../controllers/products.controller.js'

// Definimos la instancia de nuestro express router
const productsRouter = Router()

// Se define la base de la URI para exponer el servicio
const baseURI = '/products'
/* 
  Se configura según el estandar REST los verbos HTTP 
  a vincular para realizar las operaciones CRUD. 
  Los handlers de cada verbo HTTP se deben construir en el controller
  y luego agregarlos aca.

  VERBO HTTP              CRUD          Controller handler
     POST      --------> CREATE --------> createProduct
     GET       --------> READ   --------> getProducts / getProductById
     PUT/PATCH --------> UPDATE --------> updateProductById
     DELETE    --------> DELETE --------> deleteProductById
*/
productsRouter.post( baseURI, createProduct )
productsRouter.get( baseURI, getProducts )
productsRouter.get( `${ baseURI }/:id`, getProductById )
productsRouter.put( `${ baseURI }/:id`, updateProductById )
productsRouter.delete( `${ baseURI }/:id`, deleteProductById )


export default productsRouter