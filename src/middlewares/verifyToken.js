import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // console.log(req)
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded?.id, role: decoded?.role };

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
