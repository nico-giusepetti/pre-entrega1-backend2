import { promises as fs } from 'fs'

class CartManager {
    constructor(path) {
        this.path = path; 
        this.carts = []; 
        this.cargarCarritos(); 
    }

    //Metodos reutilizables 
    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8"); 
            this.carts = JSON.parse(data); 

        } catch (error) {
            console.log("Error al cargar los carritos desde el archivo", error);
            //Si no existe el archivo, se crea. 
            await this.guardarCarritos(); 
        }
    }
    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2)); 
    }


    //Metodo para crear carrito 
    async createNewCart(){

        //Verificamos cual es el ultimo id, para luego autoincrementarlo
        const ultimoId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;

        const nuevoCarrito = {
            id: ultimoId +1,
            products: []
        }

        this.carts.push(nuevoCarrito); 

        await this.guardarCarritos(); 
        return nuevoCarrito; 
    }

    //Metodo para obtener un carrito por su ID
    async getCartById(carritoId) {
        try {
            const carrito = this.carts.find(cart => cart.id === carritoId); 

            if( !carrito ) {
                throw new Error("No existe un carrito con ese id"); 
            }

            return carrito; 
        } catch (error) {
            console.log("Error al obtener el carrito por id"); 
            throw error; 
        }
    }

    //Metodo para agregar producto al carrito 
    async addProductToCart(carritoId, productoId, quantity = 1) {
        const carrito = await this.getCartById(carritoId); 
        const existeProducto = carrito.products.find(p => p.product === productoId);

        if(existeProducto) {
            existeProducto.quantity += quantity; 
        } else {
            carrito.products.push({product: productoId, quantity});
        }

        await this.guardarCarritos();
        return carrito; 
    }
}


export {CartManager}