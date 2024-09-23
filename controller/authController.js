import db from "../db/index.js";
import { tryCatch } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const login = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await db.query("select * FROM users WHERE email = $1", [email]);
  if (user.rows.length == 0) {
    throw new AppError(100, "user not found", 400);
  }

  const checkPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!checkPassword) {
    throw new AppError(100, "wrong password", 400);
  }

  const token = jwt.sign({ id: user.rows[0].id }, "secret Key");
  const { password: pwd, ...other } = user.rows[0];
  res.status(200).json({
    status: "succuss",
    token: token,
    data: other,
  });
});

export const register = tryCatch(async (req, res) => {
  const { username, email, password } = req.body;
  const existUser = await db.query(
    "select * FROM users WHERE email = $1 OR username = $2",
    [email, username]
  );
  if (existUser.rows.length > 0) {
    throw new AppError(100, "this email or username already exist", 400);
  }
  bcrypt.hash(password, 12, async (err, hash) => {
    if (err) {
      throw new AppError(100, "failed when hashing password", 400);
    }

    const newUser = await db.query(
      "INSERT INTO users(username,email,password) VALUES ($1,$2,$3)",
      [username, email, hash]
    );

    if (newUser.error) {
      res.status(400).json("errrrrrr");
    }
  });
});
