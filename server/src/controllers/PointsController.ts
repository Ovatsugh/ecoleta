import knex from '../database/conn'
import { Request, Response } from 'express'


export class PointsController {
    static async createPoint(req: Request, res: Response) {
        const { name, email, latitude, longitude, city, uf, items } = req.body;
        const whatsapp = req.body.whatsapp

        const trx = await knex.transaction()
        const point = {
            image: req.file?.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }

        const pointId = await trx('points').insert(point)
        const point_id = pointId[0]

        const data = items.split(',').map((item: string) => Number(item.trim())).map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        })


        await trx('point_items').insert(data)

        await trx.commit();


        return res.json({ id: point_id, ...point })

    }

    static async showItem(req: Request, res: Response) {

        const id = req.params.id
        const point = await knex('points').where('id', id).first();

        if (!point) {
            return res.status(400).json({ message: "Ponto não encontrado" })
        }

        const serializedPoints =  {
              ...point, image_url: `http://192.168.0.102:5000/uploads/${point.image}` 
         }

        const items = await knex('items').join('point_items', 'items.id', '=', 'point_items.item_id').where('point_items.point_id', id).select('items.title')

        return res.json({ point: serializedPoints, items })

    }

    static async getPoints(req: Request, res: Response) {

        const { city, uf, items } = req.query

        const parsedItems = String(items).split(',').map(item => {
            return Number(item.trim())
        })


        const points = await knex("points")
        .join("point_items", "points.id", "=", "point_items.point_id")
        .whereIn("point_items.item_id", parsedItems)
        .where("city", String(city))
        .where("uf", String(uf))
        .distinct()
        .select("points.*");

        const serializedPoints = points.map(point => {
            return { ...point, image_url: `http://192.168.0.102:5000/uploads/${point.image}` }
         })

        return res.json(serializedPoints)

    }
}