import { Schema } from "mongoose";
import IAddress from "./address.interface";

export default interface IUser {
  _id?: Schema.Types.ObjectId,
  name: string;
  email: string;
  password: string | undefined;
  address?: IAddress;
}
