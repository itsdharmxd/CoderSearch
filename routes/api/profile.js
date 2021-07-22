const express = require('express');
const router = express.Router();
const mongoose =require('passport')
const passport=require('passport')

const Profile =require('../../models/Profile')
const User =require('../../models/User')

const validateProfileInput=require('../../validation/profile')
const validateExperienceInput=require('../../validation/experience')
const validateEducationInput=require('../../validation/education')


//@route  Get api/profile/test 
//@desc   test profile
//@access Public 
router.get('/test', (req, res) => {
    res.json({messsage:"profile works"});
});



//@route  Get api/profile
//@desc   get current user profile
//@access Private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
     
    const errors = {};

     
    
    Profile.findOne({ user: req.user.id })
        .populate('user',['name','avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "their is no profile of this user";
                return res.status(404).json(errors);
            }
            res.json(profile);
  

   }).catch(err=>res.status(404).json(err)) 
 

})



//@route  get api/profile/all
//@desc   get all profile 
//@access Public


router.get('/all', (req, res) => {
   
     const errors={}

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
        
            if (!profiles) {
                errors.noprofile = 'there are no profile';
                return res.status(404).json(errors);
       }
 
     res.json(profiles)
              
        })
    .catch(err=>res.status(404).json({profiles:"there are no profiles"}))




         
})










//@route  get api/profile/handle
//@desc   get profile by handle
//@access Public

router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for the user'
              return  res.status(404).json(errors)
            }
            
            res.json(profile);

        })
        .catch(err => res.status(404).json(err));
    
 
 
 
});




//@route  get api/profile/user/:user_id
//@desc   get profile by handle
//@access Public

router.get('/user/:user_id', (req, res) => {

    const errors={}

    Profile.findOne({ user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for the user'
             return   res.status(404).json(errors)
            }
            
            res.json(profile);

        })
        .catch(err => res.status(404).json({profile:"No profile of this uder"}));
    
 
 
 
});







//@route  Post api/profile
//@desc   create or edit user profile
//@access Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
     
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
 

    
    
    const profileFields = {};
    profileFields.user = req.user.id
     
     if(req.body.handle)profileFields.handle=req.body.handle
     if(req.body.company)profileFields.company=req.body.company
     if(req.body.website)profileFields.website=req.body.website
     if(req.body.location)profileFields.location=req.body.location
     if(req.body.bio)profileFields.bio=req.body.bio
     if(req.body.status)profileFields.status=req.body.status
     if(req.body.githubusername)profileFields.githubusername=req.body.githubusername
    
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
     }
    
    profileFields.social={}
     if (req.body.youtube) profileFields.social.youtube = req.body.youtube
     if (req.body.twitter) profileFields.social.twitter = req.body.twitter
     if (req.body.facebook) profileFields.social.facebook = req.body.facebook
     if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
     if (req.body.instagram) profileFields.social.instagram = req.body.instagram

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                .then(profile=>res.json(profile))
            } else {
               
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if (profile) {
                            errors.handle = 'That handle already exist';
                            res.status(400).json(errors);
                            return;
                        }
                      new Profile(profileFields).save().then(profile=>res.json(profile))                        

                })

        }
    })
 
     
    

})


//@route  get api/profile/experience
//@desc   add experience
//@access Private

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.body)
    
 
    const {errors,isValid}=validateExperienceInput(req.body)
  
    if (!isValid) {
        return res.status(400).json(errors)
    }
 
  
  
  
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description:req.body.description
        }     
   
            profile.experience.unshift(newExp)
            
            profile.save().then(profile=>res.json(profile))

    })
 

})


//@route  get api/profile/education
//@desc   add education
//@access Private

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    
 
    const {errors,isValid}=validateEducationInput(req.body)
      
    if (!isValid) {
        return res.status(400).json(errors)
    }
 
  
  
  
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description:req.body.description
        }     
   
            profile.education.unshift(newEdu)
            
            profile.save().then(profile=>res.json(profile))

    })
 

})

//@route  delete api/profile/experience/:exp_id
//@desc   delete expericence
//@access Private

router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
 
 
 
  
  //console.log(req.user)
  
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            

             removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);
            profile.experience.splice(removeIndex, 1);
             
            profile.save().then(profile => res.json(profile));
    }).catch(err=>res.status(404).json(err))
 

})




//@route  delete api/profile/education/:edu_id
//@desc   delete education
//@access Private

router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
 
 
 
  
  //console.log(req.user)
  
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            

             removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.edu_id);
            profile.education.splice(removeIndex, 1);
             
            profile.save().then(profile => res.json(profile));
    }).catch(err=>res.status(404).json(err))
 

})

//@route  delete api/profile/
//@desc   delete user
//@access Private


router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    
 
 
    Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            
            User.findOneAndRemove({ _id: req.user.id })
                .then(()=>res.json({success:true}))
 
 

        })
  
  
   

})


module.exports = router;