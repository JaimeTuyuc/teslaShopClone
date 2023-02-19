import { IUser } from "@/interfaces/users"
import mongoose, { Schema, model, Model } from "mongoose"


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'client'],
        message: '{VALUE} Is not a valid type of customer',
        default: 'client',
        required: true
    }
}, {
    timestamps: true
})

const User: Model<IUser> = mongoose.models.User || model('User', userSchema)

export default User