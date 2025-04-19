const express = require("express");

const app = express();

app.use('/test',(req,res)=>{
    res.send('hello test');
})

app.use((req,res)=>{
    res.send('hello gautam');
})

app.use('',(req,res)=>{
    res.send('hello ');
})

app.listen(3000, () => {
    console.log("New Express server running on port 3000");
});