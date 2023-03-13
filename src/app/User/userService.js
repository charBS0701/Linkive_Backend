import pool from "../../../config/database";
import hashPassword from "../../../utils/hashPassword";

import { insertUser, saveUser, findUserById } from "./userDao";
import { getUserById } from "./userProvider";

export const createUser = async (newUser) => {
  const { id, password, email, nickname } = newUser;
  const client = await pool.connect();
  try {
    await insertUser(client, id, await hashPassword(password), email, nickname);
  } catch (err) {
    console.error(err);
  }
};

export const changePassword = async (id, newPassword) => {
  const client = await pool.connect();
  try {
    const user = await findUserById(client, id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "해당 id의 user가 존재하지 않습니다." });
    }
    user.password = await hashPassword(newPassword); // 비밀번호 변경
    await saveUser(client, user);
  } catch (err) {
    console.log("changePassword error");
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
};

export const changeUserInfoService = async (
  id,
  newNickname,
  newId,
  newPassword
) => {
  console.log("changeUserInfoService 시작");
  console.log("id", id);
  const userInfo = await getUserById(id);
  console.log("기존 유저 정보", userInfo);

  const user = {
    users_num: userInfo.users_num,
    nickname: newNickname,
    id: newId,
    password: newPassword,
  };

  console.log("바꿀 정보", user);
  const client = await pool.connect();
  try {
    console.log("changeUserInfoService try");
    await saveUser(client, user);
  } catch (err) {
    console.log("changeUserInfoService error");
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
};
