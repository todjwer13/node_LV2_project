const express = require("express");
const router = express.Router();

const Comment = require("../schemas/comments.js");
const Post = require("../schemas/post.js");
const Users = require("../schemas/user");
const authMiddleware = require("../middleware/auth-middleware");

// 댓글 조회
router.get("/posts/:postId/comments", async (req, res) => {
  try{
    const { postId } = req.params;
    const comments = await Comment.find({postId}).sort({createdAt: -1});
    const getcomment = comments.map((item) =>{
      return {
        postId : item.postId,
        userId: item.userId,
        commentId: item._id,
        nickname: item.nickname,
        getcomment: item.comment,
        createdAt: item.createdAt,
      }
    })
    res.status(200).json({ getcomment });
  } catch (error) {
    return res.status(400).json({ errorMessage: "댓글 조회에 실패하였습니다."})
  }
  
});

// 댓글 작성
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, nickname } = res.locals.user;
    const { comment } = req.body;
  
    const date = new Date()
    const createdAt = date.valueOf();
  
    if(!comment) {
      return res.status(412).json({Message: "댓글을 입력해주세요."})
    }
  
    const createdComments = await Comment.create({ postId, userId, nickname, comment, createdAt });
  
    res.status(201).json({ createdComments, Message: "댓글을 작성하였습니다." });
  } catch (error) {
    return res.status(400).json({ createdComments, Message: "댓글 작성에 실패하였습니다." });
  }
  
});

// 댓글 수정
router.put("/posts/:postId/comments/:commentsId", authMiddleware, async (req, res) => {
  const { commentsId } = req.params;
  const { comment } = req.body;
  const { userId } = res.locals.user;
  const comments = await Comment.findById(commentsId);
  if (comments) {
    if (userId !== comments.userId) {
      res.status(400).json({ errorMessage: "수정 권한이 없습니다." });
    } else {
      await Comment.updateOne({ _id: commentsId }, { $set: { comment: comment, updatedAt: new Date() } });
      res.status(200).json({ success: true, Message: "댓글을 수정하였습니다." });
    }
  } else {
    res.status(400).json({ errorMessage: "댓글이 존재하지 않습니다." });
  }
});

// 댓글 삭제
router.delete("/posts/:postId/comments/:commentsId", authMiddleware, async(req,res) => {
  const { commentsId } = req.params;
  const { userId } = res.locals.user;
  const comment = await Comment.findById(commentsId);

  if (comment) {
    if (userId !== comment.userId) {
      res.status(400).json({ errorMessage: "삭제 권한이 없습니다." })
    } else {
      await Comment.deleteOne({_id : commentsId});
      res.status(200).json({success:true, Message: "댓글을 삭제하였습니다."});
    } 
  } else {
    res.status(400).json({ errorMessage: "댓글이 존재하지 않습니다." })
  }
});

module.exports = router;

