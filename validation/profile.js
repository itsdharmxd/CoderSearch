const Validator = require('validator')
const isEmpty = require('../validation/is-empty');

module.exports = function validateProfileInput(data) {
    let errors={};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
        errors.handle = 'Handle needs to be  between 2 and 40 character';
     }
     if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Handle is require';
     }
     if (Validator.isEmpty(data.status)) {
        errors.status = 'status is require';
     }
  
         if (Validator.isEmpty(data.skills)) {
        errors.skills = 'skills is require';
     }

    
    if (!isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website='Not a URL'
        }
    }
     if (!isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube='Not a URL'
        }
    }
    if (!isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter='Not a URL'
        }
    }
    if (!isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook='Not a URL'
        }
    }
    if (!isEmpty(data.linkedin)) {
        if (!Validator.isURL(data.linkedin)) {
            errors.linkedin='Not a URL'
        }
    }
     
    if (!isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram='Not a URL'
        }
    } 
    
 
 
    return {
        errors,
        isValid:isEmpty(errors)
}
}