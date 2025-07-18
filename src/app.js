import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
import userRoute from "./routes/user.routes.js";
import newsRoute from "./routes/news.routes.js";

// Routes Declaration

//user routes
app.use("/api/v1/user", userRoute);

//news routes
app.use("/api/v1/news", newsRoute);

export { app };
