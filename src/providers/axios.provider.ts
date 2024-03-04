import axios from "axios";
import env from "../config/env.config";

const host = env.pbc.url;

const pbCol = axios.create({
  baseURL: `${host}/api/collections`,
});

const pbAdmin = axios.create({
  baseURL: `${host}/api/admins`,
});

export { pbAdmin, pbCol };
