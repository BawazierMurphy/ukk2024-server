import { ReqRes } from "express.type";
import { ValidationChain, body, query } from "express-validator";
import { handleAxiosError } from "../../../helpers/axios.helper";
import {
  authWithPassword,
  useAdminToken,
} from "../../../providers/pocketbase/auth.pb";
import { pbCol } from "../../../providers/axios.provider";
import { IPost } from "post.type";
import { authAsAdmin } from "../../../providers/pocketbase/pocket.pb";
import qs from "qs";
import url from "url";

const controller = async ({ req, res }: ReqRes) => {
  try {
    const pb = await authAsAdmin();
    const query = qs.parse(url.parse(req.url).query);

    const data = await pb.collection("posts").getList(1, 500, {
      filter: `${
        query?.search !== undefined ? `caption~"${query.search}"` : ""
      }`,
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
  return [query("search").isString().optional(true)];
};

export default {
  controller: controller,
  validator: validator,
};
