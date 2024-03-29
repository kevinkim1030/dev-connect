const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route         GET api/auth
// @description   Test route
// @access        Public
// router.get('/', (req, res) => res.send('Auth route'));
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route         POST api/auth
// @description   Authenticate user & get token
// @access        Public
router.post(
  '/', 
  [
    body('email', 'Please include a valid email')
      .isEmail(),
    body('password', 'Password is required')
      .exists()
  ], 
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      // If no user - send back an error
      if(!user){
        return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' }] });
      };

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })

      };
  

      // Return jsonwebtoken
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