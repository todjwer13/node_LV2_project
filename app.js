const express = require('express');
const app = express();
const port = 3000;


const postRouter = require("./routes/post");
const commentsRouter = require("./routes/comments.js")
const connect = require("./schemas/index");
connect();

app.use(express.json());
app.use("/", [postRouter, commentsRouter]);


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
