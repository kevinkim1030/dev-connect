const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator')

// @route         GET api/users
// @description   Test route
// @access        Public
// router.get('/', (req, res) => res.send('Users route'));

// @route         POST api/users
// @description   Register user
// @access        Public
router.post(
  '/', 
  [
    body('name', 'Name is required')
      .not()
      .isEmpty(),
    body('email', 'Please include a valid email')
      .isEmail(),
    body('password', 'Please enter a password with 6 or more characters')
      .isLength({min:6})
  ], 
  (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }

    

    // See if user exists

    // Get users gravatar

    // Encrypt password (using bcryptjs)

    // Return jsonwebtoken


    res.send('Users route');
  }
);

module.exports = router;