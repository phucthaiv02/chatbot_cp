import axios from "axios";

export const getAllUsers = async () => {
  const res = await axios.get("/user");
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const loginUser = async (email, password) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (name, email, password, role) => {
  const res = await axios.post("/user/signup", { name, email, password, role });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

export const deleteUser = async (email) => {
  const res = await axios.delete(`/user/delete/${email}`);
  if (res.status !== 200) {
    throw new Error("Unable to delete user");
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (categoryName, message) => {
  console.log(message);
  const res = await axios.post("/chat/new", { categoryName, message });
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const getUserChats = async (categoryName) => {
  const res = await axios.post("/chat/all-chats", {categoryName});
  if (res.status !== 200) {
    throw new Error("Unable to get chats");
  }
  const data = await res.data;
  return data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to log out");
  }
  const data = await res.data;
  return data;
};

export const addCategory = async (name) => {
  const res = await axios.post("/category/new", {name: name});
  if (res.status !== 200) {
    throw new Error("Unable to create category");
  }
  const data = await res.data;
  return data;
};

export const deleteCategory = async (name) => {
  const res = await axios.delete(`/category/delete/${name}`);
  if (res.status !== 200) {
    throw new Error("Unable to delete category");
  }
  const data = await res.data;
  return data;
};

export const getAllCategory = async () => {
  const res = await axios.get("/category/all-categories");
  if (res.status !== 200) {
    throw new Error("Unable to get categpries");
  }
  const data = await res.data;
  return data;
};