import { db } from '@/database';
import { Product } from '@/models';
import { IProduct } from '../interfaces';


export const getProductBySlug = async (slug:string): Promise<IProduct | null> => {
    await db.connect()
    const product = await Product.findOne({ slug }).lean()
    await db.disconnect()

    if (!product) {
        return null
    }

    return JSON.parse(JSON.stringify(product))
}

interface ProductSlugs {
    slug: string
}

export const getAllproductSlugs = async (): Promise<ProductSlugs[]> => {

    await db.connect()
    const slugs = await Product.find().select('slug -_id').lean()
    await db.disconnect()

    return slugs
}

export const getAllProductByQuery = async (query: string): Promise<IProduct[]> => {

    query = query.toString().toLowerCase()

    await db.connect()

    const products = await Product.find({
        $text: { $search: query }
    }).select('title images price isStock slug -_id').lean()

    await db.disconnect()

    return JSON.parse(JSON.stringify(products))
}

export const getAllProductsDefault = async (): Promise<IProduct[]> => {

    await db.connect()
    const products = await Product.find().lean()
    await db.disconnect()

    return JSON.parse(JSON.stringify(products))
}