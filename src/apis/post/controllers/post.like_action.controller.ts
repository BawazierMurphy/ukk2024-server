import { ReqRes } from "express.type";
import { ValidationChain } from "express-validator";
import { handleAxiosError } from "../../../helpers/axios.helper";
import { getMetadaByAuth } from "../../../providers/pocketbase/auth.pb";
import { authAsAdmin } from "../../../providers/pocketbase/pocket.pb";
import Client from "pocketbase";

const controller = async ({ req, res }: ReqRes) => {
  try {
    const postId = req.params.postId;
    const auth = req.headers.authorization;
    const metadata = await getMetadaByAuth(auth);
    const pb = await authAsAdmin();

    const isLiked = await _isLiked(pb, postId, metadata.id);

    if (!isLiked) {
      await pb.collection("post_likes").create({
        post: postId,
        created_by: metadata.id,
      });
      return res.send({ status: "created" });
    } else {
      const likes = await pb.collection("post_likes").getFullList({
        filter: `post="${postId}"&&created_by="${metadata.id}"`,
        fields: "id",
      });

      if (likes.length !== 0) {
        const like = likes[0];
        await pb.collection("post_likes").delete(like.id);
        return res.send({ status: "deleted" });
      }
    }
    return res.send({ status: "no-action" });
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

const _isLiked = async (pb: Client, postId: string, myId: string) => {
  const { totalItems: isLikeCount } = await pb
    .collection("post_likes")
    .getList(1, 1, {
      filter: `post="${postId}"&&created_by="${myId}"`,
      fields: "id",
    });

  if (isLikeCount !== 0) return true;
  return false;
};
