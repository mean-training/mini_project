const { check, validationResult} = require('express-validator/check');

const validateTaskCreate =  () => {
    return [ 
        check('title').trim().exists()
        .isAlphanumeric().withMessage('Task name must be alphanumeric')
        .isLength({min:2,max:200}).withMessage('Task must be of min:2 and max:25 length'),
        check('priority').trim().isIn(['low', 'medium','high']).withMessage('Priority must be in low, medium, high'),
        check('due_date').exists().isDate().withMessage('Due date must be a valid date')
    ]   
}

const validateEmailArray = () => {
    return [ 
        check('email').isArray({ min: 1 }).withMessage("Email must be an array"),
        check("email.*").not().isArray().isEmail().withMessage("Input must be a valid email")
    ]
}

const validateTaskUpdate  = () => {
    return [ 
        check('title').trim().isAlphanumeric().withMessage('Task name must be alphanumeric')
        .isLength({min:2,max:200}).withMessage('Task must be of min:2 and max:25 length'),
        check('priority').trim().isIn(['low', 'medium','high']).withMessage('Priority must be in low, medium, high'),
        check('due_date').isDate().withMessage('Due date must be a valid date')
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
    validateTaskCreate,
    validateEmailArray,
    validateTaskUpdate,
    errorHandler
}