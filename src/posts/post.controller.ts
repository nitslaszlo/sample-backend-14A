import { Request, Response, NextFunction, Router } from "express";
import Controller from "../interfaces/controller.interface";
import Post from "./post.interface";
import postModel from "./post.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import authMiddleware from "../middleware/auth.middleware";
import IRequestWithUser from "interfaces/requestWithUser.interface";

export default class PostsController implements Controller {
  public path = "/posts";
  public router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAllPosts);
    this.router.get(`${this.path}/:id`, authMiddleware, this.getPostById);
    this.router.patch(
      `${this.path}/:id`,
      [authMiddleware, validationMiddleware(CreatePostDto, true)],
      this.modifyPost
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePost);
    this.router.post(
      this.path,
      [authMiddleware, validationMiddleware(CreatePostDto)],
      this.createPost
    );
  }

  private getAllPosts = (request: Request, response: Response) => {
    this.post
      .find()
      .populate("authorId", ["-password", "-email"])
      .then((posts) => {
        response.send(posts);
      })
      .catch((error) => {
        response.send(error.message);
      });
  };

  private getPostById = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    this.post
      .findById(id)
      .then((post) => {
        if (post) {
          response.send(post);
        } else {
          // response.status(404).send({ error: "Post not found" });
          next(new PostNotFoundException(id));
        }
      })
      .catch((error) => {
        response.send(error.message);
      });
  };

  private modifyPost = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const postData: Post = request.body;
    this.post
      .findByIdAndUpdate(id, postData, { new: true })
      .then((post) => {
        if (post) {
          response.send(post);
        } else {
          next(new PostNotFoundException(id));
        }
      })
      .catch((error) => {
        response.send(error.message);
      });
  };

  private createPost = async (
    request: IRequestWithUser,
    response: Response
  ) => {
    const postData: Post = request.body;
    const createdPost = new this.post({
      ...postData,
      authorId: request.user._id,
    });
    const savedPost = await createdPost.save();
    await savedPost.populate("authorId", ["-password", "-email"]);
    response.send(savedPost);
  };

  private deletePost = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    this.post
      .findByIdAndDelete(id)
      .then((successResponse) => {
        if (successResponse) {
          response.send(200);
        } else {
          next(new PostNotFoundException(id));
        }
      })
      .catch((error) => {
        response.send(error.message);
      });
  };
}
