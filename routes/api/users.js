const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');

// Bring in User model
const User = require('../../models/User');

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
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if(user){
        return res.status(400).json({ errors: [ { msg: 'User already exists' }] });
      }
  
      // Get users gravatar
      const avatar = gravatar.url(email, {
        // size, rating(pg), default
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });
  
      // Encrypt password (using bcryptjs)
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
  
      // Return jsonwebtoken
      // res.send('User registered');
      const payload = {
        user: {
          id: user.id
        }
      };
      
      // REMEMBER TO CHANGE EXPIRESIN TO 3600(1min)
      jwt.sign(
        payload, 
        config.get('jwtToken'),
        {expiresIn: 360000},
        (err, token) => {
          if(err) throw err;
          res.json({ token });
        }
      );

    } catch(err){
      console.error(err.message);
      res.status(500).send('Server error');
    }



  }
);

module.exports = router;