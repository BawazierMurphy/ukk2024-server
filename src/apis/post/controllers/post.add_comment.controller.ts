import { ReqRes } from "express.type";
import { ValidationChain, body } from "express-validator";
import { handleAxiosError } from "../../../helpers/axios.helper";
import { getMetadaByAuth } from "../../../providers/pocketbase/auth.pb";
import { authAsAdmin } from "../../../providers/pocketbase/pocket.pb";

const controller = async ({ req, res }: ReqRes) => {
  try {
    const {
      text,
    }: {
      text: string;
    } = req.body;
    const postId = req.params.postId;
    const auth = req.headers.authorization;
    const metadata = await getMetadaByAuth(auth);
    const pb = await authAsAdmin();

    const comment = await pb.collection("post_comments").create({
      text,
      post: postId,
      created_by: metadata.id,
    });

    return res.status(201).send({
      status: "created",
      comment: {
        id: comment.id,
        text: comment.text,
      },
    });
  } catch (error) {
    handleAxiosError({
      error,
      req,
      res,
    });
  }
};

const validator = (): ValidationChain[] => {
  return [body("text").exists().isString()];
};

export default {
  controller: controller,
  validator: validator,
};
