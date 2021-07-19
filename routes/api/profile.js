const express = require('express');
const router = express.Router();

//@route  Get api/profile/test 
//@desc   test profile
//@access Public 
router.get('/test', (req, res) => {
    res.json({messsage:"profile works"});
});


module.exports = router;