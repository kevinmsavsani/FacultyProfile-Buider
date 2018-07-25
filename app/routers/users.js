var express = require('express');
var nl2br = require('nl2br');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// bring in user model
var User = require('../models/user');


//Resister Form

var errors = "ab";

router.get('/register', function(req,res) {

   errors = "ab";
    res.render('register',{errors: errors});
});

// register process

router.post('/register',function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const security = req.body.security;
  const contactNo = req.body.contactNo;
  const designation = req.body.designation;
  const department = req.body.department;
  const room = req.body.room;
  const linkedin = req.body.linkedin;
  const education = req.body.education;
  const research_interest = req.body.research_interest;
  const experience = req.body.experience;
  const facebookID = req.body.facebookID;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('security', 'Security Question is required').notEmpty();
  req.checkBody('contactNo', 'Contact Number is required').notEmpty();
  req.checkBody('contactNo', 'Invalid Contact Number').isMobilePhone("en-IN");
  req.checkBody('designation', 'Designation is required').notEmpty();
  req.checkBody('department', 'Department is required').notEmpty();
  req.checkBody('room', 'Room No. is required').notEmpty();
  req.checkBody('linkedin', 'Linkedin is required').notEmpty();
  req.checkBody('education', 'Education is required').notEmpty();
  req.checkBody('research_interest', 'Research Interest is required').notEmpty();
  req.checkBody('experience', 'Experience is required').notEmpty();
  req.checkBody('facebookID', 'facebookID is required').notEmpty();



    var errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    var newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password,
      security:security,
      contactNo:contactNo,
      designation:designation,
      department:department,
      room:room,
      linkedin:linkedin,
      education:education,
      research_interest:research_interest,
      experience:experience,
      facebookID:facebookID

    });


        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password,salt,function(err, hash){
                  if(err){
                    console.log(err);
                  }
                  newUser.password = hash;
                  newUser.save(function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    else{

                      req.flash('success','You are now rigistered and You can Login');
                      res.redirect('/users/login');
                    }
                  });

            });
        });
   }
});

errors = "ab";

router.get('/forgetpass', function(req,res) {

    res.render('forget',{users: null});
});

router.post('/forgetpass', function(req,res)
{
    var username = req.body.username;
    var Security = req.body.security;

    var query = {username:username};

    User.findOne(query, function(err, user){

        if(err) throw err;
        if(!user){
            req.flash('success','User Not Found');
            res.redirect('/users/forgetpass');

        }
        else{
            if(user.security != Security)
            {
                req.flash('success','Wrong Answer');
                res.redirect('/users/forgetpass');
            }
            else{
                errors = "ab";
                req.flash('success','Matching');
                res.render('password',{ user: user,errors: errors});
            }
        }
    });
});

// For Update Password

router.post('/forgetpass/:id',function(req,res){

    User.findById(req.params.id,function(err,users) {

        var user = {};
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

      errors = req.validationErrors();

      if(errors){
          res.render('password', {users:users,
              errors:errors
          });
      }
      else {

          user.password = req.body.password;
          var hash = bcrypt.hashSync(user.password, 10);
          user.password = hash;

          var query = {_id: req.params.id};
          User.update(query, user, function (err, user) {
              if (err) {
                  console.log(err);
                  return;
              }
              else {
                  req.flash('success', 'Password Reset Successfully');
                  res.redirect('/users/login');
              }

          });
        }
      });
});




router.get('/logout', function(req, res){
    req.logout();
  req.flash('success', 'You are Logged out');
   user = null;
  res.redirect('/users/login');
});

// Login Form




router.get('/login',function(req,res){
  res.render('login.ejs');

});

// Login process

router.post('/login', function(req, res, next){
    passport.authenticate('local',{

     successRedirect:'/prof',
     failureRedirect: '/users/login',
     failureFlash: true
   })(req, res, next);

});

router.get('/edit/:id', function(req, res){
    User.findById(req.params.id, function(err, user){
        User.find({}, function(err, users){
            res.render('Edit_Profile',{
                user:user
            });
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
    var user = {};
    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;
    user.contactNo = req.body.contactNo;
    user.designation = req.body.designation;
    user.department = req.body.department;
    user.room = req.body.room;
    user.linkedin = req.body.linkedin;
    user.education = req.body.education;
    user.research_interest = req.body.research_interest;
    user.experience = req.body.experience;
    user.facebookID = req.body.facebookID;


    var query = {_id:req.params.id}

    User.update(query, user, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            req.flash('success', 'User Updated');
            res.redirect('/prof');
        }
    });
});



// without login prof page

router.get('/:id',function(req,res){
    User.findById(req.params.id,function(err,user){
         res.render("profpage_without_login",{
             users: user
            });
       });
  });

//




module.exports = router;
