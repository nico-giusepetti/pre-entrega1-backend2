import { Router } from "express";
import { CartManager } from "../dao/db/cart-manager-db.js"; 

const cartManager = new CartManager(); 

const router = Router();


//RUTAS:

//Metodo POST, para crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito(); 
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).send("Ocurrio un error.");
    }
})


//Metodo GET, para obtener carrito por ID 

router.get("/:cid", async (req, res) => {
    let cartId = (req.params.cid);

    try {
        const carrito = await cartManager.getCarritoById(cartId); 
        res.json(carrito.products); 
    } catch (error) {
        res.status(500).send("Ocurrio un error al obtener los productos del carrito."); 
    }
})


//Metodo POST, para agregar productos al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    let carritoId = (req.params.cid); 
    let productoId = req.params.pid; 
    let quantity = req.body.quantity || 1; 

    try {
        const actualizado = await cartManager.addProductToCart(carritoId, productoId, quantity); 
        res.json(actualizado.products); 
    } catch (error) {
        res.status(500).send("Ocurrio un error al agregar un producto.");
    }
})


// Método DELETE, para vaciar el carrito
router.delete("/:cid", async (req, res) => {
    let carritoId = req.params.cid;

    try {
        const carritoVaciado = await cartManager.vaciarCarrito(carritoId);
        if (carritoVaciado) {
            res.json({ message: "Carrito vacio." });
        } else {
            res.status(404).send("Carrito no encontrado.");
        }
    } catch (error) {
        res.status(500).send("Ocurrió un error al vaciar el carrito.");
    }
});


// Método DELETE, para eliminar un producto del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
    let carritoId = req.params.cid;
    let productoId = req.params.pid;

    try {
        const carritoActualizado = await cartManager.removeProductFromCart(carritoId, productoId);
        if (carritoActualizado) {
            res.json(carritoActualizado.products);
        } else {
            res.status(404).send("Carrito o producto no encontrado.");
        }
    } catch (error) {
        res.status(500).send("Ocurrió un error al eliminar el producto.");
    }
});



// Método PUT, para actualizar la cantidad de un producto en el carrito
router.put("/:cid/product/:pid", async (req, res) => {
    let carritoId = req.params.cid;
    let productoId = req.params.pid;
    let nuevaCantidad = req.body.quantity;

    try {
        // Validamos que nuevaCantidad sea un número positivo
        if (typeof nuevaCantidad !== 'number' || nuevaCantidad <= 0) {
            return res.status(400).send("Cantidad inválida.");
        }

        const carritoActualizado = await cartManager.updateProductQuantity(carritoId, productoId, nuevaCantidad);
        if (carritoActualizado) {
            res.json(carritoActualizado.products);
        } else {
            res.status(404).send("Carrito o producto no encontrado.");
        }
    } catch (error) {
        res.status(500).send("Ocurrió un error al actualizar la cantidad del producto.");
    }
});

export default router; 