import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.js";
import tradeRoutes from "./routes/trades.js";
import journalRoutes from "./routes/journal.js"
import todoRoutes from "./routes/todo.js"



dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());


app.use("/api/auth",authRoutes);
app.use("/api/trades", tradeRoutes)
app.use("/api/journals", journalRoutes)
app.use("/api/todos", todoRoutes)





app.get("/", (req,res)=>{
    res.json({message:"trading journal api is running"});
    
})

const PORT = process.env.PORT || 5000

app.listen(PORT,() =>{
    console.log(`server running on port ${PORT}`);

})