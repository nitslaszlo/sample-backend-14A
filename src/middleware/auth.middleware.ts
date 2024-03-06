import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import IDataStoredInToken from "../interfaces/dataStoredInToken";
import IRequestWithUser from "../interfaces/requestWithUser.interface";
import userModel from "../users/user.model";

export default async function authMiddleware(
  request: IRequestWithUser,
  response: Response,
  next: NextFunction
): Promise<void> {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret: string = process.env.JWT_SECRET as string;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as IDataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}
