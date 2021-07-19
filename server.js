const express = require('express');
const mongoose = require('mongoose');
const app = express();
const db=require('./config/keys').mongoURI


const posts = require('./routes/api/posts');
const profie = require('./routes/api/profile');
const users = require('./routes/api/users');






app.get('/', (req, res) => res.send('Hello'));

app.use('/api/users', users);
app.use('/api/profile', profie);
app.use('/api/posts', posts);






mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(() => console.log("DB connected")).catch(err => console.log(err));





const port = process.env.PORT||5000;

app.listen(port,()=>console.log(`server running on port ${port}`))