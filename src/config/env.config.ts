import dotenv from "dotenv";
dotenv.config();

const jwt = {
  secret: process.env.JWT_SECRET,
  expire_in: 1 * 24 * 60 * 60 * 1000,
};

const pbc = {
  url: process.env.PB_URL,
  admin: {
    email: process.env.PB_ADMIN_EMAIL,
    password: process.env.PB_ADMIN_PASSWORD,
  },
};

export default {
  jwt,
  pbc,
};
