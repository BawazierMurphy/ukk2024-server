import Client from "pocketbase";
import envConfig from "../../config/env.config";
const PocketBase = require("pocketbase/cjs");
export const pb: Client = new PocketBase(envConfig.pbc.url);

export async function authAsAdmin() {
  await pb.admins.authWithPassword(
    envConfig.pbc.admin.email,
    envConfig.pbc.admin.password,
    { cache: "no-store" }
  );

  return pb;
}
