import { ReqRes } from "express.type";
import { ValidationChain, body } from "express-validator";
import { handleAxiosError } from "../../../helpers/axios.helper";
import {
  authWithPassword,
  getMetadaByAuth,
  useAdminToken,
} from "../../../providers/pocketbase/auth.pb";
import { authAsAdmin } from "../../../providers/pocketbase/pocket.pb";

const controller = async ({ req, res }: ReqRes) => {
  try {
    const auth: string | undefined = req.headers.authorization;
    const postId = req.params.postId;

    let isSignIn = false;
    let isLiked = false;

    const pb = await authAsAdmin();

    const { totalItems } = await pb.collection("post_likes").getList(1, 1, {
      filter: `post="${postId}"`,
      fields: "id",
    });

    if (auth) {
      const metadata = await getMetadaByAuth(auth);
      isSignIn = true;

      const { totalItems: isLikeCount } = await pb
        .collection("post_likes")
        .getList(1, 1, {
          filter: `post="${postId}"&&created_by="${metadata.id}"`,
          fields: "id",
        });

      if (isLikeCount !== 0) isLiked = true;
    }

    return res.send({
      like_count: totalItems,
      is_signin: isSignIn,
      is_liked: isLiked,
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
  return [];
};

export default {
  controller: controller,
  validator: validator,
};
