import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import { Request, Response } from 'express';
import Image from '../models/Image';
import orphanageView from '../views/OrphanageView';
import * as Yup from 'yup';

export default {
    async show(req: Request, res: Response) {

        const orphanagesRepository = getRepository(Orphanage);
        const orphanage = await orphanagesRepository.findOneOrFail(req.params.id, {
            relations: ['images']
        })
        return res.status(200).json(orphanageView.render(orphanage));
    },
    async index(req: Request, res: Response) {

        const orphanagesRepository = getRepository(Orphanage);
        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });
        return res.status(200).json(orphanageView.renderAll(orphanages));
    },
    async create(req: Request, res: Response) {

        const images: Image[] = getImages(req);
        const orphanagesRepository = getRepository(Orphanage);
        const { openOnWeekends } = req.body;
        const orphanage: Orphanage = req.body;
        orphanage.openOnWeekends = Boolean(openOnWeekends);
        orphanage.images = images;
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            instructions: Yup.string().required().max(300),
            openingHours: Yup.string().required(),
            openOnWeekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            }))
        });
        await schema.validate(orphanage, {
            abortEarly: false
        });
        const entity = orphanagesRepository.create(orphanage);
        await orphanagesRepository.save(entity);
        return res.status(201).json(entity);
    }
}

function getImages(req: Request) {

    const requestImages = req.files as Express.Multer.File[];
    return requestImages.map(image => {
        let i: Image = new Image();
        i.path = image.filename;
        return i;
    });
}
