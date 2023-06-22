const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") return res.status(403).json({errorMessage: "로그인 후 이용 가능한 기능입니다."});

  try {
    const { userId } = jwt.verify(authToken, "nodeJS-secret-key");
    const user = await User.findById(userId);
    res.locals.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};