/**
 * We load the ExpressJS module.
 * More than just a mere framework, it is also a complementary library
 * to itself.
 */
var express = require('express');

/**
 * Having that in mind, this is one of its robust feature, the Router.
 * You'll appreciate this when we hit RESTful API programming.
 * 
 * For more info, read this: https://expressjs.com/en/4x/api.html#router
 */
var router = express.Router();
var middle = require('../../lib/middle');

var id;
var tablename= "tbvehicle";

/**
 * If you can notice, there's nothing new here except we're declaring the
 * route using the router, and not using app.use().
 */

router.get('/', (req, res) => {
    /**
     * This is a TEMPORARY checker if you want to enable the database part of
     * the app or not. In the .env file, there should be an ENABLE_DATABASE field
     * there that should either be 'true' or 'false'.
     */
    if (typeof process.env.ENABLE_DATABASE !== 'undefined' && process.env.ENABLE_DATABASE === 'false') {
        /**
         * If the database part is disabled, then pass a blank array to the
         * render function.
         */
        return render([]);
    }

    /**
     * Import the database module that is located in the lib directory, under app.
     */
    var db = require('../../lib/database')();

    /**
     * If the database part is enabled, then use the database module to query
     * from the database specified in your .env file.
     */
    db.query('SELECT * FROM dogtbl', function (err, results, fields) {
        /**
         * Temporarily, if there are errors, send the error as is.
         */
        if (err) return res.send(err);

        /**
         * If there are no errors, pass the results (which is an array) to the
         * render function.
         */
        render(results);
    });

    function render(users) {
        res.render('home/views/index', { users: users });
    }
}); 

router.get('/mainpage', middle, (req, res) => {
    res.render('home/views/index');
});

router.post('/login', (req, res) => {
    console.log('Here @ POST request');
    res.send(req.body);
});


router.get('/search', middle, (req,res) =>{
    
    res.render('user/views/search');
});

router.post('/search', middle, (req, res) =>{
    var db = require('../../lib/database')();
    
    db.query(`SELECT * from \`${tablename}\` where \`plate_number\` = "${req.body.plate_number}"`, (err, results, fields) =>{
           
        //console.log(results[0].status);
            if (err) console.log(err);
        if (results[0].status == 0 || results[0].status == false){
            res.render('user/views/search');
        }
        else{
             id = results[0].id;
           // console.log("id" + id);
            render(results);
        }
           
             
        });
    
    function render(vehicle){
        res.render('user/views/update', {make: vehicle[0].make, model: vehicle[0].model, year: vehicle[0].year, plate_number: vehicle[0].plate_number, condition: vehicle[0].condition_ });
    }
    
});

router.get('/update', middle, (req,res) =>{
    var db = require('../../lib/database')();
    
    db.query(`SELECT * from \`${tablename}\` where \`id\` = ${id}`, (err, results, fields) =>{
           
        //console.log(results[0].status);
        if (err) console.log(err);
        if (results[0].status == 0 || results[0].status == false){
            res.render('user/views/search');
        }
        else{
             id = results[0].id;
           // console.log("id" + id);
            render(results);
        }
           
             
        });
    
    function render(vehicle){
        res.render('user/views/update', {make: vehicle[0].make, model: vehicle[0].model, year: vehicle[0].year, plate_number: vehicle[0].plate_number, condition: vehicle[0].condition_ });
    }
});

router.post('/update', middle, (req,res) =>{
    var db = require('../../lib/database')();
    
    //console.log(`${req.body.condition}`);
    if (req.body.condition.toLowerCase() == "brand new" || req.body.condition.toLowerCase() == "pre-owned"){
        db.query(`UPDATE \`${tablename}\` SET make = "${req.body.make}", model = "${req.body.model}", year = ${req.body.year}, plate_number = "${req.body.plate_number}", condition_ = "${req.body.condition}" WHERE id = ${id} `, (err, results, fields) => {
            console.log(fields);
            if (err) console.log(err);
            res.render('home/views/index');
        });
    }
    
    else{
        
        //console.log(id);
         db.query(`SELECT * from \`${tablename}\` where \`id\` = ${id}`, (err, results, fields) =>{
             if (err) console.log(err);
             render(results);
         });
           
       function render(vehicle){
        res.render('user/views/updateError', {make: vehicle[0].make, model: vehicle[0].model, year: vehicle[0].year, plate_number: vehicle[0].plate_number, condition: vehicle[0].condition_ });
       }
    }
});

// new

router.get('/delete', middle, (req, res) => {
	res.render('user/views/delete');
	});

router.post('/delete', middle, (req, res) => {

    var db = require('../../lib/database')();

 
    db.query(`UPDATE tbVehicle SET status=false WHERE plate_number= "${req.body.number}"`, function (err, results, fields) {
    //console.log(fields);
      
     if (err) console.log(err);
        
       res.render('home/views/index');
  
    });
});


router.get('/new', middle, (req, res) => {
    res.render('user/views/add');
});

router.post('/new', middle, (req, res) => {
    var db = require('../../lib/database')();
    
    //var str1 = req.body.condition1.toLowerCase();
    
    if (req.body.condition1.toLowerCase() == "brand new" || req.body.condition1.toLowerCase() == "pre-owned"){
        db.query(`INSERT INTO \`${tablename}\` (\`make\`, \`model\`,\`year\`, \`plate_number\`,\`condition_\`)  VALUES ("${req.body.make}", "${req.body.model}",${req.body.year}, "${req.body.plate_number}","${req.body.condition1}")`, (err, results, fields) => {
            if (err) console.log(err);
            res.render('home/views/index');
        });
    }
    
    else{
        res.render('user/views/addError');
    }
    
    
});

router.get('/list', middle, (req, res) =>{
    
    var db = require('../../lib/database')();
    db.query(`SELECT * FROM \`${tablename}\` where status <> 0`, function (err, results, fields) {
       console.log(results);
        if (err) return res.send(err);
        render(results);
    });

    function render(tbvehicle) {
        res.render('user/views/list', {vehicles: tbvehicle});
    }
    
    
    
});

router.get('/details', middle, (req,res) => {
    res.render('user/views/searchDetails');
});

router.post('/details', middle, (req, res) => {
    
    var db = require('../../lib/database')();
    db.query(`SELECT * FROM \`${tablename}\` WHERE plate_number = "${req.body.number}"`, function (err, results, fields) {
    
        if (results[0].status == 0) res.render('user/views/searchDetails');
        if (err) res.send(err);
        id = results[0].id;
        render(results);
    });

    function render(tbvehicle) {
        res.render('user/views/details', {vehicles: tbvehicle});
    }
    
    
});

/**
 * Here we just export said router on the 'index' property of this module.
 */
exports.users = router;