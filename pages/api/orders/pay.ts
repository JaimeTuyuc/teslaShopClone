import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { IPaypal } from '@/interfaces';
import { db } from '@/database';
import { Order } from '@/models';

type Data =
    | { message: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'POST':
            return payOrder(req, res)
        default:
            return res.status(400).json({ message: 'Invalid endpoint called' })
    }
}

const getPaypalBearerToken = async (): Promise<string|null> => {

    const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET

    const base64Token = Buffer.from(`${CLIENT_ID}:${PAYPAL_SECRET}`, 'utf-8').toString('base64')
    const body = new URLSearchParams('grant_type=client_credentials')
    
    try {
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        
        return data.access_token
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data)
        } else {
            console.log(error, 'unable to complete your reques')
        }
        
        return null
    }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse) => {

    const paypalBearerToken = await getPaypalBearerToken()

    if (!paypalBearerToken) {
        return res.status(400).json({ message: 'Unable to generate the token' })
    }

    const { transactionId = '', orderId = '' } = req.body


    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`
        }
    })

    if (data.status !== 'COMPLETED') {
        return res.status(401).json({ message: 'Order is not recognize by paypal'})
    }

    await db.connect()

    const orderDB = await Order.findById( orderId )
    
    if (!orderDB) {
        await db.disconnect()
        return res.status(401).json({ message: 'Order does not seem to be in our DB'})
    }

    if (orderDB.total !== Number(data.purchase_units[0].amount.value)) {
        await db.disconnect()
        return res.status(401).json({ message: 'Amounts are not the same from paypal and your order'})
    }

    orderDB.transactionId = transactionId
    orderDB.isPaid = true
    await orderDB.save()
    await db.disconnect()

    return res.status(200).json({ message: 'Your order has being successfully proccesed' })
}