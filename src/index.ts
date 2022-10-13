import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import UserController from '@/resources/user/user.controller'
import EventController from '@/resources/events/event.controller';

validateEnv();

const app = new App(
    [new UserController(), new EventController], Number(process.env.PORT)
);

app.listen();