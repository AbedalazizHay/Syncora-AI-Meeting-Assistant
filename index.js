
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
let users=[];
let memberships=[];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function generateInviteCode() {
  return crypto.randomBytes(16).toString("hex");
}

app.get("/",(req,res)=>{
 res.render("partials/getStarted.ejs");

});
app.get("/signup",(req,res)=>{
 res.render("partials/signUp.ejs",{
  error: req.query.error
 });

})
app.post("/register",async(req,res)=>{
  try{
const email=req.body.userEmail;
const password= req.body.userPassword;
const leader= leaders.find(leader=>leader.leaderEmail===email);
if(leader){
  const checkPassword= await bcrypt.compare(
  password,
  leader.leaderPassword
)
if(!checkPassword){
   return res.redirect("/login?error=Invalid email or password.");

}
  return res.render("index.ejs");
   
}

const user = users.find(
      user => user.userEmail === email
    );

    if (!user) {
      return res.redirect("/login?error=invalid");
    }

    // Check the employee's password
    const passwordIsCorrect = await bcrypt.compare(
      password,
      user.userPassword
    );

    if (!passwordIsCorrect) {
      return res.redirect("/login?error=invalid");
    }

    return res.render("partials/user.ejs");

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
    res.redirect("/login")
} if (req.body.userRole==="user"){
  const invitaion= invitaions.find(invitaion=>invitaion.code===req.body.inviteCode);
  if(!invitaion||invitaion.revoked||invitaion.expiresAt <=Date.now()){
    return res.redirect("/signup?error=invalid-invitation")
  }
  const hashedPassword = await bcrypt.hash(req.body.userPassword, 12);
  const newUser={
    userId:crypto.randomUUID(),
    userName:req.body.userName,
    userEmail:req.body.userEmail,
    userRole:req.body.userRole,
    userPassword:hashedPassword,
  }

  const newMembership={
    userId:newUser.userId,
    teamId:invitaion.teamId,
    joinAt:Date.now()
  }
  users.push(newUser);
  memberships.push(newMembership);
  return res.redirect("/login");
}}catch (error) {
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