import express from "express"
import productRouter from "./Routes/products.router.js"; 
import cartRouter from "./Routes/carts.router.js";
import viewRouter from "./Routes/views.router.js";
import userRouter from "./Routes/user.router.js";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import passport from "passport";


import exphbs from "express-handlebars";
import { Server } from "socket.io";
import { ProductManager } from "./dao/db/product-manager-db.js";
import {CartManager} from "./dao/db/cart-manager-db.js";

import "./database.js";


const productManager = new ProductManager()
const cartManager = new CartManager ();


const app = express()
const PUERTO = 8080

// Configuracion de express-handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(express.json()); //Para enviar informacion en formato JSON
app.use(express.urlencoded({ extended: true })); //Para recibir datos multiples
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(passport.initialize()); 
initializePassport(); 


//Listen
const httpServer = app.listen(PUERTO, (req, res)=>{
    console.log("Escuchando en el puerto 8080")
})


// Websocket
const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("conectadooo");

    const productos = await productManager.getProducts({limit:100});
    socket.emit("productos", productos);

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        
        io.sockets.emit("productos", await productManager.getProducts({limit:100}))
    });

    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        io.sockets.emit("productos", await productManager.getProducts({limit:100}))
    });

})



//Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewRouter);
app.use("/api/sessions/", userRouter)



