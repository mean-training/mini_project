const { check, validationResult} = require('express-validator/check');

const validateProjectCreate =  () => {
    return [ 
        check('name').trim().exists()
        .isAlphanumeric().withMessage('Project name must be alphanumeric')
        .isLength({min:2,max:20}).withMessage('Project name must be of min:2 and max:25 length'),
    ]   
}

const validateProjectUpdate  = () => {
    return [ 
        check('name').trim()
        .isAlphanumeric().withMessage('Project name must be alphanumeric')
        .isLength({min:2,max:20}).withMessage('Project name must be of min:2 and max:25 length'),
    ] 
}

const errorHandler = (req, res, next) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
        return res.status(422).json({error:true,errors: extractedErrors})
    }
    return next();
}


module.exports = {
    validateProjectCreate,
    validateProjectUpdate,
    errorHandler
}