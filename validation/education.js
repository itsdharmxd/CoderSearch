const Validator = require('validator')
const isEmpty = require('../validation/is-empty');

module.exports = function validateEducationInput(data) {
    let errors={};
//  console.log(data)
    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';

    data.from = !isEmpty(data.from) ? data.from : '';


    if (Validator.isEmpty(data.school)) {
    errors.school=' school is required'
} 
  if (Validator.isEmpty(data.degree)) {
    errors.degree=' degree is required'
    }
    
if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy=' fieldofstudy is required'
    }

if (Validator.isEmpty(data.from)) {
    errors.from='From date is required'
    }

   

 

 
    return {
        errors,
        isValid:isEmpty(errors)
}
}