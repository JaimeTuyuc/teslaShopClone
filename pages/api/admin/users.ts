

import { IUser } from '@/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/database';
import { User } from '@/models';
import { isValidObjectId } from 'mongoose';

type Data =
    | { message: string }
    | IUser[]
    | IUser

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'GET':
            
            return getUsers(req, res)
        
        case 'PUT':
            return updateUser(req, res)
        default:
            return res.status(400).json({ message: 'Invalid endpoint called' })
    }
    
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
    
    await db.connect()

    const users = await User.find().select('-password').lean()

    await db.disconnect()

    if (!users) {
        return res.status(200).json({ message: 'No users on DB yet'})
    }

    return res.status(200).json(users)
}

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {

    const { userId = '', role = '' } = req.body

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'No users found with the giving ID' })
    }

    const validRoles = ['admin', 'super-user', 'SEO', 'client']

    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role selection' })
    }

    await db.connect()

    const userToUpdate = await User.findById(userId)

    if (!userToUpdate) {
        return res.status(404).json({ message: 'No users found' })
    }

    userToUpdate.role = role
    await userToUpdate.save()

    await db.disconnect()

    return res.status(200).json({ message: 'Role updated '})
}