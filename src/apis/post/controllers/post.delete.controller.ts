import { ReqRes } from "express.type";
import { ValidationChain } from "express-validator";
import { handleAxiosError } from "../../../helpers/axios.helper";

import { authAsAdmin } from "../../../providers/pocketbase/pocket.pb";
const controller = async ({ req, res }: ReqRes) => {
  try {
    const postId = req.params.postId;

    const pb = await authAsAdmin();

    await pb.collection("posts").delete(postId);

    return res.status(204).send({ status: "deleted" });
  } catch (error) {
    handleAxiosError({
      error,
      req,
      res,
    });
  }
};

const validator = (): ValidationChain[] => {
  return [];
};

export default {
  controller: controller,
  validator: validator,
};
