var express = require('express');
var router = express.Router();

// bring in project model
var Research = require('../models/research');

// user model
var User = require('../models/user');

var errors = "ab";
// change the value for add

router.get('/add', ensureAuthenicated, function(req, res){

    errors = "ab"

    res.render('add_content',{title: "Add Research",
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
        res.render('add_content',{title:"Add Research",
            errors: errors
        });
    }

    else{

        var research = new Research();
        research.user_id = req.user._id;
        research.title = req.body.title;
        research.body = req.body.body;

        research.save(function(err){
            if(err){

                console.log(err);
                return;
            }
            else{
                req.flash('success','Data Added');
                res.redirect('/researchs');
            }
        });
    }
});


// for Edit the Particular val ue

router.get('/edit/:id', ensureAuthenicated, function(req,res){
    Research.findById(req.params.id,function(err,research){
       if(research.user_id != req.user._id){
          req.flash('danger', 'Not Permission');
          res.redirect('/researchs');
        }
        res.render("edit_content",{
            data: research,
            title: "Update Research"
        });
    });

});

// edit/update submitt rout

router.post('/edit/:id',function(req,res){
    var research = {};
    research.title = req.body.title;
    research.body = req.body.body;


    var query = {_id:req.params.id};

    Research.update(query, research, function(err,research){
        if(err){

            console.log(err);
            return;
        }
        else{
            req.flash('success','Data Updated');
            res.redirect('/researchs');
        }

    });
});


// Delete By post


router.post('/delete/:id',function(req,res){

     var query = {_id:req.params.id};

      Research.remove(query, function(err){
        if(err){

            console.log(err);
            return;
        }
        else{
          req.flash('success','Data Deleted');
            res.redirect('/researchs');
        }

    });
});

// get one value and go for particular side

router.get('/:id',function(req,res){
    Research.findById(req.params.id,function(err,research){
       User.findById(research.user_id, function(err, users){
         res.render("Single_Research_Page",{
             data: research,
             id: users
            });
       });
    });

});

// for See reserch Without login

router.get('/prof/:id', function(req,res){
    User.findById(req.params.id,function(err,user){
       Research.find({}, function(err, research){
         res.render("content",{
             content: research,
             users: user,
             title: "Researches"
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
