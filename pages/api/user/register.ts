import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import { IUser } from '@/interfaces'
import { User } from '@/models'
import bcrypt from 'bcryptjs'
import { JWT, validation } from '@/utils'

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
            return regisetUserHandler(req, res)
    
        default:
            return res.status(400).json({ message: 'Invalid endpoint called'})
    }
}

const regisetUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    
    const { name = '', email = '', password = '' } = req.body as {name: string, email: string, password: string }
    console.log(email, 'desde el backend')
    if (!validation.isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email entered'})
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password needs to be 6 characters length'})
    }
    
    if (name.length < 3) {
        return res.status(400).json({ message: 'Invalid name, please enter a different name'})
    }
    
    await db.connect()
    const user = await User.findOne({ email })
    
    if (user) {
        await db.disconnect()
        return res.status(400).json({ message: 'Choose a different email'})
    }

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name
    })

    try {
        await newUser.save({ validateBeforeSave: true })
    } catch (error) {
        console.log(error, 'error*-*-*-*')
        return res.status(500).json({ message: 'Unable to save the user'})
    }

    const { _id } = newUser

    const token = JWT.signToken(_id, email)

    return res.status(200).json({
        token: token,
        user: {
            email, role: 'client', name
        }
    })
}