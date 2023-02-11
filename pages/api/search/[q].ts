
import { db } from '@/database'
import { Product } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces/products';

type Data =
    | { message: string }
    | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProductsByQuery(req, res)
        
        default:
            return res.status(400).json({ message: 'Invalid request method' })
    }
}

const getProductsByQuery = async (req: NextApiRequest, res: NextApiResponse) => {
    
    let { q = '' } = req.query
    if (q.length === 0) {
        return res.status(400).json({ message: 'Enter a value to search'})
    }

    q = q.toString().toLowerCase()

    await db.connect()

    const products = await Product.find({ $text: { $search: q } }).select('title images price inStock -_id').lean()

    if (!products) {
        return res.status(200).json({ message: 'No products found with that query'})
    }

    await db.disconnect()

    return res.status(200).json(products)
}