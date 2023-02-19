import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import { IUser } from '@/interfaces'
import { User } from '@/models'
import bcrypt from 'bcryptjs'
import { JWT } from '@/utils'

type Data =
    | { message: string }
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
        case 'POST':
            return logginUserHandler(req, res)
    
        default:
            return res.status(400).json({ message: 'Invalid endpoint called'})
    }
}

const logginUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    
    const { email = '', password = '' } = req.body

    await db.connect()

    const user = await User.findOne({ email })
    await db.disconnect()

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials, please try again'})
    }

    if (!bcrypt.compareSync(password, user.password!)) {
        return res.status(400).json({ message: 'Invalid credentials, please try again'})
    }

    const { role, name, _id } = user

    const token = JWT.signToken(_id, email)

    return res.status(200).json({
        token: token,
        user: {
            email, role, name
        }
    })
}