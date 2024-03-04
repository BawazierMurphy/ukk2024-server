import { Request, Response, NextFunction } from "express";

interface ReqRes {
  req: Request;
  res: Response;
  next?: NextFunction;
}

export { ReqRes };
