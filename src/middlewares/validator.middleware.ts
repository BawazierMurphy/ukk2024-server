import { ReqRes } from "express.type";
import { validationResult } from "express-validator";

const validatorResult = ({ req, res, next }: ReqRes) => {
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();

  if (hasErrors) {
    return res.status(400).send({ validation_errors: result.array() });
  }
  next();
};

export { validatorResult };
