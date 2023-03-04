import { IProduct } from "@/interfaces"
import mongoose, { Schema, Model, model } from "mongoose"


const productSchema = new Schema({
    description: { type: String, required: true, default: ''},
    images: [{ type: String }],
    inStock: { type: Number, requred: true },
    price: { type: Number, requred: true, default: 0 },
    sizes: [{
        type: String,
        enum: {
            values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            message: 'Invalid size type'
        },
        required: true,
    }],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, required: true, default: '' },
    type: [{
        type: String,
        enum: {
            values: ['shirts', 'pants', 'hoodies', 'hats'],
            message: 'Enter a valid type'
        },
        default: 'shirts'
    }],
    gender: [{
        type: String,
        enum: {
            values: ['men', 'women', 'kid', 'unisex'],
            message: 'Invalid gender type'
        },
        default: 'women'
    }]
}, {
    timestamps: true
})

// TODOL CREAR UN INDICE
productSchema.index({ title: 'text', tags: 'text' })

const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema)

export default Product