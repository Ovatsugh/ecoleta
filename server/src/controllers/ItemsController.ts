import knex from '../database/conn'
import { Request, Response } from 'express'

export class ItemsController {
    static async getItems(req: Request, res: Response) {
        const items = await knex('items').select('*')
        const serializedItems = items.map(item => {
           return { id: item.id, title: item.title, image_url: `http://192.168.0.102:5000/uploads/${item.image}` }
        })
        res.json(serializedItems)
    }
}