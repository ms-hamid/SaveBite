import express from "express";
import { login, merchant_register, register } from "../controllers/auth.controller.js";

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



export default auth_route;