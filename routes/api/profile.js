const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route         GET api/profile
// @description   Test route
// @access        Public
// router.get('/', (req, res) => res.send('Profile route'));

// @route         GET api/profile/me
// @description   Get current user profile
// @access        Private
// Check for errors
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if(!profile){
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route         POST api/profile
// @description   Create or update user profile
// @access        Private
// Check for body errors
router.post('/',
[ auth, 
  [
    body('status', 'Status is required')
      .not()
      .isEmpty(),
    body('skills', 'Skills is required')
      .not()
      .isEmpty()
  ]
], 
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // pull all fields out
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(status) profileFields.status = status;
  if(githubusername) profileFields.githubusername = githubusername;
  if(skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  // Build social object
  profileFields.social = {}
  if(youtube) profileFields.social.youtube = youtube;
  if(twitter) profileFields.social.twitter = twitter;
  if(facebook) profileFields.social.facebook = facebook;
  if(linkedin) profileFields.social.linkedin = linkedin;
  if(instagram) profileFields.social.instagram = youtube;
  
  // Look for profile of logged in user
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if(profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id }, 
        { $set: profileFields }, 
        { new: true }
      );

      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    return res.json(profile);

  } catch(err) {
    console.err(err.message);
    res.status(500).send('Server error');
  }
  res.send('SKILLS');

});

// @route         GET api/profile
// @description   Get all profiles
// @access        Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route         GET api/profile/user/:user_id
// @description   Get profile by user ID
// @access        Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

    if(!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json( { msg: 'Profile not found' })
    }
    res.status(500).send('Server Error');
  }
});

// @route         DELETE api/profile
// @description   Delete profile, user & posts
// @access        Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove( { user: req.user.id });
    // Remove user
    await User.findOneAndRemove( { _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route         PUT api/profile/experience
// @description   Add profile experience
// @access        Private
router.put(
  '/experience', 
    [
      auth, 
      [
      body('title', 'Title is required')
        .not()
        .isEmpty(),
      body('company', 'Company is required')
        .not()
        .isEmpty(),
      body('from', 'From date is required')
        .not()
        .isEmpty()
      ]
    ], 
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    // Deal with mongoDB

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.experience.unshift(newExp);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error')
  }
});


// @route         DELETE api/profile/experience/:exp_id
// @description   Delete experience from profile
// @access        Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience.map(exp => exp.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route         PUT api/profile/education
// @description   Add profile education
// @access        Private
router.put(
  '/education', 
    [
      auth, 
      [
      body('school', 'School is required')
        .not()
        .isEmpty(),
      body('degree', 'Degree is required')
        .not()
        .isEmpty(),
      body('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
      body('from', 'From date is required')
        .not()
        .isEmpty()
      ]
    ], 
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    // Deal with mongoDB

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education.unshift(newEdu);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error')
  }
});


// @route         DELETE api/profile/education/:edu_id
// @description   Delete education from profile
// @access        Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route         Get api/profile/github/:username
// @description   Get user repos from Github
// @access        Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubToken')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(options, (error, response, body) => {
      if(error) console.error(error);

      if(response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})



module.exports = router;