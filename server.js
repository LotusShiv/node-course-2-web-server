const express = require('express');
//using handlebarsjs view engine
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

//make a new express app - no args needed
var app = express();

//support for partials Register partials
hbs.registerPartials(__dirname + '/views/partials');

//Set express related configurations
app.set('view engine', 'hbs');

// //1.
// //Express middleware which serves up the page to webserver without us 
// // explicitly configuring
// app.use(express.static(__dirname + '/public'));
//register hbs helper functions
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
    //return 'test';
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
}); 

//2. will be 1.
//explore middleware 
//static middleware
app.use((req, res, next) => {
    //next exists so you can tell Express, 
    //when the middle ware is done
    //e.g. log something, call db
    //without next() - app will not continue to run and no handlers
    //get fired
    //say we add a logger
    var now = new Date().toString();
    var log =`Now ${now}: ${req.method}, ${req.url}`;

    console.log(log);
    //after this the other handlers etc., will proceed
    fs.appendFile('server.log', log + '\n', (err) =>{
        if(err){
            console.log('Unable to append to server.log');
        }
    });
    next();

});

//If we comment the maintenance we will be back to help and
//about, home working as usual
// //3. will be 2.
// app.use((req, res, next) => {
//     //Note: There is no difference between the response.render
//     // in a request handler - a Get handler below in a), b) or c)
//     // and here in the Axios middleware call
//     res.render('maintenance.hbs', {
//         pageTitle: 'Maintenance page'
//     });
//     //Goes nowhere after this since we haven't called the next()
// });

//re-order as
//1. will be 3.
//Express middleware which serves up the page to webserver without us 
// explicitly configuring
app.use(express.static(__dirname + '/public'));

//setup http route handlers
// a) / - root of the application 
app.get('/', (request, response) => {
    //request -  headers, body, method, path etc., associated with the request
    //send the response back
    //response.send('<h1>Hello Express!</h1>');
    //json
    // response.send({
    //     name: 'Jon',
    //     likes: [
    //         'Reading', 'Sports'
    //     ]
    // });

    response.render('home.hbs', {
        welcomeMessage: 'Welcome visitor',
        pageTitle: 'Home page'
    });
});

//more routes
//b) About -- request handler
app.get('/about', (req, res) => {
    //res.send('About page');
    //instead render any template that we have set up with hbs

    res.render('about.hbs', {
        pageTitle: 'About page'
    });
});

//c) Assignment
app.get('/bad', (req, res) =>{
    res.send({
        errorMessage:'Unable to handle request',
        code: 400,
        message: 'Bad Request'
    });
});

//app.listen binds our application to a port on the machine
//This will listen never really finish 
//and will wait until for e.g. you respond with say a ctrl c
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
