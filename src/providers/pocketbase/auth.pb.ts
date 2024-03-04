import axios from "axios";
import { pbAdmin, pbCol } from "../axios.provider";
import envConfig from "../../config/env.config";
import { IUser } from "user.type";

export const useAdminToken = async (): Promise<string> => {
  const { data } = await pbAdmin.post("/auth-with-password", {
    identity: envConfig.pbc.admin.email,
    password: envConfig.pbc.admin.password,
  });

  return data.token;
};

export const getMetadaByAuth = async (auth: string): Promise<IUser> => {
  const authReq = await pbCol.get("/users/records", {
    headers: {
      Authorization: auth,
    },
  });
  if (authReq.data.totalItems > 0) return authReq.data.items[0];
};

export const authWithPassword = async ({
  identity,
  password,
}: {
  identity: string;
  password: string;
}) => {
  const req = await pbCol.post("/users/auth-with-password", {
    identity,
    password,
  });
  return req.data;
};
