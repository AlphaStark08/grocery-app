/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

import milk from "./images/milk.jpg";
import bread from "./images/bread.jpg";
import rice from "./images/rice.jpg";
import apple from "./images/apple.jpg";
import bananas from "./images/bananas.jpg";
import biscuits from "./images/biscuits.jpg";
import cheese from "./images/cheese.jpg";
import chicken from "./images/chicken.jpg";
import coffee from "./images/coffee.jpg";
import mango from "./images/mango.jpg";
import onions from "./images/onions.jpg";
import orangejuice from "./images/orange juice.jpg";
import pasta from "./images/pasta.jpg";
import potatoes from "./images/potatoes.jpg";
import soap from "./images/soap.jpg";
import spinach from "./images/spinach.jpg";
import tea from "./images/tea.jpg";
import tomatoes from "./images/tomatoes.jpg";
import yogurt from "./images/yogurt.jpg";
import eggs from "./images/download.jpg";

function App(){

// AUTH STATES
const [loggedIn,setLoggedIn]=useState(false);
const [isSignup,setIsSignup]=useState(false);
const [username,setUsername]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [confirmPassword,setConfirmPassword]=useState("");
const [error,setError]=useState("");

// UI STATES
const [dark,setDark]=useState(false);
const [search,setSearch]=useState("");
const [category,setCategory]=useState("All");
const [users,setUsers]=useState(1);

// CART
const [cart,setCart]=useState([]);
const [showCheckout,setShowCheckout]=useState(false);

// CHECKOUT
const [address,setAddress]=useState("");
const [payment,setPayment]=useState("UPI");
const [upiId,setUpiId]=useState("");
const [cardNumber,setCardNumber]=useState("");
const [cvv,setCvv]=useState("");

// SOCKET USERS
useEffect(()=>{
const socket=io("http://localhost:5000");
socket.on("userCount",(count)=>setUsers(count));
return ()=>socket.disconnect();
},[]);

// AUTO LOGIN
useEffect(()=>{
const token=localStorage.getItem("token");
if(token){
setLoggedIn(true);
}
},[]);


// AUTH FUNCTION
const handleAuth = async (e)=>{
e.preventDefault();
setError("");

if(isSignup){

const res = await fetch("http://localhost:5000/signup",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
email,
password
})
});

const data = await res.json();

if(data.success){
alert("Signup successful");
setIsSignup(false);
}else{
setError(data.message);
}

}else{

const res = await fetch("http://localhost:5000/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
password
})
});

const data = await res.json();

if(data.success){
localStorage.setItem("token",data.token);
localStorage.setItem("user",data.username);
setLoggedIn(true);
}else{
setError(data.message);
}

}

};


// LOGOUT
const logout=()=>{
localStorage.removeItem("token");
localStorage.removeItem("user");
setLoggedIn(false);
};


// PRODUCTS
const products=[
{id:1,name:"Milk",price:50,img:milk,category:"Dairy"},
{id:2,name:"Bread",price:30,img:bread,category:"Bakery"},
{id:3,name:"Rice",price:120,img:rice,category:"Staples"},
{id:4,name:"Apple",price:90,img:apple,category:"Fruits"},
{id:5,name:"Eggs",price:70,img:eggs,category:"Dairy"},
{id:6,name:"Tomatoes",price:40,img:tomatoes,category:"Vegetables"},
{id:7,name:"Bananas",price:60,img:bananas,category:"Fruits"},
{id:8,name:"Potatoes",price:45,img:potatoes,category:"Vegetables"},
{id:9,name:"Onions",price:55,img:onions,category:"Vegetables"},
{id:10,name:"Orange Juice",price:110,img:orangejuice,category:"Drinks"},
{id:11,name:"Chicken",price:240,img:chicken,category:"Meat"},
{id:12,name:"Cheese",price:180,img:cheese,category:"Dairy"},
{id:13,name:"Yogurt",price:65,img:yogurt,category:"Dairy"},
{id:14,name:"Mango",price:140,img:mango,category:"Fruits"},
{id:15,name:"Coffee",price:220,img:coffee,category:"Drinks"},
{id:16,name:"Tea",price:160,img:tea,category:"Drinks"},
{id:17,name:"Biscuits",price:35,img:biscuits,category:"Snacks"},
{id:18,name:"Pasta",price:95,img:pasta,category:"Staples"},
{id:19,name:"Spinach",price:45,img:spinach,category:"Vegetables"},
{id:20,name:"Soap",price:60,img:soap,category:"Essentials"}
];

// FILTER
const filtered=products.filter(item=>{
if(category!=="All" && item.category!==category) return false;
return item.name.toLowerCase().includes(search.toLowerCase());
});

// CART FUNCTIONS (MAX 5)
const addToCart=(product)=>{
const exists=cart.find(i=>i.id===product.id);

if(exists){
if(exists.qty >= 5){
alert("Maximum 5 items allowed");
return;
}
setCart(cart.map(i=>i.id===product.id ? {...i,qty:i.qty+1} : i));
}else{
setCart([...cart,{...product,qty:1}]);
}
};

const increase=id=>{
setCart(cart.map(i=>{
if(i.id===id){
if(i.qty >= 5){
alert("Max 5 reached");
return i;
}
return {...i,qty:i.qty+1};
}
return i;
}));
};

const decrease=id=>{
setCart(cart.map(i=>i.id===id ? {...i,qty:i.qty-1} : i).filter(i=>i.qty>0));
};

const total=cart.reduce((sum,i)=>sum+i.price*i.qty,0);


// LOGIN PAGE
if(!loggedIn){
return(
<div className="login-page">
<div className="login-box">

<h1>QuickBasket 🛒</h1>

<h2>{isSignup?"Signup":"Login"}</h2>

<form onSubmit={handleAuth}>

<input placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}/>

{isSignup &&
<input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
}

<input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>

{isSignup &&
<input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
}

<button type="submit">{isSignup?"Sign Up":"Login"}</button>

</form>

<p>
<button className="link-btn" onClick={()=>setIsSignup(!isSignup)}>
{isSignup?"Login":"Signup"}
</button>
</p>

{error && <p className="error">{error}</p>}

</div>
</div>
)
}


// MAIN UI
return(
<div className={dark?"dark app":"app"}>

<nav>
<h1>QuickBasket 🛒</h1>
<div>
<span>🟢 {users} Users</span>
<button onClick={()=>setDark(!dark)}>{dark?"☀":"🌙"}</button>
<button onClick={logout}>Logout</button>
</div>
</nav>


<div className="hero">
<h1>Groceries in 10 Minutes ⚡</h1>

<input
placeholder="Search..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<div className="categories">
<button onClick={()=>setCategory("All")}>All</button>
<button onClick={()=>setCategory("Fruits")}>Fruits</button>
<button onClick={()=>setCategory("Vegetables")}>Vegetables</button>
<button onClick={()=>setCategory("Dairy")}>Dairy</button>
<button onClick={()=>setCategory("Staples")}>Staples</button>
<button onClick={()=>setCategory("Drinks")}>Drinks</button>
</div>
</div>


<div className="main">

<div className="products">
{filtered.map(item=>(
<div className="card" key={item.id}>
<img src={item.img} alt={item.name} className="product-image"/>
<h2>{item.name}</h2>
<p>₹{item.price}</p>
<button onClick={()=>addToCart(item)}>Add To Cart</button>
</div>
))}
</div>


<div className="sidebar">
<h2>Cart</h2>

{cart.length===0 && <p>Empty</p>}

{cart.map(item=>(
<div key={item.id} className="cart-item">
<strong>{item.name}</strong>
<div>
<button onClick={()=>decrease(item.id)}>-</button>
<span>{item.qty}</span>
<button onClick={()=>increase(item.id)} disabled={item.qty>=5}>+</button>
</div>
<p>₹{item.qty*item.price}</p>
</div>
))}

<h2>Total ₹{total}</h2>

<button onClick={()=>setShowCheckout(true)}>
Checkout
</button>

</div>

</div>

</div>
)

}

export default App;