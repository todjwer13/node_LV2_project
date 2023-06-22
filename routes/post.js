const express = require("express");
const router = express.Router();

const Post = require("../schemas/post.js");
const authMiddleware = require("../middleware/auth-middleware");

// 전체 게시글 조회
router.get("/posts", async (req, res) => {
  try{
    const posts = await Post.find({}).sort({createdAt: -1});
    const getpost = posts.map((item) =>{
      return {
        postId: item._id,
        userId: item.userId,
        nickname: item.nickname,
        title: item.title,
        createdAt: item.createdAt,
      }
    })
    res.status(200).json({ getpost });
  } catch (error) {
    return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다."})
  }
  
});

// 게시글 작성
router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { userId, nickname } = res.locals.user;
  
    const date = new Date()
    let createdAt = date.valueOf();
  
    if (!title) return res.status(412).json({ Message: "게시글 제목을 입력해 주세요"});
    if (!content)return res.status(412).json({ Message: "게시글 내용을 입력해 주세요"});
    if (typeof title !== "string") return res.status(412).json({ Message: "게시글 제목의 형식이 일치하지 않습니다"});
    if (typeof content !== "string") return res.status(412).json({ Message: "게시글 내용의 형식이 일치하지 않습니다"});
  
  
    const createdPosts = await Post.create({ userId, nickname, title, content, createdAt });
  
    res.status(200).json({ createdPosts, Message: "게시글을 생성하였습니다." });
  } catch (error) {
    return res.status(400).json({ errorMessage: "게시글 작성 실패하였습니다."})
  }
  
});

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const posts = await Post.find({_id : postId});
    const post = posts.map((item) =>{
      return {
        postId: item._id,
        userId: item.userId,
        nickname: item.nickname,
        title: item.title,
        content: item.content,
        createdAt: item.createdAt,
      }
    })
    res.status(200).json({ post });
  } catch (error) {
    return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다."})
  }
  
});

// 게시글 수정
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const { userId } = res.locals.user;
//   const post = await Post.findById({_id: postId});
//   if (post) {
//     if (userId === post.userId) {
//       await Post.updateOne({ _id: postId }, { $set: { title, content } });
//       res.status(200).json({ success: true, message: "게시글을 수정하였습니다." });
//     } else { 
//       res.status(400).json({ Message: "게시글 수정 권한이 없습니다." });
//     }
//   } else {
//     res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
//   }
// });

try {
  const post = await Posts.find({ _id: postId });

  if (!post) return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
   else if (!title)  return res.status(412).json({errorMessage: "게시글 제목을 입력해 주세요"});
   else if (!content)  return res.status(412).json({errorMessage: "게시글 내용을 입력해 주세요"});
   else if (typeof title !== "string") return res.status(412).json({errorMessage: "게시글 제목의 형식이 일치하지 않습니다."});
   else if (typeof content !== "string") return res.status(412).json({errorMessage: "게시글 내용의 형식이 일치하지 않습니다."});
   else if (userId !== post.userId) return res.status(412).json({errorMessage: "게시글 수정권한이 없습니다."});
  

  await Post.updateOne( { userId, _id: postId },{ $set: {title, content}});
  res.json({ message: "게시글을 수정하였습니다." });
} catch (error) {
  return res.status(400).json({ errorMessage: "게시글 수정에 실패하였습니다." });}
});



// 게시글 삭제
router.delete("/posts/:postId", authMiddleware, async(req,res) => {
const { postId } = req.params;
  const { userId } = res.locals.user;
  const post = await Post.findById({_id: postId});
  if (post) {
    if (userId === post.userId) {
      await post.deleteOne({postId});
      res.status(200).json({ success: true, message: "게시글을 삭제하였습니"});
    } else { 
      res.status(400).json({ Message: "게시글 삭제 권한이 없습니다." });
    }
  } else {
    res.status(404).json({ errorMessage: "이미 삭제되었거나 게시글이 존재하지 않습니다." });
  }
});

module.exports = router;

