import express from "express";
import { addUser, getUsers } from "../controllers/movement";
const router = express.Router();

router.post("/", addUser);
router.get("/", getUsers);

export { router };
