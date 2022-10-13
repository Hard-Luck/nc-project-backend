import { Schema, model } from 'mongoose';
import { Comment, Event } from '@/resources/events/event.interface';

const EventSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        time: {
            type: Number,
            required: true,
            unique: true,
        },
        comments: {
            type: Array<Comment>,
            required: true,
        },
    },
    { timestamps: true }
);



export default model<Event>('Event', EventSchema);