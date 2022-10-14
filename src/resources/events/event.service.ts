import { Comment, Event } from './event.interface';
import EventModel from './event.model';
import { generateID } from '@/utils/idGen';
import { ObjectId } from 'mongoose';

class EventService {
    private event = EventModel;

    public async addEvent(
        event_name: string,
        details: string,
        username: string,
        time: number,
    ): Promise<object | Error> {
        try {
            const event = await this.event.create({ event_name, details, username, time });
            return event
        }
        catch (error) {
            console.error(error);
            throw new Error('event not created');
        }
    }

    public async addComment(
        username: string,
        body: string,
        event_id: string,
    ): Promise<void | Error> {
        try {
            const id = generateID();
            let toAdd = { username, body, time: Date.now(), _id: id, votes: 0 } as Comment;
            const existingEvent = await this.event.findById(event_id);
            if (!existingEvent) {
                throw new Error(`event not found`)
            } else {
                existingEvent?.comments.push(toAdd);
                existingEvent?.save();
            }

        } catch (err) {
            console.error(err);
            throw new Error('failed to add comment');
        }

    }
    public async removeComment(event_id: string, comment_id: string): Promise<void | Error> {
        const existingEvent = await this.event.findById(event_id);
        const commentsLength = existingEvent?.comments.length
        if (existingEvent) {
            existingEvent.comments = existingEvent?.comments.filter(comm => {
                return comm._id !== comment_id
            })
            if (existingEvent.comments.length === commentsLength) {
                throw new Error("Comment not found to delete");
            }
            existingEvent?.save();
        }
    }
}

export default EventService