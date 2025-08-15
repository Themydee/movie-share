import mongoose, { Schema } from 'mongoose'
import { User } from '../types'

const userSchema = new Schema<User>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    
})

export default mongoose.model<User>('User', userSchema)