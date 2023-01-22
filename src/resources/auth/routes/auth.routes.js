import { Router } from 'express'
import { login, signup } from '../controllers/auth.controller.js'

// Definimos la instancia de nuestro express router
const authRouter = Router()

// Se define la base de la URI para exponer el servicio
const baseURI = '/auth'

// Se generan los recursos a exponer (login y signup)
authRouter.post( `${ baseURI }/login`, login )
authRouter.post( `${ baseURI }/signup`, signup )
export default authRouter