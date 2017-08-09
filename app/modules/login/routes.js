var express = require('express');
var router = express.Router();
var app = express();

var middleware = require('../../lib/login');

router.get('/', (req,res) => {
    
     if (typeof process.env.ENABLE_DATABASE !== 'undefined' && process.env.ENABLE_DATABASE === 'false') {
        
        res.render("cannot connect to database");
    }
    
    res.render('login/views/form');

});
    
    
router.post('/home', middleware, (req,res) =>{
    res.render('home/views/index');
});

exports.login = router;

