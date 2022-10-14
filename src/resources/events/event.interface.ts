import { Document } from 'mongoose';

export interface Comment extends Document {
    username: string;
    time: number;
    body: string;
    _id: string;
    votes: number;
}

export interface Event extends Document {
    event_name: string;
    username: string;
    time: number;
    comments: Array<Comment>
    interested_in: Array<string>
}