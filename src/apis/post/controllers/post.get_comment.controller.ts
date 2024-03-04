import { ReqRes } from "express.type";
import { ValidationChain } from "express-validator";
import { handleAxiosError } from "../../../helpers/axios.helper";

import { authAsAdmin } from "../../../providers/pocketbase/pocket.pb";
import { IUser } from "user.type";

const controller = async ({ req, res }: ReqRes) => {
  try {
    const postId = req.params.postId;

    const pb = await authAsAdmin();

    const datas = await pb.collection("post_comments").getFullList({
      filter: `post="${postId}"`,
      sort: "-created",
      expand: "created_by",
    });

    const payload: any[] = [];

    datas.forEach((data) => {
      const createdBy: IUser | undefined = data.expand.created_by;
      payload.push({
        id: data.id,
        text: data.text,
        created: data.created,
        created_by: createdBy,
      });
    });
    payload.sort((a, b) => {
      const aDate = new Date(a.created);
      const bDate = new Date(b.created);
      return +bDate - +aDate;
    });

    return res.send([...payload]);
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
