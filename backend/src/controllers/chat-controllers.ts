import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import Category from "../models/Categories.js";

import axios from 'axios';

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryName, message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
    return res
  .status(401)
  .json({ message: "User not registered OR Token malfunctioned" });
  
  let category = user.chats.find((c) => c.category === categoryName);
  if (!category) {
      // add user count 
      await Category.updateOne({ name: categoryName }, { $inc: { userCount: 1 } })
      const newCategory = {
        category: categoryName,
        conversation: [],
      };
      await User.updateOne({_id: user._id}, { $inc: { numCat: 1 } });
      user.chats.push(newCategory);
    }
    category = user.chats.find((c) => c.category === categoryName);
    category.conversation.push({
      content: message,
      role: "user",
      created: new Date(),
    });

    await Category.updateOne({ name: categoryName }, { $inc: { messageCount: 1 } })
    await User.updateOne({_id: user._id}, { $inc: { numChat: 1 } });
    // Get response message
    const response = await axios.post('https://parakeet-ace-smoothly.ngrok-free.app/chat', {"message": message});
    console.log(response.data.ans_vi);
    const chatResponse = response.data.ans_vi;

    category.conversation.push({
      content: chatResponse,
      role: "bot",
      created: new Date(),
    })
    // user.updateOne({'chats.category': categoryName }, { $set: { 'chats.$': category } })
    await user.save();
    return res.status(200).json({ role: 'bot', content: chatResponse });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {categoryName} = req.body;
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    let category = user.chats.find((c) => c.category === categoryName);
    
    if (!category) {
      category = {
        category: categoryName,
        conversation: [],
      };
    }
    return res.status(200).json({chats: category.conversation });
  } catch (error) {
    console.log(error);
    return res.status(200).json({cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};