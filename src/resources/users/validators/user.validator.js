import joi from 'joi'

const createUserSchemaValidator = joi.object( {
  name: joi.string().required(),
  surname: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required()
} )

const validateCreateUserBody = async ( body ) => {
  return createUserSchemaValidator.validateAsync( body, { abortEarly: false } )
}

export default validateCreateUserBody