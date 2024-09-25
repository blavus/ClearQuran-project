import express from "express";
import authRoute from "./routes/auth.js";
import verseRoute from "./routes/saveVerses.js";
import userRoute from "./routes/userRoute.js";
import errorHandler from "./middleware/errorHandler.js";
const app = express();
const port = 3000;
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/verse", verseRoute);
app.use("/api/user", userRoute);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`server run in port ${port}`);
});
