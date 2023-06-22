const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const postRouter = require("./routes/post");
const commentsRouter = require("./routes/comments.js")
const usersRouter = require("./routes/users")
const connect = require("./schemas/index");
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", [postRouter, commentsRouter, usersRouter]);


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

