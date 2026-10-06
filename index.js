
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://abhi-api.vercel.app/docs";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/",async (req, res) => {
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