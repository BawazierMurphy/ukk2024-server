import express from "express";
import { validatorResult } from "../../middlewares/validator.middleware";

// middlewares
import ensureAuthorized from "../../middlewares/auth.middleware";
import multerMiddleware from "../../middlewares/multer.middleware";

// controller
import postGetController from "./controllers/post.get.controller";
import postGet_mineController from "./controllers/post.get_mine.controller";
import postGet_comment_count_and_is_likedController from "./controllers/post.get_comment_count_and_is_liked.controller";
import postCreateController from "./controllers/post.create.controller";
import postLike_actionController from "./controllers/post.like_action.controller";
import postAdd_commentController from "./controllers/post.add_comment.controller";
import postGet_commentController from "./controllers/post.get_comment.controller";
import postDeleteController from "./controllers/post.delete.controller";

const router: express.Router = express.Router();

router.get(
  "/",
  postGetController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await postGetController.controller({ req, res })
);

router.get(
  "/mine",
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    ensureAuthorized({ req, res, next }),
  postGet_mineController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await postGet_mineController.controller({ req, res })
);

router.get(
  "/comment-count-is-liked/:postId",
  postGet_comment_count_and_is_likedController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await postGet_comment_count_and_is_likedController.controller({ req, res })
);

router.get(
  "/comments/:postId",
  postGet_commentController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await postGet_commentController.controller({ req, res })
);

router.post(
  "/like-action/:postId",
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    ensureAuthorized({ req, res, next }),
  postLike_actionController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await postLike_actionController.controller({ req, res })
);

router.post(
  "/add-comment/:postId",
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    ensureAuthorized({ req, res, next }),
  postAdd_commentController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await postAdd_commentController.controller({ req, res })
);

router.post(
  "/",
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    multerMiddleware.uploadMultiple({
      req,
      res,
      next,
      allowedType: ["image/png", "image/jpeg"],
      maxFiles: 1,
      maxSizeMB: 1000,
    }),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    ensureAuthorized({ req, res, next }),
  postCreateController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await postCreateController.controller({ req, res })
);

router.delete(
  "/delete/:postId",
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    ensureAuthorized({ req, res, next }),
  postDeleteController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await postDeleteController.controller({ req, res })
);

export default router;
