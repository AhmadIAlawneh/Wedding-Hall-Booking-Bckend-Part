const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const dataBase = require("./Database");
const userRoutes = require("./Routes/userRoute");
const hallRoutes = require("./Routes/hallRoute");
const ContactRoutes = require("./Routes/Contact");
const AutoFillRoutes = require("./Routes/AutoFill");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
db = new dataBase();
//creat post api to be able to booking hall.

// app.post('/hall',(request,response)=>{
// const body=request.body;
// console.log(body);
// response.send('thank for using api');
// });

// app.get('/hall',(req,res)=>{
// res.send();
// });
app.use(userRoutes);
app.use(hallRoutes);
app.use(ContactRoutes);
app.use(AutoFillRoutes);
const port = 8888;
app.listen(port, () => {
  console.log(`server has started in port ${port}`);
  db.connect();
});
