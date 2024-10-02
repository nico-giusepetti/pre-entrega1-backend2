import {CartModel} from "../models/cart.model.js";

class CartManager {

    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Ocuriio un error al crear carrito");
            return null;
        }
    }

    //Obtener un carrito por id:
    async getCarritoById(carritoId) {
        try {
            const carritoBuscado = await CartModel.findById(carritoId).populate('products.product');
            if (!carritoBuscado) {
                console.log("No existe el carrito buscado.");
                return null;
            }
            return carritoBuscado;
        } catch (error) {
            console.log("Ocurrió un error al obtener el carrito por id");
            throw error;
        }
    }

    //Agregar productos al carrito: 
    async addProductToCart(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productoId);
            //si el producto ya existe actualizamos cantidad
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productoId, quantity });
            }

            //Marcamos la propiedad "products" como modificada antes de guardarla: 
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Ocurrió un error al agregar producto");
            throw error;
        }
    }

    //Vaciar el carrito:
    async vaciarCarrito(carritoId) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            if (!carrito) {
                console.log("Carrito no encontrado.");
                return null;
            }
            // Vaciamos el carrito y guardamos
            carrito.products = []; 
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Ocurrió un error al vaciar el carrito.");
            throw error;
        }
    }

    //Eliminar un producto del carrito:
    async removeProductFromCart(carritoId, productoId) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            if (!carrito) {
                console.log("Carrito no encontrado.");
                return null;
            }

            // Encontrar el índice del producto a eliminar
            const index = carrito.products.findIndex(item => item.product._id.toString() === productoId);
            
            // Si el producto existe, lo eliminamos del carrito
            if (index !== -1) {
                carrito.products.splice(index, 1);
                carrito.markModified("products");
                await carrito.save();
                return carrito;
            } else {
                console.log("Producto no encontrado en el carrito.");
                return null;
            }
        } catch (error) {
            console.log("Ocurrió un error al eliminar el producto.");
            throw error;
        }
    }


    // Actualizar cantidad de un producto en el carrito:
    async updateProductQuantity(carritoId, productoId, nuevaCantidad) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            if (!carrito) {
                console.log("Carrito no encontrado.");
                return null;
            }

            const existeProducto = carrito.products.find(item => item.product._id.toString() === productoId);
            
            if (existeProducto) {
                existeProducto.quantity = nuevaCantidad;
                carrito.markModified("products");
                await carrito.save();
                return carrito;
            } else {
                console.log("Producto no encontrado en el carrito.");
                return null;
            }
        } catch (error) {
            console.log("Ocurrió un error al actualizar la cantidad del producto.");
            throw error;
        }
    }

}

export {CartManager}; 