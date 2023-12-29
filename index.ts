import express from 'express';
import cors from "cors";
import { environment } from "./utils/config"
import connectDB from './conn/db';
import { router as userRoutes } from "./routes/userRoutes";
import { router as productRoutes } from "./routes/productRoutes";
import { router as categoryRoutes } from "./routes/categoryRoutes";

const server = express();

//middlewares
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

//acceso a rutas
server.use("/", userRoutes);
server.use("/", productRoutes);
server.use("/", categoryRoutes);

//conexiones
let PORT = 3001;
if (environment.PORT) {
    PORT = parseInt(environment.PORT, 10);
};

let HOST = "0.0.0.0";
if (environment.HOST) {
    HOST = environment.HOST;
};

connectDB();
server.listen(PORT, HOST, () => {
    console.log(`%s listening at ${PORT}`);
});