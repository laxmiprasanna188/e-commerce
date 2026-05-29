import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing"
            });
        }

        // 2. Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format (must be Bearer token)"
            });
        }

        // 3. Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        // 4. Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // 5. Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 6. Attach user to request
        req.user = user;
        req.id = user._id;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export const isAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.role === "admin") {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "Access denied: admins only"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};