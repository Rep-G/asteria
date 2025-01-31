import express from "express";
const app = express.Router();

app.get("/test", (req,res) => {
    return res.status(200).send("Hello world!");    
});
export default app;