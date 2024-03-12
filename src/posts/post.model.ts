import mongoose from "mongoose";
import IPost from "./post.interface";

const postSchema = new mongoose.Schema<IPost>({
  authorId: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  },
  content: String,
  title: {
    type: String,
    MaxLength: 60,
    MinLength: 10
  },
},
{versionKey: false});

const postModel = mongoose.model<IPost>("Post", postSchema);

export default postModel;
