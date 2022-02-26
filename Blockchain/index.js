const express=require('express');
const bodyParser = require("body-parser");
let port=process.argv[3];
console.log(port);
let app=express();
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({ extended: true }));

require('./route/route')(app);
app.listen(port,()=>{
    console.log(`server start in port ${port}`);
});
