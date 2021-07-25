const express = require('express');
const router = express.Router();
const User=require('../../models/User')
const gravatar = require('gravatar');
const bcrypt=require('bcryptjs')

const passport = require('passport');

const validateRegisterInput=require('../../validation/register')
const validateLoginInput=require('../../validation/login')
const isEmpty=require('../../validation/is-empty')

const jwt = require('jsonwebtoken');
const keys=require('../../config/keys')


//@route  Get api/users/test 
//@desc   test users
//@access Public 
router.get('/test', (req, res) => {
    res.json({messsage:"user works"});
});




//@route  Get api/users/register 
//@desc   Register users
//@access Public 
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
   
   
   
   
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            errors.email='Email already exist'
            return res.status(400).json(errors);
        } else {
            // const avatar = gravatar.url(req.body.email, {
            //     s: '200',
            //     r: 'pg',
            //     d:'mm'
            // })
            
  const avatar = !isEmpty(req.body.git)
         ? `https://avatars.githubusercontent.com/${req.body.git }?s=200`
         : `https://ui-avatars.com/api/?name=${req.body.name
             .replace(/\s\s+/g, ' ')
             .split(' ')
             .join('+')}&size=200`;

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
                
            });

            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then((user) => res.json(user))
                        .catch(err => console.log(err));
             })
        })

         }
     })
});


//@route  Get api/users/login
//@desc   Login users /return token
//@access Public
router.post('/login', (req, res) => {
   
       const { errors, isValid } = validateLoginInput(req.body)
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    
    
    const email = req.body.email;
    const password = req.body.password
    User.findOne({ email })
        .then(user => {
         //find user
            if (!user) {
                errors.email="email not found"
                res.status(404).json(errors);
                return
            }
            
         // password check
            bcrypt.compare(password, user.password).then(
                isMatch => {
                    if (isMatch) {
                    // user match    
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar:user.avatar 
                     }
                         
                         
                        
                   // sign token
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err,token) => {
                            res.json({
                                success: true,
                                token:'Bearer '+token
                            })
                             

                        });

                   //     res.json({msg:"Success"});
                    } else {
                        errors.password = "Incorrect password";
                        return res.status(400).json(errors);

                    }
                }
            )
  
 

        });
 

});



//@route  Get api/users/current
//@desc   return current user
//@access Private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    

    res.json( {
        id:req.user.id,
        name:req.user.name,
    } );
 


})





module.exports = router;