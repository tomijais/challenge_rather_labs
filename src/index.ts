import express from "express";
require('dotenv').config()

import { index } from "./routes";


const app = express();
const port = process.env.PORT || 8080;


// middleware to read body, parse it and place results in req.body
app.use(express.json());             // for application/json
app.use(express.urlencoded());       // for application/x-www-form-urlencoded



app.use("/", index);


app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
