import {Request, Response, NextFunction, Router} from "express";
import Controller from "../interfaces/controller.interface";
import Post from "./post.interface";
import postModel from "./post.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";

export default class PostsController implements Controller {
  public path = "/posts";
  public router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true),  this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = (
    request: Request,
    response: Response
  ) => {
    this.post
      .find()
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

  private createPost = (
    request: Request,
    response: Response
  ) => {
    const postData: Post = request.body;
    const createdPost = new this.post(postData);
    createdPost
      .save()
      .then((savedPost) => {
        response.send(savedPost);
      })
      .catch((error) => {
        response.send(error.message);
      });
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
