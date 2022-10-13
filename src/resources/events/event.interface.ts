import { Decimal128, Document, ObjectId } from 'mongoose';

export interface Comment extends Document {
    username: string;
    time: number;
    body: string;
    _id: string;
}

export interface Event extends Document {
    eventName: string;
    time: number;
    comments: Array<Comment>;
}