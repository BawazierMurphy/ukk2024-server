import { ReqRes } from "express.type";
import { ValidationChain } from "express-validator";
import { handleAxiosError } from "../../../helpers/axios.helper";
import { authAsAdmin } from "../../../providers/pocketbase/pocket.pb";
import { getMetadaByAuth } from "../../../providers/pocketbase/auth.pb";

const controller = async ({ req, res }: ReqRes) => {
  try {
    const auth = req.headers.authorization;

    const metadata = await getMetadaByAuth(auth);

    const pb = await authAsAdmin();

    const data = await pb.collection("posts").getList(1, 500, {
      filter: `created_by="${metadata.id}"`,
      expand: "created_by",
      sort: "-created",
    });
    const payload: any[] = [];

    data.items.forEach((post) => {
      payload.push({
        ...post,
        created_by: post.expand.created_by,
      });
    });
    return res.send({
      ...data,
      items: payload,
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
