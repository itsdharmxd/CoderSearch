const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile= require('../../models/Profile')

const validatePostInput=require('../../validation/post')

//@route  Get api/posts/test 
//@desc   test post
//@access Public 
router.get('/test', (req, res) => {
    res.json({messsage:"posts works"});
});

//@route  post api/posts 
//@desc   get post
//@access Public


router.get('/', (req, res) => {
    
     Post.find()
     .sort({date:-1})
        .then(posts => res.json(posts))
    .catch(err=>res.status(404).json(err))
})
//@route  post api/posts/:id 
//@desc   get post
//@access Public

router.get('/:id', (req, res) => {
    
     Post.findById(req.params.id)
        .then(post => res.json(post))
    .catch(err=>res.status(404).json({nopostfound:"no post found"}))
})





//@route  post api/posts 
//@desc   create post
//@access Private 


router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
 
   const {errors,isValid}=validatePostInput(req.body)
  

    if (!isValid) {
       return res.status(400).json(errors)
   }  
     
     
    
  
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    })
    
    newPost.save().then(post => res.json(post));

})

//@route  delete api/posts/:id 
//@desc   delete post
//@access Private


router.delete('/:id', passport.authenticate('jwt', { session: false }),
    (req, res) => {
      
        Profile.findOne({ user: req.params.id })
            .then(profile => {
                Post.findById(req.params.id).then(post => {
                    if (post.user.toString() !== req.user.id) {
                return res.status(401).json({notauthorize:"User not  authorize"})
                    }
            
                    post.remove().then(() => res.json({
                        success:true
                    }))
                    .catch(err=>res.status(404).json({postnotfound:"post not found"}))
  

            })
        })

  }
)


//@route  post api/posts/like/:id 
//@desc   like post
//@access Private


router.post('/like/:id', passport.authenticate('jwt', { session: false }),
    (req, res) => {
      
        Profile.findOne({ user: req.params.id })
            .then(profile => {
                Post.findById(req.params.id).then(post => {
             
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyliked: 'user already like this post' });
             }
                    post.likes.unshift({ user: req.user.id })
                    post.save().then(post=>res.json(post))
            })
            })
            .catch(err => res.status(404).json({ postnotfound: "post not found" }))

  }
)

//@route  post api/posts/unlike/:id 
//@desc   unlike post
//@access Private


router.post('/unlike/:id', passport.authenticate('jwt', { session: false }),
    (req, res) => {
      
        Profile.findOne({ user: req.params.id })
            .then(profile => {
                Post.findById(req.params.id).then(post => {
             
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({ notliked: 'you have not like' });
                    }
                    
                    const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
                    post.likes.splice(removeIndex, 1);
                    post.save().then().then(post=>res.json(post))
                })
            })
                    .catch(err => res.status(404).json({ postnotfound: "post not found" }))


  }
)


//@route  post api/posts/comment:id 
//@desc   add comment
//@access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    const { errors, isValid } = validatePostInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
     
    
     
    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user:req.user.id 

    }       
            post.comments.unshift(newComment);
            post.save().then(post => res.json(post));

        })
    .catch(err=>res.status(404).json({postnotfound:"post not fonnd  "}))
 

})



//@route  Delete api/posts/comment:id 
//@desc   delete comment
//@access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
     
    Post.findById(req.params.id)
        .then(post => {
            if (post.comments.filter(comment => comment._id.toString()===req.params.comment_id).length===0) {
              return res.status(404).json({commentnotexist:'comment not exist'})
            }
            
            const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id)
            
            post.comments.splice(removeIndex, 1);
            
            post.save().then(post=>res.json(post))

          
        })
    .catch(err=>res.status(404).json({postnotfound:"post not fonnd  "}))
 

})


module.exports = router;