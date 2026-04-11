import express from "express";
import { delete_listing, get_list_by_id, index_listing, insert_listing, update_listing } from "../../controllers/listing.controller.js";
import { auth_middleware, role_middleware } from "../../middlewares/auth.middleware.js";

const listing_route = express.Router();

listing_route.get("/", 
    auth_middleware,
    role_middleware("MERCHANT"),
    index_listing
);

listing_route.get("/:id", 
    auth_middleware,
    role_middleware("MERCHANT"),
    get_list_by_id
);

listing_route.post("/", 
    auth_middleware,
    role_middleware("MERCHANT"),    
    insert_listing
);

listing_route.patch("/:id", 
    auth_middleware,
    role_middleware("MERCHANT"),
    update_listing
);

listing_route.delete("/:id", 
    auth_middleware, 
    role_middleware("MERCHANT"), 
    delete_listing
);

export default listing_route;