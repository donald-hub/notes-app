import express from "express";
import notesRoutes from "./src/routes/notesRoutes.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();

console.log("JWT Secret from env:", process.env.JWT_SECRET); // Debugging log
const corsOptions = {    
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200
}
//middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

//routes
app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);

//server
const port = process.env.PORT || 5001;

connectDB().then(() => {

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
}).catch((error) => {
    console.error("Failed to connect to the database", error);
    process.exit(1);
});

export default app;