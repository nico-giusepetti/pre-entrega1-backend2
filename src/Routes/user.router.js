import { Router } from "express"
import UserModel from "../dao/models/users.model.js"
import jwt from "jsonwebtoken"
import passport from "passport"
import { createHash, isValidPassword } from "../utils/util.js"
import {CartModel} from "../dao/models/cart.model.js"

const router = Router()

//RUTAS

//Registro
router.post("/register", async (req, res) => {
    let { usuario, password, first_name, last_name, age, email} = req.body;

    try {
        //Validacion de usuario
        const existeUser = await UserModel.findOne({ usuario })

        if (existeUser) {
            return res.status(400).send("Usuario Existente")
        }

        //Creo el carrito
        const nuevoCarrito = new CartModel();
        await nuevoCarrito.save()

        //Creo el usuario
        const nuevoUsuario = new UserModel({
            usuario,
            first_name,
            last_name,
            age,
            email,
            cart: nuevoCarrito._id,
            password: createHash(password)
        });

        await nuevoUsuario.save();

        const token = jwt.sign({ usuario: nuevoUsuario.usuario, first_name: nuevoUsuario.first_name, last_name: nuevoUsuario.last_name, age: nuevoUsuario.age, email: nuevoUsuario.email }, "coderhouse", { expiresIn: "1h" })

        //Generamos Cookie
        res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true })

        res.redirect("/api/sessions/current")

    } catch (error) {
        res.status(500).send("Ocurrio un error en el servidor al registrar")
    }
})


//Login
router.post("/login", async(req, res)=>{
    let {usuario, password} = req.body;

    try{
        //Buscamos el usuario
        const usuarioEncontrado = await UserModel.findOne({usuario});
        
        if(!usuarioEncontrado){
            return res.status(401).send("Usuario no valido.")
        }

        //Validamos contraseña
        if(!isValidPassword(password, usuarioEncontrado)){
            return res.status(401).send("Contraseña incorrecta. Intente nuevamente.")
        }

        //Generamos token
        const token = jwt.sign({usuario: usuarioEncontrado.usuario, first_name: usuarioEncontrado.first_name, last_name: usuarioEncontrado.last_name, age: usuarioEncontrado.age, email: usuarioEncontrado.email, rol: usuarioEncontrado.rol}, "coderhouse", {expiresIn: "1h"})

        //Generamos Cookie
        res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true})

        //Redirigimos
        res.redirect("/api/sessions/current")

    }catch (error){
        res.status(500).send("Ocurrio un error en el servidor.")
    }

})

router.get("/current", passport.authenticate("current", {session: false}), (req,res)=>{
    res.render("profile", {usuario: req.user.usuario})
})

//Logout
router.post("/logout", (req,res)=>{
    //Limpiamos la COOKIE
    res.clearCookie("coderCookieToken")
    res.redirect("/login")
}) 

//Admin
router.get("/admin", passport.authenticate("current", {session:false}) ,(req,res)=>{
    //Verifica si el usuario es administrador
    if(req.user.rol !=="admin"){
        return res.status(403).send("ACCESO DENEGADO, necesitas un rol superior.")
    }
    
    //Si es admin, renderizamos la vista 
    res.render("admin", {usuario: req.user.usuario})
})


export default router;