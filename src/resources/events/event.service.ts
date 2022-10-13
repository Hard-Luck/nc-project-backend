import { Comment, Event } from './event.interface';
import EventModel from './event.model';
import { v4 as uuidv4 } from 'uuid';
import { generateID } from '@/utils/idGen';

class EventService {
    private event = EventModel;



    public async addComment(
        comment: Comment,
        eventObject: Event,
    ): Promise<void | Error> {
        try {
            comment._id = generateID();
            const existingEvent = await this.event.findOne({ name: eventObject.eventName });
            if (!existingEvent) {
                await this.event.create({ name: eventObject.eventName, comments: [comment], time: 10000 });
            } else {
                existingEvent?.comments.push(comment);
                existingEvent?.save();
            }

        } catch (err) {
            console.error(err);
            throw new Error('failed to add comment');
        }

    }
}

export default EventService