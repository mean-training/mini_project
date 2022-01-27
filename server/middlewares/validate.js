const { check, validationResult} = require('express-validator/check');

const validateEmployeeSetup =  () => {
    return [ 
        check('first_name').trim().exists()
        .isAlphanumeric().withMessage('First name must be alphanumeric')
        .isLength({min:2,max:25}).withMessage('First name must be of min:2 and max:25 length'),
        check('last_name', 'Last name is required').exists(),
        check('password').exists().isLength({ min:6, max:10 }).withMessage('password must be of min:6 and max:25 chars long')
        .matches(/^[a-z0-9]+$/i).withMessage('password must be  alphanumeric')
    ]   
}

const validateEmailArray = () => {
    return [ 
        check('email').isArray({ min: 1 }).withMessage("Email must be an array"),
        check("email.*").not().isArray().isEmail().withMessage("Input must be a valid email")
    ]
}

const validateEmployeeUpdate  = () => {
    return [ 
        check('first_name').trim()
        .isAlphanumeric().withMessage('First name must be alphanumeric')
        .isLength({min:2,max:25}).withMessage('First name must be of min:2 and max:25 length'),
        check('last_name').trim().exists()
        .isAlphanumeric().withMessage('First name must be alphanumeric')
        .isLength({min:2,max:25}).withMessage('First name must be of min:2 and max:25 length'),
        check('password').isLength({ min:6, max:10 }).withMessage('password must be of min:6 and max:25 chars long')
        .matches(/^[a-z0-9]+$/i).withMessage('password must be  alphanumeric')
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
    validateEmployeeSetup,
    validateEmailArray,
    validateEmployeeUpdate,
    errorHandler
}