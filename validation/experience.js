const Validator = require('validator')
const isEmpty = require('../validation/is-empty');

module.exports = function validateExperienceInput(data) {
    let errors={};
  // /console.log(data)
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    if (Validator.isEmpty(data.title)) {
    errors.title='job title is required'
} 
  if (Validator.isEmpty(data.company)) {
    errors.company='job company is required'
    }
    
if (Validator.isEmpty(data.from)) {
    errors.from='From date is required'
    }

   

 

 
    return {
        errors,
        isValid:isEmpty(errors)
}
}