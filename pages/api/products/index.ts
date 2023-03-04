import { db, SHOP_CONSTANTS } from '@/database'
import { Product } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces/products';

type Data =
    | { message: string }
    | { products: IProduct[] }

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'GET':
            return getProducts(req, res)

        default:
            return res.status(400).json({ message: 'Invalid endpoint called'})
    }
}

const getProducts = async (req:NextApiRequest, res:NextApiResponse) => {

    const { gender = 'all' } = req.query
    let condition = {}
    
    if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
        condition = {gender: gender}
    }

    await db.connect()
    const products = await Product.find(condition)
                                    .select('title images price inStock slug -_id')
                                    .lean()

    if (!products) {
        return res.status(200).json({ message: 'No products found'})
    }

    const updatedProducts = products.map((product) => {

        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })

    res.status(200).json(updatedProducts)
    await db.disconnect()
}