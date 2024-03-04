import { ReqRes } from "express.type";
import { ValidationChain, body } from "express-validator";
import { handleAxiosError } from "../../../helpers/axios.helper";
import {
  authWithPassword,
  getMetadaByAuth,
  useAdminToken,
} from "../../../providers/pocketbase/auth.pb";
import { pbCol } from "../../../providers/axios.provider";
// import FormData from "form-data";
import fs from "fs";
import { Blob } from "buffer";

const controller = async ({ req, res }: ReqRes) => {
  const files: Express.Multer.File | any = req.files;
  try {
    const {
      caption,
      allow_comment,
      allow_like,
      is_private,
    }: {
      caption: string;
      allow_comment: boolean;
      allow_like: boolean;
      is_private: boolean;
    } = req.body;

    if (files.length === 0)
      return res.status(400).send({ error_code: "field-files-required" });

    const file: Express.Multer.File = files[0];

    const auth = req.headers.authorization;
    const metadata = await getMetadaByAuth(auth);

    const adminToken = await useAdminToken();

    const formdata = new FormData();
    if (caption) formdata.append("caption", caption);
    formdata.append("allow_comment", allow_comment.toString());
    formdata.append("allow_like", allow_like.toString());
    formdata.append("is_private", is_private.toString());
    formdata.append("created_by", metadata.id);
    formdata.append(
      "image",
      new Blob([fs.readFileSync(file.path)]),
      file.filename
    );

    const { data: post } = await pbCol.post("/posts/records", formdata, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    fs.unlinkSync(file.path);

    return res.send({ status: "ok", post });
  } catch (error) {
    if (files) fs.unlinkSync(files[0].path);
    handleAxiosError({
      error,
      req,
      res,
    });
  }
};

const validator = (): ValidationChain[] => {
  return [
    body("caption").optional(),
    body("allow_comment").exists().isBoolean(),
    body("allow_like").exists().isBoolean(),
    body("is_private").exists().isBoolean(),
  ];
};

export default {
  controller: controller,
  validator: validator,
};
