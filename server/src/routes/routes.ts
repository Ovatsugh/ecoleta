import express from 'express'
import { ItemsController } from '../controllers/ItemsController'
import { PointsController } from '../controllers/PointsController'
import multer from 'multer'
import multerConfig from '../config/multer'
import { celebrate, Joi } from 'celebrate'


const routes = express.Router()
const upload = multer(multerConfig)
routes.get('/items', ItemsController.getItems)
routes.get('/points', PointsController.getPoints)
routes.post('/points', upload.single('image'), celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required()
    })
}, {
    abortEarly: false
}) , PointsController.createPoint)
routes.get('/points/:id', PointsController.showItem)




export default routes