var express = require('express');
var router = express.Router();

// bring in project model
var Publication = require('../models/publication');

// user model
var User = require('../models/user');

var errors = "ab";
// change the value for add

router.get('/add', ensureAuthenicated, function(req, res){

    errors = "ab"

    res.render('add_content',{title: "Add Publication",
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
        res.render('add_content',{title:"Add Publication",
            errors: errors
        });
    }

    else{

        var publication = new Publication();
        publication.user_id = req.user._id;
        publication.title = req.body.title;
        publication.body = req.body.body;

        publication.save(function(err){
            if(err){

                console.log(err);
                return;
            }
            else{
                req.flash('success','Data Added');
                res.redirect('/publications');
            }
        });
    }
});


// for Edit the Particular val ue

router.get('/edit/:id', ensureAuthenicated, function(req,res){
    Publication.findById(req.params.id,function(err,publication){
       if(publication.user_id != req.user._id){
          req.flash('danger', 'Not Permission');
          res.redirect('/publications');
        }
        res.render("edit_content",{
            data: publication,
            title: "Update Publication"
        });
    });

});

// edit/update submitt rout

router.post('/edit/:id',function(req,res){
    var publication = {};
    publication.title = req.body.title;
    publication.body = req.body.body;


    var query = {_id:req.params.id};

    Publication.update(query, publication, function(err,publication){
        if(err){

            console.log(err);
            return;
        }
        else{
            req.flash('success','Data Updated');
            res.redirect('/publications');
        }

    });
});


// Delete By post


router.post('/delete/:id',function(req,res){

     var query = {_id:req.params.id};

      Publication.remove(query, function(err){
        if(err){

            console.log(err);
            return;
        }
        else{
          req.flash('success','Data Deleted');
            res.redirect('/publications');
        }

    });
});

// get one value and go for particular side

router.get('/:id',function(req,res){
    Publication.findById(req.params.id,function(err,publication){
       User.findById(publication.user_id, function(err, users){
         res.render("Single_Publication_Page",{
             data: publication,
             id: users
            });
       });
    });

});

// for See reserch Without login

router.get('/prof/:id', function(req,res){
    User.findById(req.params.id,function(err,user){
       Publication.find({}, function(err, publication){
         res.render("content",{
             content: publication,
             users: user,
             title: "Publication"
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
