import mongoose from 'mongoose';
import "reflect-metadata";
import bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './inversify.config'; 
import * as env from 'dotenv'
import Database from './config/Database';
env.config()


const PORT = 3000;
// const MONGO_URI = 'mongodb+srv://kushal:kushal123@backenddb.yac2nn2.mongodb.net/Book_Managment';
const MONGO_URI = process.env.MONGO_URI;
// console.log(MONGO_URI);


let server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
});

let app = server.build()

const db = new Database(MONGO_URI); // Create an instance of the Database class
db.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});