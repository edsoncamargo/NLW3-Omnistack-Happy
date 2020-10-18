
import { Router } from 'express';
import OrphanagesController from './controllers/OrphanagesController';
import multer from 'multer';
import uploadConfig from './config/upload'

const routes = Router();
const BASE_URL_PATH = '/api/v1/orphanages';
const upload = multer(uploadConfig);

routes.post(BASE_URL_PATH, upload.array('images'), OrphanagesController.create);
routes.get(BASE_URL_PATH, OrphanagesController.index);
routes.get(`${BASE_URL_PATH}/:id`, OrphanagesController.show);

export default routes;