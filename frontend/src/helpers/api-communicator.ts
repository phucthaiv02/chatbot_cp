import {io} from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";


export type User = {
  name: string;
  email: string;
}

export interface Response {
  status: number
}
export interface LoginResponse {
  status: number;
  userInfo: User; 
}

export interface ChatData {
  role: string;
  content: string;
}
export interface AllChatResponse {
  status: number;
  chats: ChatData[];
}

export interface ChatResponse {
  status: number;
  response: ChatData;
}

export interface SignUpResponse {
  status: number,
  message: string;
}

const socket = io("http://127.0.0.1:6968/")
export const loginUser = async (email: string, password: string) => {
  // const res = await axios.post("/user/login", { email, password });
  socket.emit("login", {"email": email, "password": password});
  const res: LoginResponse = await new Promise((resolve, reject) => {
    socket.on("login-response", (response) => {
      resolve(response);

    });
  });
  console.log(res)
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const user = await res.userInfo;
  return user;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  // const res = await axios.post("/user/signup", { name, email, password });
  socket.emit("signup", {"name": name, "email": email, "password": password, "confirmPassword": confirmPassword});

  const res: LoginResponse = await new Promise((resolve) => {
    socket.on("signup-response", (response) => {
      resolve(response);
    });
  });

  if (res.status !== 200) {
    throw new Error("Unable to Signup");
  }
  const user = await res.userInfo;
  return user;
};

export const checkAuthStatus = async () => {
  socket.emit("auth", "check");
  
  const res: LoginResponse = await new Promise((resolve) => {
    socket.on("auth-response", (response) => {
      resolve(response);
    });
  });
  
  if (res.status === 404)
    return undefined

  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  
  const data = await res.userInfo;
  return data;
};

export const sendChatRequest = async (message: string) => {
  // const res = await axios.post("/chat/new", { message });
  socket.emit("chat", {"message": message});

  const res: ChatResponse = await new Promise((resolve) => {
    socket.on("chat-response", (response) => {
      resolve(response);
    });
  });

  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.response;
  console.log(data);
  return data;
};

export const getUserChats = async (email: string) => {
  // const res = await axios.get("/chat/all-chats");

  socket.emit('all-chats', {'userInfo': email})
  const response: AllChatResponse = await new Promise((resolve) => {
    socket.on("all-chats-response", (response) => {
      resolve(response);
    });
  });
  console.log(response)
  if (response.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const chats = await response.chats;
  
  return chats;
};

export const deleteUserChats = async (email: string) => {
  // const res = await axios.delete("/chat/delete");
  socket.emit('delete-chat', {'userInfo': email})
  const response: Response = await new Promise((resolve) => {
    socket.on("delete-chat-response", (response) => {
      resolve(response);
    });
  });

  if (response.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await response;
  return data;
};

export const logoutUser = async (email: string) => {
  // const res = await axios.get("/user/logout");
  socket.emit("logout", {'userInfo': email});
  const res: Response = await new Promise((resolve) => {
    socket.on("logout-response", (response) => {
      resolve(response);
    });
  });
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  toast.success("Logout  Successfully", { id: "login" });
};