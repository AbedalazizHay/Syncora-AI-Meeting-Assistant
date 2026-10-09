
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://abhi-api.vercel.app/docs";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/",(req,res)=>{
 res.render("partials/getStarted.ejs");

});
app.get("/signup",(req,res)=>{
 res.render("partials/signUp.ejs");

})

app.post("/dashboared",(req,res)=>{
  console.log(req.body);
 res.render("index.ejs");

})

app.get("/home",async (req, res) => {
    try {
    const result = await axios.get(API_URL);
    console.log(result.data);
    res.render("index.ejs", { avatar: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { avatar: JSON.stringify(error.response.data) });
  }
    
  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});