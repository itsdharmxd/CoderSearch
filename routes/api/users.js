const express = require('express');
const router = express.Router();

//@route  Get api/userss/test 
//@desc   test users
//@access Public 
router.get('/test', (req, res) => {
    res.json({messsage:"user works"});
});


module.exports = router;