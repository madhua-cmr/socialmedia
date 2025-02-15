import { Users } from "../models/user.Model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

 const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; 

        if (!token) {
            return res.status(401).json({ error: "Unauthorized user" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const existUser = await Users.findById(decoded.userId).select("-password");

        if (!existUser) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = existUser;
        next();
    } catch (error) {
        console.log("Error in protectRoute", error.message);
        return res.status(500).json({ error: error.message });
    }
};


export default protectRoute;