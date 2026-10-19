
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import crypto from 'node:crypto';
import bcrypt from "bcryptjs";
import { time } from "node:console";

const app = express();
const port = 3000;
const API_URL = "https://world-time-api3.p.rapidapi.com";
const apiKey= "3fa141cf96msh01118868d31b9e9p1ca6fdjsn088d03b6891a";

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
 res.render("getStarted.ejs");

});
app.get("/signup",(req,res)=>{
 res.render("signUp.ejs",{
  error: req.query.error
 });

});
app.get("/login",(req,res)=>{
  
 res.render("logIn.ejs", {
  error: req.query.error
 });

});

app.get("/leaderPage/:leaderId",async(req,res)=>{
  try{
  
  const responseIp= await axios.get(API_URL+"/ip",{
      headers: {    
        'x-rapidapi-key': apiKey,
      },
    });
  const result= responseIp.data;
  const timezone=result.timezone;
  const currentTime = result.datetime;
  const responseLocation= await axios.get(API_URL+"/geo",{
      headers: {    
        'x-rapidapi-key': apiKey,
      },
    });
  const resultLocation= responseLocation.data;
  const countryName = resultLocation.country.name;
  const response= await axios.get(API_URL+"/timezone",{
  headers:{
     'x-rapidapi-key': apiKey,
  }
  });
  const allTimezones = response.data;
  const leader= leaders.find(leader=>leader.leaderId===req.params.leaderId);
  console.log(leader);
  if(!leader){
    return res.status(404).send("leader not found ");
  }
  const team= teams.find(team=>team.leaderId===leader.leaderId);
  if(!team){
    return res.status(404).send("team not found");
  }
  console.log(team);
  const invitation= invitaions.find(invitation=>
    invitation.teamId===team.teamId &&
    !invitation.revoked &&
    invitation.expiresAt > Date.now()  
  );
  console.log (invitation);
  const employeeCount=memberships.filter(membership=>membership.teamId===team.teamId).length;

  res.render("leader.ejs", {
  leader,
  team,
  invitation,
  employeeCount,
  time:currentTime,
  timezone:timezone,
  country:countryName,
  timezones:allTimezones
 });
  }catch (error) {
    console.error("fialed", error);
    return res.status(500).send("Something went wrong. Please try again.");
  }
});

// app.get("/get-all-timezones",async(req,res)=>{
//   try{
// const response= await axios.get(API_URL+"/timezone",{
//   headers:{
//      'x-rapidapi-key': apiKey,
//   }
// }) 

// console.log(result);
// res.render("partials/timezoneWidget.ejs",{
//   timezones:result
// });
//   }catch(error){
//     console.error("faild to make request:"+error.message);
//     res.render("partials/timezoneWidget.ejs",
//     {
//       error:error.message
//     });
//   }

// });

app.post("/register",async(req,res)=>{
  try{
const email=req.body.userEmail;
const password= req.body.userPassword;
const leader= leaders.find(leader=>leader.leaderEmail===email);
console.log(leader);
if(leader){
  const checkPassword= await bcrypt.compare(
  password,
  leader.leaderPassword
)
if(!checkPassword){
   return res.redirect("/login?error=Invalid email or password.");

}
  return res.redirect(`/leaderPage/${leader.leaderId}`);
   
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

    return res.render("user.ejs");

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


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});