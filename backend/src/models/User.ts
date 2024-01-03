import mongoose, { Document, Types } from "mongoose";

interface Chat {
  role: string;
  content: string;
  created: Date;
}

interface Category {
  category: string;
  conservation: Chat[];
}

interface User extends Document {
  name: string;
  email: string;
  password: string;
  chats: Category[];
}

const chatSchema = new mongoose.Schema<Chat>({
  role: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const categorySchema = new mongoose.Schema<Category>({
  category: {
    type: String,
    required: true,
  },
  conservation: [chatSchema],
});

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  chats: [categorySchema],
});

export default mongoose.model<User>("User", userSchema);
