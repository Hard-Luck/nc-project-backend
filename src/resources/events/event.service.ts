import { Comment, Event } from './event.interface';
import EventModel from './event.model';
import { generateID } from '@/utils/idGen';
import { ObjectId } from 'mongoose';
import HttpException from '@/utils/exceptions/http.exception';

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
                await this.event.create({ name: eventObject.eventName, comments: [comment], time: eventObject.time });
            } else {
                existingEvent?.comments.push(comment);
                existingEvent?.save();
            }

        } catch (err) {
            console.error(err);
            throw new Error('failed to add comment');
        }

    }
    public async removeComment(event_id: ObjectId, comment_id: string): Promise<void | Error> {
        const existingEvent = await this.event.findById(event_id);
        const commentsLength = existingEvent?.comments.length
        if (existingEvent) {
            existingEvent.comments = existingEvent?.comments.filter(comm => {
                return comm._id !== comment_id
            })
            if (existingEvent.comments.length === commentsLength) {
                throw new HttpException(400, "Comment not found to delete");
            }
            existingEvent?.save();
        }
    }
}

export default EventService