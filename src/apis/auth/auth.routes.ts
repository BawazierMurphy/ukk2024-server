import express from "express";

// middlewares
import { validatorResult } from "../../middlewares/validator.middleware";

// controllers
import authLoginController from "./controllers/auth.login.controller";
import authRegisterController from "./controllers/auth.register.controller";

const router: express.Router = express.Router();

router.post(
  "/login",
  authLoginController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await authLoginController.controller({ req, res })
);

router.post(
  "/register",
  authRegisterController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await authRegisterController.controller({ req, res })
);

export default router;
