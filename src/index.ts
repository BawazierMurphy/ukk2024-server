import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

// ROUTES
import authRouter from "./apis/auth/auth.routes";
import postsRouter from "./apis/post/post.routes";

dotenv.config();

const app: express.Express = express();
const port = process.env.PORT || 5003;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("hello from krapyak v1.0.0");
});

// ROUTES
app.use("/auth", authRouter);
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`);
});
