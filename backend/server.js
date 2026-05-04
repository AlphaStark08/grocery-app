const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const SECRET = "quickbasket_secret";

// FILE PATH
const FILE = "users.json";

// LOAD USERS FROM FILE
let users = [];

if(fs.existsSync(FILE)){
const data = fs.readFileSync(FILE);
users = JSON.parse(data);
}

// SAVE USERS TO FILE
const saveUsers = ()=>{
fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
};

// SIGNUP
app.post("/signup", async (req,res)=>{

const {username,email,password} = req.body;

// check existing
const existing = users.find(u=>u.username===username);
if(existing){
return res.json({success:false,message:"User already exists"});
}

// hash password
const hashed = await bcrypt.hash(password,10);

// add user
users.push({
username,
email,
password:hashed
});

// save to file
saveUsers();

// debug log
console.log(users);

res.json({success:true,message:"Signup successful"});
});


// LOGIN
app.post("/login", async (req,res)=>{

const {username,password} = req.body;

const user = users.find(u=>u.username===username);

if(!user){
return res.json({success:false,message:"User not found"});
}

const match = await bcrypt.compare(password,user.password);

if(!match){
return res.json({success:false,message:"Wrong password"});
}

// create token
const token = jwt.sign(
{username:user.username},
SECRET,
{expiresIn:"1h"}
);

res.json({
success:true,
token,
username:user.username
});
});


// START SERVER
app.listen(PORT,()=>{
console.log("Server running on port 5000");
});