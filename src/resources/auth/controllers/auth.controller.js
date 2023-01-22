//export const login = ( req, res ) => {
//  const { username, password } = req.body

 // // Validamos el body
 // if ( !username || !password ) {
 //   res.status( 400 ).json( {
 //     status: 'FAILED',
 //     error: 'El usuario o contraseña no pueden ser vacíos'
 //   } )
 // } else {

 //   // Buscamos el usuario en la DB y verificamos si la contraseña es válida

    // Generamos el token
    




import { awaitCatcher } from 'await-catcher'
import jwt from 'jsonwebtoken'
import environment from '../../../config/environment.js'
import { createUser, findUserByEmail } from '../../users/controllers/users.controllers.js'
//import { createUser, findUserByEmail } from '../../users/controllers/users.controllers.js'
import validateCreateUserBody from '../../users/validators/user.validator.js'
const { TOKEN_SECRET } = environment


//para el login, se extrae correo y pass del body
//y se usa await-catcher con el metodo a utilizar(en este caso: findUserByEmail)
export const login = async ( req, res ) => {
  const { email, password } = req.body
  // Buscamos el usuario en la DB y verificamos si la contraseña es válida
  const [ userFound, userFoundError ] = await awaitCatcher( findUserByEmail ( email ) )
  if ( !userFound || userFoundError ) {
    return res.status( 404 ).json( { status: 'ERROR', details: 'user not found' } )
  }
  //si encuentra usuario (email) valida la pass escrita contra la de la db y retorna booleano: valida o invalida
  const [ passwordValid, passwordValidError ] = await awaitCatcher( userFound.validatePassword( password ) )
  if ( !passwordValid || passwordValidError ) {
    return res.status( 404 ).json( { status: 'ERROR', details: 'user not found' } )
  }



  
  // si pasa correctamente, Generamos el token con el payload (info que pasa al token)
  const payload = {
    id: userFound._id,
    fullName: `${ userFound.name } ${ userFound.surname }`,
    email: userFound.email
  }
  const token = jwt.sign( payload, TOKEN_SECRET, {
    expiresIn: "1h"
  } )
  //creado, se retorna el token que expira en 1 h
  return res.json( { token } )
}

export const signup = async ( req, res ) => {
  const body = req.body
  // Validamos el body con libreria joi ¿? y errores con await-catcher
  const [ bodyValidated, validateUserError ] = await awaitCatcher( validateCreateUserBody( body ) )
  if ( !bodyValidated || validateUserError ) {
    return res.status( 400 ).json( { status: 'ERROR', details: validateUserError?.message || 'must provide all fields' } )
  }

  // Si la validacion es correcta, Creamos el nuevo usuario
  const [ userCreated, userCreatedError ] = await awaitCatcher( createUser ( bodyValidated ) )
  if ( !userCreated || userCreatedError ) {
    return res.status( 400 ).json( { status: 'ERROR', details: userCreatedError?.message || 'an error occurred when creating the user' } )
  }
  // Generamos el token
  const payload = {
    id: userCreated._id,
    fullName: `${ userCreated.name } ${ userCreated.surname }`,
    email: userCreated.email
  }
  const token = jwt.sign( payload, TOKEN_SECRET, {
    expiresIn: "1h"
  } )
  return res.status( 201 ).json( { token } )


}
