import { Router } from "express";
import { getAllCategories, addCategory, deleteCategory } from "../controllers/category-controllers.js";

const categoryRoutes = Router();
categoryRoutes.get("/all-categories", getAllCategories);
categoryRoutes.post("/new", addCategory);
categoryRoutes.delete("/delete/:name", deleteCategory);

export default categoryRoutes;