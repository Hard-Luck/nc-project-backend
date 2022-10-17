import { Schema, model } from 'mongoose';
import { Image } from '@/resources/events/event.interface';

const ImageSchema = new Schema(
    {
        event_id: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
);



export default model<Image>('Image', ImageSchema);