import { ProductModel } from '../models/products.model.js'
import validateCreateProductBody from '../validators/products.validator.js'


export const createProduct = async ( req, res ) => {
  const body = req.body
  try {
    const value = await validateCreateProductBody( body )
    const newProduct = await ProductModel.create( value )
    return res.json( newProduct )
  } catch ( error ) {
    const errorResponse = {
      status: 'FAILED',
      details: error.message
    }
    return res.status( 400 ).json( errorResponse )
  }
}

export const getProducts = async ( req, res ) => {
  const filter = req.query
  if (filter?.tipo){
    const products = await ProductModel.find({tipo: filter.tipo})
    return res.json( products )
  }
  const userLogged = req.user
  console.log( `🚀 ~ userLogged`, userLogged );
  const products = await ProductModel.find()
  return res.json( products )
}

export const getProductById = async ( req, res ) => {
  const id = req.params.id
  const product = await ProductModel.findById( id )
  return res.json( product )
}

export const updateProductById = async ( req, res ) => {
  const body = req.body
  const id = req.params.id
  const productUpdated = await ProductModel.findByIdAndUpdate( id, body, { new: true } )
  return res.json( productUpdated )
}

export const deleteProductById = async ( req, res ) => {
  const id = req.params.id
  const productRemoved = await ProductModel.findByIdAndDelete( id )
  return res.json( productRemoved )
}