import { ReqRes } from "express.type";
import { handleAxiosError } from "../helpers/axios.helper";
import { pbCol } from "../providers/axios.provider";

const ensureAuthorized = async ({ req, res, next }: ReqRes) => {
  try {
    const auth = req.headers.authorization;
    const unauth = () =>
      res.status(401).send({
        code: 401,
        error_code: "unauthorized",
      });

    if (!auth) return unauth();

    const authReq = await pbCol.get("/users/records", {
      headers: {
        Authorization: auth,
      },
    });

    if (authReq.data.totalItems === 0) return unauth();

    next();
  } catch (error) {
    handleAxiosError({
      error,
      req,
      res,
    });
  }
};

export default ensureAuthorized;
