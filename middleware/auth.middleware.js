const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
    if (req.method === "OPTION") {
        return next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Пользователь не авторизован" });
        }

        const decoder = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoder;
        next();    
    } catch (err) {
        res.status(401).json({ message: "Пользователь не авторизован" });
    }
}
