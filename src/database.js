import mongoose from "mongoose";

mongoose.connect("mongodb+srv://nicogiusepetti888:coderhouse@cluster0.w876crb.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then( ()=> console.log("Conectado con exito."))
    .catch( (error)=> console.log("Ocurrió un error al conectar la db.", error))