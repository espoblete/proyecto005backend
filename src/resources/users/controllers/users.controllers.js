import { UserModel } from '../models/user.model.js'

// crea por metodo de moongoose con lo que se le pasa por el body
export const createUser = async ( body ) => {
  const newProduct = await UserModel.create( body )
  return newProduct
}

export const findUserByEmail = async ( email ) => {
  const userFound = await UserModel.findOne( { email: email } )
  return userFound
}

//devuelve como respuesta la info que tiene almacenado el token, por el middleware de carpeta auth
export const getProfile = async ( req, res ) => {
  const user = req.user
  return res.json( user )
}