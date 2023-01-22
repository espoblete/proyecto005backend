import joi from 'joi'

const createProductSchemaValidator = joi.object( {
  name: joi.string().max( 100 ).required(),
  description: joi.string().max( 300 ),
  precio: joi.string().required(),
  imagenes: joi.array().required(),
  tipo: joi.string().required(),
  marca: joi.string().max( 100 ),
  modelo: joi.string().max( 100 )


} )

const validateCreateProductBody = async ( body ) => {
  return createProductSchemaValidator.validateAsync( body, { abortEarly: false } )
}

export default validateCreateProductBody