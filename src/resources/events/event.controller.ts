import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import EventService from '@/resources/events/event.service';

class EventController implements Controller {
    public path = '/events';
    public router = Router();
    private EventService = new EventService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}`, this.getEvents);
        this.router.post(`${this.path}`, this.postEvent);
        this.router.get(`${this.path}/:event_id`, this.getEvent);
        this.router.get(`${this.path}/:event_id/image`, this.getEventImage)

        this.router.delete(`${this.path}/:event_id`, this.deleteEvent);
        this.router.post(`${this.path}/:event_id/:username/interested`, this.postInterested)

        this.router.post(`${this.path}/:event_id/comment`, this.postComment);
        this.router.delete(
            `${this.path}/:event_id/:comment_id`,
            this.deleteComment
        );
    }
    private getEvents = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username, event_name } = req.query
            const events = await this.EventService.getAllEvents(username as string, event_name as string);
            res.status(200).send({ events });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getEvent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { event_id } = req.params
        try {
            const event = await this.EventService.getEventById(event_id);
            res.status(200).send({ event });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private getEventImage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { event_id } = req.params
            const image = await this.EventService.getEventImageById(event_id);
            res.status(200).send({ image });
        }
        catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private postEvent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { event_name, details, username, time, image } = req.body;
            const event = await this.EventService.addEvent(
                event_name,
                details,
                username,
                time,
                image
            );
            res.status(201).send({ msg: `${event_name} added`, event });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private deleteEvent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { event_id } = req.params
            await this.EventService.removeEvent(event_id);
            res.status(200).send()
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private postComment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username, body } = req.body;
            const { event_id } = req.params;
            await this.EventService.addComment(username, body, event_id);
            res.status(201).send({ msg: 'success' });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private deleteComment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { event_id, comment_id } = req.params;
            await this.EventService.removeComment(event_id, comment_id);
            res.status(200).send({ msg: 'Deleted comment' });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private postInterested = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username, event_id } = req.params;
            await this.EventService.addInterested(username, event_id);
            res.status(201).send({ msg: "interest added" })
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }
}

export default EventController;
