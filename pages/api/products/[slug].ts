

import { db } from '@/database'
import { Product } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces/products';

type Data =
    | { message: string }
    | { product: IProduct}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res)
        default:
            return res.status(400).json({ message: 'Invalid endpoint called'})
    }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse) => {
    const { slug } = req.query
    console.log(slug, 'slug')

    await db.connect()
    const productFound = await Product.findOne({slug}).lean()
    await db.disconnect()

    if (!productFound) {
        res.status(404).json({ message: 'No producto found with that slug'})
    }

    return res.status(200).json(productFound)
}