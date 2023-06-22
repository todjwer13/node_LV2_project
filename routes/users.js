const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../schemas/user");

// 회원가입 API
router.post("/signup", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  // const regExp1 = /[^A-Za-z0-9]/gi ;
  // if(/[^A-Za-z0-9]{3,}$/gi.test(nickname)) return res.status(412).json({ errorMessage: "nickname값은 3자 이상 영어 또는 숫자로 입력해주세요"})
  // if(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/.test(password)) return res.status(412).json({ errorMessage: "password값은 4자 이상 영어 또는 숫자로 입력해주세요"})
  
  if (!/^[a-z]+[a-z0-9]{3,16}$/g.test(nickname)) return res.status(412).json({ errorMessage: 'nickname값은 영문자로 시작하는 영문자 또는 숫자 3~16자를 입력해 주세요.' });
  if (!/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\-_=+]).{4,16}$/.test(password)) return res.status(412).json({ errorMessage: 'password값은 4~16자 영문, 숫자, 특수문자를 최소 한가지씩 조합해서 입력해 주세요.' });

  const existsUsers = await User.findOne({ nickname });
  if(existsUsers) return res.status(412).json({ errorMessage: "닉네임이 이미 사용중입니다." });
  if(password !== confirmPassword) return res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." });

  const user = new User({ nickname, password });
  await user.save();

  res.status(201).json({ message: "회원 가입에 성공하였습니다." });
})

// 로그인 API
router.post("/login", async (req,res) => {
  const { nickname, password } = req.body;

  const user = await User.findOne({ nickname });

  if (!user || password !== user.password) return res.status(400).json({errorMessage: "닉네임 또는 패스워드가 틀렸습니다."});

  const token = jwt.sign(
    { userId: user.userId },
    "nodeJS-secret-key",
  );

	res.cookie("Authorization", `Bearer ${token}`); 
  res.status(200).json({ token }); 
})

module.exports = router;