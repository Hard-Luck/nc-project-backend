import { Schema, model } from 'mongoose';
import { Comment, Event } from '@/resources/events/event.interface';

const EventSchema = new Schema(
    {
        event_name: {
            type: String,
            required: true,
        },
        details: {
            type: String
        },
        time: {
            type: Number,
            required: true,
        },
        comments: {
            type: Array<Comment>,
            default: [],
        },
        interested_in: {
            type: Array<String>,
            default: []
        }

    },
    { timestamps: true }
);



export default model<Event>('Event', EventSchema);