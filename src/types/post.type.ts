import { IUser } from "user.type";

export interface IPost {
  id: string;
  caption?: string;
  allow_comment: boolean;
  allow_like: boolean;
  is_private: boolean;
  image: string;
  created_by: IUser | string;
  created: Date;
  updated: Date;
}
