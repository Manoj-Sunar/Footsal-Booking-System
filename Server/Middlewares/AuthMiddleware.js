import jwt from "jsonwebtoken";


export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header (format: Bearer <token>)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ status: false, message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

    // Attach user info to req.user
    req.user = decoded;
    

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};
