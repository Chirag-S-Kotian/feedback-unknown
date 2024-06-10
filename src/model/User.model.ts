import mongoose,{ Schema,Document } from "mongoose";

export interface Message extends Document{
    content: String;
    createdAt: Date
}

const MessageSchema:Schema<Message> = new Schema({
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});