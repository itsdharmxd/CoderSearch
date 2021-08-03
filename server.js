const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path =require('path')


const app = express();



const db = require('./config/keys').mongoURI
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())




const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');



// passport middleware

app.use(passport.initialize());

require('./config/passport.js')(passport);




//routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);






mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(() => console.log("DB connected")).catch(err => console.log(err));


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}



const port = process.env.PORT||5000;

app.listen(port,()=>console.log(`server running on port ${port}`))