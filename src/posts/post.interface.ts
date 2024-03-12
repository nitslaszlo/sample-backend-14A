import { Schema } from "mongoose";
export default interface IPost {
  authorId?: Schema.Types.ObjectId;
  content: string;
  title: string;
}
