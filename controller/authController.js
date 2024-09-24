import db from "../db/index.js";
import { tryCatch } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../schema/index.js";

export const login = tryCatch(async (req, res) => {
  const { email, password } = await loginSchema.validateAsync(req.body);

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
  const { username, email, password } = await registerSchema.validateAsync(
    req.body
  );
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

    res.status(200).json({
      status: "succuss",
      msg: "user has been created",
    });
  });
});
