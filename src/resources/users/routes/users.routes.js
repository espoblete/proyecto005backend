import { Router } from 'express'
import { verifyToken } from '../../auth/middlewares/auth.middlewares.js'
import { getProfile } from '../controllers/users.controllers.js'

const usersRouter = Router()

const baseURI = '/users'

//se valida token y si es valido agrega en req data de usuario y 
//finalmente getprofile extrae esa data y la devuelve.

//ruta protegida por la validacion del token
usersRouter.get( `${ baseURI }/profile`, verifyToken, getProfile )


//sacamos verifiToken para probar la pagina sin el error del token
//usersRouter.get( `${ baseURI }/profile`, getProfile )

export default usersRouter