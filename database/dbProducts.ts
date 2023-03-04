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

    // TODO logic for updating images
    product.images = product.images.map((image) => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
    })

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

    const updatedProducts = products.map((product) => {

        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })



    return JSON.parse(JSON.stringify(updatedProducts))
}

export const getAllProductsDefault = async (): Promise<IProduct[]> => {

    await db.connect()
    const products = await Product.find().lean()
    await db.disconnect()

    const updatedProducts = products.map((product) => {

        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })

    return JSON.parse(JSON.stringify(updatedProducts))
}