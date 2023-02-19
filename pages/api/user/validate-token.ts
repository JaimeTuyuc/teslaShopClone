
import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import { IUser } from '@/interfaces'
import { User } from '@/models'
import bcrypt from 'bcryptjs'
import { JWT } from '@/utils'

type Data =
    | { message: string }
    | { token: string}
    | IUser
    | {
        token: string
        user: {
            email: string,
            name: string,
            role: string
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    

    switch (req.method) {
        case 'GET':
            return validateJwtToken(req, res)
    
        default:
            return res.status(400).json({ message: 'Invalid endpoint called'})
    }
}

const validateJwtToken = async (req: NextApiRequest, res: NextApiResponse) => {
    
    const { token = '' } = req.cookies

    let userId = ''

    try {
        userId = await JWT.isValidToken(token.toString())
    } catch (error) {
        return res.status(401).json({ message: 'Invalid JWT '})
    }

    await db.connect()

    const user = await User.findById(userId).lean()

    await db.disconnect()
    
    if (!user) {
        return res.status(400).json({ message: 'No user found'})
    }

    const { _id, email, role, name } = user

    return res.status(200).json({
        token: JWT.signToken(_id, email),
        user: {
            email, role, name
        }
    })

}