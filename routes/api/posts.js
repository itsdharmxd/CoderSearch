const express = require('express');
const router = express.Router();

//@route  Get api/posts/test 
//@desc   test post
//@access Public 
router.get('/test', (req, res) => {
    res.json({messsage:"posts works"});
});


module.exports = router;