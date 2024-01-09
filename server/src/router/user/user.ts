import { Hono } from 'hono';
import { userController } from './../../controllers/userController';

const user = new Hono().basePath('/users');

user.get('/', userController.getUser);
user.post('/', userController.createUser);

export default user;
