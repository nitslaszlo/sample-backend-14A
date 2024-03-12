import { IsString, MinLength, MaxLength, IsAlpha, isAlpha } from "class-validator";
import IPost from "./post.interface";


export default class CreatePostDto implements IPost {

  @IsString()
  // @IsAlpha("hu-HU")
  public content: string;

  @IsString()
  @MinLength(2, {
    message: 'Title is too short',
  })
  @MaxLength(50, {
    message: 'Title is too long',
  })
  public title: string;
}
