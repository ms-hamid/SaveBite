import express from "express";
import { 
    login, 
    merchant_register, 
    register,
    forgot_password,
    verify_reset_otp,
    reset_password,
    logout
} from "../controllers/auth.controller.js";

const auth_route = express.Router();

auth_route.post("/reg", (req, res) => {
    register(req, res);
});

auth_route.post("/merch_reg", (req, res) => {
    merchant_register(req, res);
});

auth_route.post("/login", (req, res) => {
    login(req, res);
});

// Password reset endpoints
auth_route.post("/forgot-password", (req, res) => {
    forgot_password(req, res);
});

auth_route.post("/verify-reset-otp", (req, res) => {
    verify_reset_otp(req, res);
});

auth_route.post("/reset-password", (req, res) => {
    reset_password(req, res);
});

auth_route.post("/logout", (req, res) => {
    logout(req, res);
})

export default auth_route;