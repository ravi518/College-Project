//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mysql=require("mysql2");
const alert=require("alert");

var idd;
const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

const pool=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"Shashwat123@",
  database:"usersecrets",
});

pool.connect((err)=>{
  if(err){
    console.log(err);
  }
  else
  {
    console.log("My SQL Connected...");
  }
})

let sql="SELECT * FROM secrets;";

pool.execute(sql,function(err,result){
  if(err)
  console.log(err);
  else
  {
    result.forEach((res)=>{
      console.log(res.email);
    })
  }
});

app.get("/",function(req,res){
  res.render("home");
})
app.get("/login",function(req,res){
  res.render("login");
})

app.get("/register",function(req,res){
  res.render("register");
})

app.get("/submit",function(req,res){
  res.render("submit");
})

app.get("/secrets",function(req,res){
  let sqq="SELECT * FROM secrets;";

  pool.execute(sqq,function(err,result){
    if(err)
    console.log(err);
    else
    {
      // result.forEach((res)=>{
      //   console.log(res.email);
      // })
      res.render("secrets",{userWithSecrets:result});
    }
  });
})


app.post("/register",function(req,res){
  let newUser=`INSERT INTO secrets( email,password)
             VALUES("${req.body.username}","${req.body.password}")`;
     pool.query(newUser, function (err, result) {
       if (err) throw err;
       res.redirect("secrets");
       //console.log("1 record inserted");
     });
});

app.post("/login",function(req,res){
      let oldUse=`SELECT * FROM secrets WHERE email ="${req.body.username}" AND password ="${req.body.password}"`;
      pool.execute(oldUse,function(err,result){
        result.forEach((res)=>{
          idd=res.id;
           resemail=res.email;
           respassword=res.password;
        })

        if(resemail==req.body.username && respassword==req.body.password)
        {
          res.redirect("secrets");
          console.log(idd);

        }
        else
        {
          alert("your email id and password doesn't match");
          console.log(err);}
      });

});

app.get("/logout",function(req,res){
  res.redirect("/");
});

app.post("/submit",function(req,res){
  const submittedSecret=req.body.secret;
  console.log(submittedSecret);
  console.log(idd);
  let emai,psl;
//  const userwhosubmitted=idd;
  let searchById=`SELECT * FROM secrets WHERE id="${idd}"`
  pool.execute(searchById,function(err,result){
    result.forEach((res)=>{
       emai=res.email;
       psl=res.psl;
    })

    let newUseri=`INSERT INTO secrets(email,password,secretss)
               VALUES("${emai}","${psl}","${req.body.secret}")`;
       pool.query(newUseri, function (err, result) {
         if (err) throw err;
         res.redirect("secrets");
         //console.log("1 record inserted");
       });
    // console.log(result);
    // result.forEach((res)=>{
    //    res.secretss=submittedSecret;
    // })
    // res.redirect("secrets")
    // console.log(result);
  })
})




app.listen(3000,function(){
  console.log("Server Started on port 3000");
})
