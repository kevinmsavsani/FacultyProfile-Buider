var express = require('express');
var app = express();
var dataFile = require('./data/data.json');
app.set('port', process.env.PORT || 3000);


app.use(require('./routers/friend'));
app.use(require('./routers/home'));

var Server = app.listen(app.get('port'), function(){
  console.log('listen to port '+app.get('port'));
});

//***************  home page ************
var express = require('express');
var route = express.Router();


route.get('/', function(req, res){
  res.send(`
    <h1>WELCOME TO MY HOME PAGE </h1>
    `);//remove extra ; for youtube tutorial );
});

module.exports = route;

//************ friend list **************
var express = require('express');                //  friend list
var dataFile = require('../data/data.json');
var route = express.Router();


route.get('/friend',function(req,res){

    var inf='';
    dataFile.friends.forEach(function(item){
        inf +=`
        <li>
        <h2>${item.title}</h2>
        <h2>${item.name}</h2>
        <h2>${item.dept}</h2>
        </li>
        <hr color = "red" /> `;
    });

    res.send(`<h1> Hi!! Every one </h1> ${inf}` );

});

route.get('/friend/:fid', function(req, res){
var friend = dataFile.friends[req.params.fid];// req is request not require
res.send(`
    <h1>WELCOME TO MY PERSONAL PAGE </h1>
    <h3>${friend.title}</h3>
    <h3>${friend.name}</h3>
    <h5>${friend.dept}</h3>`);
});


module.exports = route;

// ************ data.json file ************

{
  "friends": [{
    "title":"Best Friend",
    "name":"Savinay",
    "dept":"Cse"
    },
    {
      "title":"Best Friend",
      "name":"Sheru",
      "dept":"Civil"
    },
    {
      "title":"Me",
      "name":"Avinash",
      "dept":"Cse"
    }]

}
