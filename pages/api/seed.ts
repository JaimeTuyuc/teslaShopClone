

import { db, seedDatabase } from '@/database'
import { Product, User } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({ message: 'Invalid enviroment, check the ENV type'})
    }

    // Conectar a DB
    await db.connect()
    // Eliminar cualquier registro previo
    await Product.deleteMany()

    // Delete any previous users
    await User.deleteMany()

    // Insert seed users
    await User.insertMany(seedDatabase.initialData.users)

    // Insertar Datos en DB
    await Product.insertMany(seedDatabase.initialData.products)
    // Desconectar DB
    await db.disconnect()

    res.status(200).json({ message: 'Operation completed succesfully' })
}