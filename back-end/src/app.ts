import cors from "cors";
import express from "express";
import "express-async-errors";

import recommendationRouter from "./routers/recommendationRouter.js";
import devTestRouter from "./routers/devTestRouter.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recommendations", recommendationRouter);
app.use("/recommendations", devTestRouter)
app.use(errorHandlerMiddleware);

export default app;
