import { Router } from "express";
import { createUser, deleteUser, readUser, readUsers, updateUser } from "../controllers/user.controller.js";

const router = Router()

router.route('/create-user').post(createUser);

router.route('/read-user/:userId').get(readUser);

router.route('/read-users').get(readUsers);

router.route('/update-user/:userId').put(updateUser);

router.route('/delete-user/:userId').delete(deleteUser);


export default router