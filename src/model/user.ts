import { model, Schema, Document } from "mongoose"

export interface IUser extends Document{
    firstname:string,
    lastname:string,
    email:string,
    password:string
}

const userSchema = new Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})

export default model<IUser>('User', userSchema)