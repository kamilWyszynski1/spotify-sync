import express from "express";
import { addUser, getUsers, join } from "../controllers/movement";
const router = express.Router();

router.post("/", addUser);
router.get("/", getUsers);
router.post("/join", join);

export { router };
