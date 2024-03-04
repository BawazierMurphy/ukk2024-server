import express from "express";

// controller
import authLoginController from "./controllers/auth.login.controller";
import { validatorResult } from "../../middlewares/validator.middleware";

const router: express.Router = express.Router();

router.post(
  "/login",
  authLoginController.validator(),
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    validatorResult({ req, res, next }),
  async (req: express.Request, res: express.Response) =>
    await authLoginController.controller({ req, res })
);

export default router;
