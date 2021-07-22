const Validator = require('validator')
const isEmpty = require('../validation/is-empty');

module.exports = function validatePostInput(data) {
    let errors={};

    data.text = !isEmpty(data.text) ? data.text : '';


 

    if (!Validator.isLength(data.text, { min: 2, max: 300 })) {
     errors.text="Post must be between 2 and 300 characters"
 }  
 


  if (Validator.isEmpty(data.text)) {
         errors.text='text field required'
    }
  

   

 

 
    return {
        errors,
        isValid:isEmpty(errors)
}
}