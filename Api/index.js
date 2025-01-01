/*const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User =require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const salt= bcrypt.genSaltSync(10);
const secret = 'asd4k5jkm3in9kmn3k2egke98pwmzdxqw';
const cookieparser =require('cookie-parser');

// these are middlewares below

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());    
app.use(cookieparser());
 mongoose.connect('mongodb+srv://blog:hwGcAEK2Hd4OAOXR@cluster0.kthbx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')



 // the post request and its functionalities


app.post('/register', async (req, res) => {
    const {username,password} = req.body;

    try{   const userDoc=await User.create({
        username,password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);}

    catch(e){
        res.status(400).json(e);
    }

 
});

app.post('/login',async(req,res)=>
{
    const {username,password}=req.body;

    // checking the current username with the username in the database

    const userDoc=await User.findOne({username});
    
    //checking the current password with the password of the matched username

    const passOk = bcrypt.compareSync(password,userDoc.password)
    if(passOk)
    {
        //logeed in
                // jspnwebtoken genration and cookies 
        jwt.sign({username,id:userDoc._id},secret,{}, (err,token) =>
        {
             if(err) throw err;

             // respose sending as a cookie(setting cookie)

             res.cookie('token',token).json('ok');
        });
    }

    else
    {
        res.status(400).json("wrong credentials");
    }
    
});

// This is an endpoint 
// for getting into a profile after getting logged in 

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.json(info);
    });
});


app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})

app.listen(8080, () => {
    console.log('API running on http://localhost:4000');
});



// hwGcAEK2Hd4OAOXR

// mongodb+srv://blog:hwGcAEK2Hd4OAOXR@cluster0.kthbx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

*/




const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
const secret = 'asd4k5jkm3in9kmn3k2egke98pwmzdxqw';
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));
  
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://blog:hwGcAEK2Hd4OAOXR@cluster0.kthbx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.findOne({username});
        if (!userDoc) {
            return res.status(400).json("User not found");
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({username, id: userDoc._id}, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token,{
                    httpOnly:true,
                    sameSite:'lax',
                    path:'/',
                    maxAge: 24 * 60 * 60 * 1000, 
                }).json({
                    id: userDoc._id,
                    username,
                });
            });
        } else {
            res.status(400).json("Wrong credentials");
        }
    } catch (err) {
        res.status(500).json("Internal server error");
    }
});

app.get('/profile', (req, res) => {
    console.log('cookies:',req.cookies);
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.json(info);
    });
}); 

app.post('/logout', (req, res) => {
    res.cookie('token', '', { 
        httpOnly: true,
        sameSite: 'lax',
        path:'/',
        expires: new Date(0) 
    }).json('ok');
});

app.listen(8080, () => {
    console.log('API running on http://localhost:8080');
});


















































