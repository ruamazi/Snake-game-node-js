import { Router } from "express";
import {
 createGuest,
 createUser,
 leaderBoard,
 updateScore,
} from "../controllers/user.controller.js";

const route = Router();

route.post("/create", createUser);
route.get("/guest", createGuest);
route.get("/lboard", leaderBoard);
route.put("/update/:userId", updateScore);

export default route;
