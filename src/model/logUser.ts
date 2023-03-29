import { Document, Schema, model } from "mongoose";

export interface ILogUser extends Document {
    username: string,
    password: string
}

const logUserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

export default model<ILogUser>('LogUser', logUserSchema)