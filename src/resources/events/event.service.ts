import { Comment, Event, Image } from './event.interface';
import EventModel from './event.model';
import { generateID } from '@/utils/idGen';
import ImageModel from './image.model';
import console from 'console';


class EventService {
    private event = EventModel;
    private image = ImageModel

    public async getAllEvents(username: string, event_name: string): Promise<Event[]> {
        try {

            if (username) {
                const events = await this.event.find({ username: { $regex: new RegExp("^" + username, "i"), } });
                if (event_name) {
                    return events.filter(event => {
                        return event.username?.toLowerCase() === username.toLowerCase();
                    })
                } else {
                    return events
                }
            }
            if (event_name) {
                {
                    const events = await this.event.find({ event_name: { $regex: new RegExp("^" + event_name, "i"), } });
                    return events
                }
            }
            const events = await this.event.find({});
            return events
        } catch (error: any) {
            console.error(error)
            throw new Error("Could not get events")
        }
    }

    public async getEventById(event_id: string): Promise<Event[]> {
        try {
            const event = await this.event.find({ _id: event_id });
            return event
        } catch (error: any) {
            throw new Error("Could not get events")
        }
    }
    public async getEventImageById(event_id: string): Promise<Image[]> {
        try {
            const image = await this.image.find({ event_id: event_id })
            return image
        } catch (error: any) {
            throw new Error("Could not get image")
        }
    }

    public async addEvent(
        event_name: string,
        details: string,
        username: string,
        time: number,
        image: string | undefined,
    ): Promise<object | Error> {
        try {
            const event = await this.event.create({ event_name, details, username, time });
            const event_id = String(event._id)
            if (image !== "") await this.image.create({ event_id, image })
            return event
        }
        catch (error) {
            console.error(error);
            throw new Error('event not created');
        }
    }

    public async removeEvent(event_id: string): Promise<void | Error> {
        try {
            await this.event.deleteOne({ _id: event_id });
        } catch (error: any) {
            console.log(error)
            throw new Error('failed to delete event');
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
            throw new Error('failed to add comment');
        }

    }
    public async removeComment(event_id: string, comment_id: string): Promise<void | Error> {
        try {
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
        catch (error) {
            throw new Error("failed to remove comment")

        }
    }
    public async addInterested(username: string, event_id: string): Promise<void | Error> {
        try {
            const existingEvent = await this.event.findById(event_id);
            const interestedLength = existingEvent?.interested_in.length
            if (!existingEvent?.interested_in.includes(username)) {
                existingEvent?.interested_in.push(username);
            }
            if (interestedLength === existingEvent?.interested_in.length) {
                throw new Error("failed to add to interested")
            }
            existingEvent?.save();
        } catch (error) {
            throw new Error("failed to add interested_in")
        }
    }

}

export default EventService