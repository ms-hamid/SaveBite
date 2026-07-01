import { Router } from "express";
import { createPaymentHandler, createQris, handleMidtransCallback, checkPaymentStatusHandler } from "../controllers/payment.controller.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const payment_route = Router();

// payment_route.post(
//     "/payments/qris",
//     authenticate,
//     authorize("CUSTOMER"),
//     asyncHandler(createQris)
// );

payment_route.post(
    "/",
    authenticate,
    authorize("CUSTOMER"),
    asyncHandler(createPaymentHandler)
);

payment_route.post(
    "/midtrans/callback",
    asyncHandler(handleMidtransCallback)
);

payment_route.get(
    "/status/:order_public_id",
    authenticate,
    authorize("CUSTOMER"),
    asyncHandler(checkPaymentStatusHandler)
);


export default payment_route;