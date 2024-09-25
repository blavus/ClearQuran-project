import db from "../db/index.js";
import AppError from "../utils/AppError.js";
import { tryCatch } from "../utils/catchAsync.js";
import bcrypt from "bcrypt";

//HANDLE NOT FOUND USER
const findUser = async (id) => {
  const findUser = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  if (findUser.rows.length == 0) {
    throw new AppError(401, "user Not Found", 401);
  }
};
//GET ALL USERS
export const getAllUser = tryCatch(async (req, res) => {
  const queryText = "SELECT id,username,email,created_at,isadmin FROM users ";

  const users = await db.query(queryText);
  res.status(200).json({
    status: "succuss",
    data: users.rows,
  });
});
//GET USER
export const getUser = tryCatch(async (req, res) => {
  const id = req.params.id;
  await findUser(id);
  const queryText =
    "SELECT id,username,email,created_at,isadmin FROM users where id = $1";
  const params = [id];
  const users = await db.query(queryText, params);
  res.status(200).json({
    status: "succuss",
    data: users.rows,
  });
});
//DELETE
export const deleteUser = tryCatch(async (req, res) => {
  const id = req.params.id;
  await findUser(id);
  const queryText = "DElETE FROM users WHERE id = $1";
  const params = [id];
  await db.query(queryText, params);

  res.status(200).json({
    status: "succuss",
    data: "User deleted Success",
  });
});
//UPDATE
export const updateUser = tryCatch(async (req, res) => {
  const id = req.params.id;
  const { username, password, email, oldPassword } = req.body;
  console.log(password);

  await findUser(id);
  const currentPassword = await db.query(
    "SELECT password FROM users WHERE id = $1",
    [id]
  );
  if (oldPassword) {
    const checkPassword = await bcrypt.compare(
      oldPassword,
      currentPassword.rows[0].password
    );
    if (!checkPassword) {
      throw new AppError(400, "old password is incorrect", 400);
    }
  }
  let hashPassword;
  if (password) {
    hashPassword = await bcrypt.hash(password, 12);
  }
  const queryText = `UPDATE users
      SET username = COALESCE($1,username),
      email = COALESCE($2,email),
      password = COALESCE($3,password)
      WHERE id = $4
      RETURNING id,username,email
      `;
  const params = [username, email, hashPassword, id];
  const updatedUser = await db.query(queryText, params);

  res.status(200).json({
    status: "succuss",
    data: updatedUser.rows[0],
  });
});
