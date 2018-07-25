var express = require('express');
var router = express.Router();

// bring in project model
var studata = require('../models/student');

// user model
var User = require('../models/user');

var errors = "ab";
// change the value for add

router.get('/add', ensureAuthenicated, function(req, res){

    errors = "ab"

    res.render('add_data',{
        errors: errors
    });
});

// Add submitt rout

router.post('/add', function(req,res){

  //  req.checkBody('name','Name Required').notEmpty();
    req.checkBody('dept','Dept Required').notEmpty();

    // get error

    errors = req.validationErrors();


    if(errors){
        res.render('add_data',{
            errors: errors
        });
    }

    else{

        var ndata = new studata();
        ndata.name = req.user._id;
        ndata.Name = req.user.name;
        ndata.dept = req.body.dept;
        ndata.title = req.body.title;
        ndata.save(function(err){
            if(err){

                console.log(err);
                return;
            }
            else{
                req.flash('success','Data Added');
                res.redirect('/');
            }
        });
    }
});


// for Edit the Particular value

router.get('/edit/:id', ensureAuthenicated, function(req,res){
    studata.findById(req.params.id,function(err,data){
      if(data.name != req.user._id){
         req.flash('danger', 'Not Permission');
        res.redirect('/');
      }
        res.render("edit_data",{
            data: data
        });
    });

});

// edit/update submitt rout

router.post('/edit/:id',function(req,res){
    var ndata = {};
    ndata.Name = req.body.name;
    ndata.dept = req.body.dept;
    ndata.title = req.body.title;

    var query = {_id:req.params.id};

    studata.update(query, ndata, function(err,ndata){
        if(err){

            console.log(err);
            return;
        }
        else{
            req.flash('success','Data Updated');
            res.redirect('/');
        }

    });
});


// Delete By post


router.post('/delete/:id',function(req,res){

     var query = {_id:req.params.id};

      studata.remove(query, function(err){
        if(err){

            console.log(err);
            return;
        }
        else{
            res.redirect('/');
        }

    });
});

// get one value and go for particular side

router.get('/:id',function(req,res){
    studata.findById(req.params.id,function(err,data){
       User.findById(data.name, function(err, user){
         res.render("index3",{
             data: data,
             name: user.name
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


// DElete Data

router.delete('/name/:id', function(req,res) {

    var query = {_id:req.params.id};

    Article.remove(query, function(err) {
        if(err){
            console.log(err);

        }
        res.send('Success');
    });

});

module.exports = router;
