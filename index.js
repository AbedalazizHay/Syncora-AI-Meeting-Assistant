
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import crypto from 'node:crypto';
import bcrypt from "bcryptjs";
const app = express();
const port = 3000;
const API_URL = "https://abhi-api.vercel.app/docs";
let leaders=[];
let teams=[];
let invitaions=[];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function generateInviteCode() {
  return crypto.randomBytes(16).toString("hex");
}

app.get("/",(req,res)=>{
 res.render("partials/getStarted.ejs");

});
app.get("/signup",(req,res)=>{
 res.render("partials/signUp.ejs");

})
app.post("/register",async(req,res)=>{
  try{
const email=req.body.userEmail;
const password= req.body.userPassword;
const leader= leaders.find(leader=>leader.leaderEmail===email);
if(!leader){
   return res.redirect("/login?error=Invalid email or password.");
   
}
const checkPassword= await bcrypt.compare(
  password,
  leader.leaderPassword
)
if(!checkPassword){
  return res.status(401).send("Invalid email or password.");

}

res.render("index.ejs");
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).send("Something went wrong. Please try again.");
  }
});


app.post("/login",async(req,res)=>{

  try{
  if (req.body.userRole==="leader"){

    
     const hashedPassword = await bcrypt.hash(
      req.body.userPassword,
      12
    );
  // create the leader account 
  const newLeader={
    leaderId:crypto.randomUUID(),
    leaderName:req.body.userName,
    leaderEmail:req.body.userEmail,
    leaderRole:req.body.userRole,
    leaderPassword:hashedPassword  
  }
// create create leader team
const newTeam= {
  teamId:crypto.randomUUID(),
  teamName:`${newLeader.leaderName}'s Team`,
  leaderId:newLeader.leaderId

}
// create an invitation for leader team 
const newInvitation= {
  code:generateInviteCode(),
  teamId: newTeam.teamId,
  expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  revoked:false,
  usedAt:null
}
  leaders.push(newLeader);
  teams.push(newTeam);
  invitaions.push(newInvitation);
  console.log("Leader registered:", newLeader.leaderEmail);
    console.log("Team created:", newTeam.teamName);

    // Temporary development output.
    // Later, show the invitation in the leader dashboard.
    console.log("Invitation code:", newInvitation.code);
}else{
  const newLeader={
    userName:req.body.userName,
    userEmail:req.body.userEmail,
    userRole:req.body.userRole,
    userPassword:req.body.userPassword,
    userId:crypto.randomUUID(),
    inviteCode:req.body.inviteCode,
  }
  users.push(userinfo);
  console.log(users);
}
 res.render("partials/logIn.ejs");
  }catch (error) {
    console.error("Leader signup failed:", error);
    return res.status(500).send("Registration failed.");
  }
});


app.get("/login",(req,res)=>{
  
 res.render("partials/logIn.ejs", {
  error: req.query.error
 });

})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});