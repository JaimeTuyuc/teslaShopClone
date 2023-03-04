
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/database';
import { Product } from '@/models';
import { IProduct } from '@/interfaces';
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config( process.env.CLOUDINARY_URL || '')

type Data =
    | { message: string }
    | IProduct[]
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getAllProducts(req, res)
        
        case 'PUT':
            return updateProduct(req, res)
        case 'POST':
            return createProduct(req, res)
        default:
            return res.status(400).json({ message: 'Invalid endpoint called' })
    }
}

// CREATE NEW PRODUCT
const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {

    const { images = [] } = req.body as IProduct

    if (images.length < 2) {
        return res.status(400).json({ message: 'Product needs at least 2 images'})
    }

    try {
        await db.connect()
        const productInDb = await Product.findOne({ slug: req.body.slug })
        // console.log(productInDb?.slug, 'aca deberia conicidir', req.body.slug)
        if (productInDb) {
            await db.disconnect()
            return res.status(400).json({ message: 'There is already a product with that slug'})
        }
        const product = new Product(req.body)
        await product.save()
        await db.disconnect()

        return res.status(201).json(product)
    } catch (error) {
        await db.disconnect()
        console.log(error, 'Check logs, unable to create a new product')
        return res.status(400).json({ message: 'Unable to create the new product'})
    }
}

// Update Product
const updateProduct = async (req:NextApiRequest, res:NextApiResponse) => {

    const { _id = '', images = [] } = req.body as IProduct

    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'Invalid Id provided'})
    }

    if (images.length < 2) {
        return res.status(400).json({ message: 'You need to provide at least 2 images'})
    }

    // TODO: have a valid url image 

    try {
        await db.connect()
        const product = await Product.findById(_id)

        if (!product) {
            return res.status(400).json({ message: 'You need to provide at least 2 images'})
        }

        // TODO: Delete images from cloudinary
        product.images.forEach(async (image) => {
            if (!images.includes(image)) {
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.')
                await cloudinary.uploader.destroy( fileId )
            }
        })

        await product.update(req.body)
        await db.disconnect()

        return res.status(200).json(product)

    } catch (error) {
        console.log(error, 'unable to update you product')
        await db.disconnect()
        return res.status(400).json({ message: 'You need to provide at least 2 images'})
    }

}

const getAllProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    
    await db.connect()

    const products = await Product.find().sort({ title: 'asc' })

    await db.disconnect()

    // TODO: update images

    const updatedProducts = products.map((product) => {

        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })

    return res.status(200).json(updatedProducts)
}