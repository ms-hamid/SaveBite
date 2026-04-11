import express from "express";
import { auth_middleware, role_middleware } from "../../middlewares/auth.middleware.js";
import { create_order } from "../../controllers/order.controller.js";

const order_route = express.Router();

order_route.get("/", (req, res) => {

});

order_route.get("/:id", (req, res) => {

});

order_route.post("/", 
    auth_middleware, 
    role_middleware("CONSUMER"),
    create_order
);

order_route.delete("/:id", 
    auth_middleware,
    role_middleware("CONSUMER"),
    
);

order_route.patch("/:id", (req, res) => {

});



export default order_route;