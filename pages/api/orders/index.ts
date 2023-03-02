
import { db } from '@/database';
import { Order, Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { IOrder } from '../../../interfaces/order';

type Data =
    | { message: string }
    | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return createOrder(req, res)
    
        default:
            return res.status(400).json({ message: 'Invalid endpoint called' })
    }

}


const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {

    const { orderItems, total } = req.body as IOrder
    // console.log(total, 'lo que llega desde el front*-*-*-')
    const session: any = await getSession({ req })
    // console.log(session.user, '**-*-*-*-*-*-')

    if (!session) {
        return res.status(401).json({ message: 'Must be authenticated to make orders'})
    }

    // Get list of ID's on the order
    const productsIds = orderItems.map((product) => product._id)
    
    await db.connect()

    const dbProducts = await Product.find({ _id: { $in: productsIds } })
    
    try {
        const subTotal = orderItems.reduce((pre, current) => {

            const currentPrice = dbProducts.find((prod) => prod.id === current._id)?.price
            
            if (!currentPrice) {
                throw new Error('Please check your cart')
            }

            
            return (currentPrice * current.quantity) + pre
        }, 0)

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0
        const backendTotal = subTotal * (taxRate + 1)
        
        if (total !== backendTotal) {
            throw new Error('Please check the total from client side')
        }

        // All validations are passing here
        const userId = session.user._id
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId })
        newOrder.total = Math.round(newOrder.total * 100) / 100
        await newOrder.save()
        await db.disconnect()
        return res.status(201).json(newOrder)

    } catch (error:any) {
        await db.disconnect()
        console.log(error, 'unable to save your order')
        res.status(400).json({ message: error.message || 'Check backend logs'})
    }
    
    // return res.status(201).json({ message: 'Order created correctly' })
} 