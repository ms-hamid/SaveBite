import { get_token, register_user } from "../services/auth.service.js";

export async function register(req, res) {
    try {
        const new_user = await register_user(req.body);
        return res.status(201).json({
            user: new_user,
            message: "Berhasil mendaftarkan akun"
        })
    } catch (e) {
        return res.status(500).json({
            error: e.message,
            message: "Internal Server Error"
        });
    }
}

export async function merchant_register(req, res) {
    try {
        const body = req.body;

        const new_user = await register_user(body, "MERCHANT");

        return res.status(201).json({
            message: "Berhasil mendaftarkan akun merhcant",
            user: new_user
        });

    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message
        });
    }
}

export async function login(req, res) {
    try {
        const token = await get_token(req.body);

        return res.status(200).json({
            token: token
        });
    } catch (e) {
        return res.status(500).json({
            error: e.message,
            message: "Internal Server Error"
        })
    }
}