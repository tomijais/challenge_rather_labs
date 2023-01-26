import express from "express";
require('dotenv').config()

import { index } from "./routes";


const app = express();
const port = process.env.PORT || 8080; // default port to listen


// middleware to read body, parse it and place results in req.body
app.use(express.json());             // for application/json
app.use(express.urlencoded());       // for application/x-www-form-urlencoded



// define a route handler for the default home page

app.use("/", index);


// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
