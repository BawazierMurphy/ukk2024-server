import { ReqRes } from "express.type";
import { ValidationChain, body } from "express-validator";
import { handleAxiosError } from "../../../helpers/axios.helper";
import { authAsAdmin } from "../../../providers/pocketbase/pocket.pb";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const controller = async ({ req, res }: ReqRes) => {
  try {
    const {
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    } = req.body;

    const pb = await authAsAdmin();

    // CHECK USERNAME
    const { totalItems: totalUsernameItems } = await pb
      .collection("users")
      .getList(1, 500, {
        filter: `username="${username}"`,
      });
    if (totalUsernameItems > 0)
      return res.status(409).send({
        status: "username-already-exist",
        message: "username already exist, please use another username",
      });

    // CHECK EMAIL
    const { totalItems: totalEmailItems } = await pb
      .collection("users")
      .getList(1, 500, {
        filter: `email="${email}"`,
      });
    if (totalEmailItems > 0)
      return res.status(409).send({
        status: "email-already-exist",
        message: "email already exist, please use another email",
      });

    const data = {
      username: username,
      email: email,
      emailVisibility: true,
      password: password,
      passwordConfirm: password,
      verified: true,
    };

    await pb.collection("users").create(data);

    const { data: userData } = await axios.post(
      `http://localhost:${process.env.PORT}/auth/login`,
      {
        identity: email,
        password: password,
      }
    );

    return res.status(201).send(userData);
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
    body("username").exists().isString(),
    body("email").exists().isEmail(),
    body("password").exists().isString(),
  ];
};

export default {
  controller: controller,
  validator: validator,
};
