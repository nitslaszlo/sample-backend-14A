
import { Request } from 'express';
import User from '../users/user.interface';
 
export default interface IRequestWithUser extends Request {
  user: User;
}