import { db } from '@/database';
import { User } from '@/models';
import bcrypt from 'bcryptjs';


export const checkUserEmailPassword = async (email: string, password: string) => {
    await db.connect()

    const user = await User.findOne({ email })
    
    await db.disconnect()

    if (!user) return null
    
    if (!bcrypt.compareSync(password, user.password!)) return null 
    
    const { role, name, _id } = user
    
    return {
        _id,
        email: email.toLowerCase(),
        role,
        name
    }
}

export const oAuthToDBUser = async (oAEmail: string, oAname: string) => {
    console.log(oAEmail, oAname, 'desde el backend')
    
    await db.connect()

    const user = await User.findOne({ email: oAEmail })

    if (user) {
        await db.disconnect()
        const { _id, name, email, role } = user
        return { _id, name, email, role }
    }

    const newUser = new User({ email: oAEmail, name: oAname, password: '@', role: 'client' })
    
    await newUser.save()
    await db.disconnect()

    const {  _id, name, email, role, } = newUser
    
    return { _id, name, email, role, }
}