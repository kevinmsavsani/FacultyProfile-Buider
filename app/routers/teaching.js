var express = require('express');
var router = express.Router();

// bring in project model
var Teaching = require('../models/teaching');

// user model
var User = require('../models/user');

var errors = "ab";
// change the value for add

router.get('/add', ensureAuthenicated, function(req, res){

    errors = "ab"

    res.render('add_content',{title: "Add Teaching",
        errors: errors
    });
});

// Add submitt rout

router.post('/add', function(req,res){

    req.checkBody('title','Title is Required').notEmpty();
    req.checkBody('body','Body is Required').notEmpty();

    // get error

    errors = req.validationErrors();


    if(errors){
        res.render('add_content',{title:"Add Teaching",
            errors: errors
        });
    }

    else{

        var teaching = new Teaching();
        teaching.user_id = req.user._id;
        teaching.title = req.body.title;
        teaching.body = req.body.body;

        teaching.save(function(err){
            if(err){

                console.log(err);
                return;
            }
            else{
                req.flash('success','Data Added');
                res.redirect('/teachings');
            }
        });
    }
});


// for Edit the Particular val ue

router.get('/edit/:id', ensureAuthenicated, function(req,res){
    Teaching.findById(req.params.id,function(err,teaching){
       if(teaching.user_id != req.user._id){
          req.flash('danger', 'Not Permission');
          res.redirect('/teachings');
        }
        res.render("edit_content",{
            data: teaching,
            title: "Update Teaching"
        });
    });

});

// edit/update submitt rout

router.post('/edit/:id',function(req,res){
    var teaching = {};
    teaching.title = req.body.title;
    teaching.body = req.body.body;


    var query = {_id:req.params.id};

    Teaching.update(query, teaching, function(err,teaching){
        if(err){

            console.log(err);
            return;
        }
        else{
            req.flash('success','Data Updated');
            res.redirect('/teachings');
        }

    });
});


// Delete By post


router.post('/delete/:id',function(req,res){

     var query = {_id:req.params.id};

      Teaching.remove(query, function(err){
        if(err){

            console.log(err);
            return;
        }
        else{
          req.flash('success','Data Deleted');
            res.redirect('/teachings');
        }

    });
});

// get one value and go for particular side

router.get('/:id',function(req,res){
    Teaching.findById(req.params.id,function(err,teaching){
       User.findById(teaching.user_id, function(err, users){
         res.render("Single_Teaching_Page",{
             data: teaching,
             id: users
            });
       });
    });

});

// for See reserch Without login

router.get('/prof/:id', function(req,res){
    User.findById(req.params.id,function(err,user){
       Teaching.find({}, function(err, teaching){
         res.render("content",{
             content: teaching,
             users: user,
             title: "Teaching"
            });
       });
    });

});

// ensure authenication

function ensureAuthenicated(req, res, next){
 if(req.isAuthenticated()){

   return next();
 }
 else{
   req.flash('danger','Please Login First');
   res.redirect('/users/login');
 }
}




module.exports = router;
