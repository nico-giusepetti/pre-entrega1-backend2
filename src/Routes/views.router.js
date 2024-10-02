import { Router } from "express"
import { ProductManager } from "../dao/db/product-manager-db.js"
import { CartManager } from "../dao/db/cart-manager-db.js"

const router = Router()
const productManager = new ProductManager()
const cartManager = new CartManager();

// Ruta para mostarar el listado actual de productos
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const nuevoArray = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return rest;
        });

        res.render("home", {
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages
        });

    } catch (error) {
        console.error("Ocurrió un error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Ocurrió un error en el servidor"
        });
    }
})

// Ruta que muestra los productos en tiempo real
router.get("/realTimeProducts", (req, res) => {
    res.render("realTimeProducts");
})


//Ruta para los carritos de compra segun su ID
router.get("/carts/:cid", async (req, res) => {
    const carritoId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(carritoId);

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
            quantity: item.quantity
        }));


        res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//ruta de inicio de sesion
router.get("/login", (req, res) => {
    res.render("login")
})

//ruta del registro
router.get("/register", (req, res) => {
    res.render("register")
})




export default router; 