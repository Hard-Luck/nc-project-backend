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
        this.router.patch(`${this.path}`, this.patchEvents);
        this.router.delete(`${this.path}`, this.deleteComment)
    }

    private patchEvents = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { comment, eventObject } = req.body
            await this.EventService.addComment(comment, eventObject)
            res.status(201).send({ msg: "success" })
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
            const { event_id, comment_id } = req.body
            await this.EventService.removeComment(event_id, comment_id)
            res.status(200).send({ msg: "Deleted comment" })
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }
}

export default EventController;


