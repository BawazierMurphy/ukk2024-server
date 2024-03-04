import { ReqRes } from "express.type";
import { ValidationChain, body } from "express-validator";
import { handleAxiosError } from "../../../helpers/axios.helper";
import { authWithPassword } from "../../../providers/pocketbase/auth.pb";

const controller = async ({ req, res }: ReqRes) => {
  try {
    const { identity, password }: { identity: string; password: string } =
      req.body;

    const data = await authWithPassword({
      identity,
      password,
    });

    return res.send(data);
  } catch (error) {
    handleAxiosError({
      error,
      req,
      res,
    });
  }
};

const validator = (): ValidationChain[] => {
  return [
    body("identity").exists().isString(),
    body("password").exists().isString(),
  ];
};

export default {
  controller: controller,
  validator: validator,
};
