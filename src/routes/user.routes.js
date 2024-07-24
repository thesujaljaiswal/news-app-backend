import { Router } from "express";
import { deleteUserAccount, getUserProfileWithNews, loginUser, logoutUser, registerUser, updateUserDetails } from "../controller/user.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router()

router.route('/signup').post(registerUser)//User can signup from here
router.route('/login').post(loginUser)//User will be logged in here

//Secured routes
router.route('/logout').post(verifyJWT, logoutUser)//User will loggout in here
router.route('/deleteuser').delete(verifyJWT, deleteUserAccount)//User will delete their account from database
router.route('/getdata/:id').get(verifyJWT, getUserProfileWithNews)
router.route('/updateuser').patch(verifyJWT, updateUserDetails)

export default router