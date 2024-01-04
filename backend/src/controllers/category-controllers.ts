// categoryController.ts
import { Request, Response } from "express";
import Category from "../models/Categories.js";

export const addCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      res.status(400).json({ error: "Category already exists" });
      return;
    }

    const category = new Category({ name });
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.params;
    const deletedCategory = await Category.findOneAndDelete({ name: name });

    if (!deletedCategory) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
