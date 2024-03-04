import { ReqRes } from "express.type";
import { isAxiosError } from "axios";

interface HandleAxiosErrorParam extends ReqRes {
  error: any;
}

const handleAxiosError = ({ error, res }: HandleAxiosErrorParam) => {
  if (isAxiosError(error) && error.response) {
    // console.log(error.response);
    return res.status(error.response?.status ?? 500).send(error.response.data);
  } else {
    // console.log(error);
    return res.status(500).send({ message: error.toString() });
  }
};

export { handleAxiosError };
