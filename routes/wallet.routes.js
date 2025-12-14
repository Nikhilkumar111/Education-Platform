import express from "express";
import {
     StudentWallet,
     VerifyPayment,
     getWalletBalance
} from "../controller/wallet.controller.js"
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/create-order",protect,StudentWallet);

router.get("/balance",protect,getWalletBalance);
router.post("/verify",protect,VerifyPayment);
export default router;
     