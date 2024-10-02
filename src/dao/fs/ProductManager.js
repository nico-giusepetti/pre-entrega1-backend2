import { promises as fs } from 'fs'

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
        this.cargarArray(); 
    }

    //Metodo para agregar producto
    async addProduct({title, description, code, price, status, stock, category, thumbnails}) {

        //Validamos
        if (!title || !description || !price || !code || !stock || !category) {
            console.log("Todos estos campos son obligatorios. (thumbnails es opcional)");
            return;
        }

        //Validamos que el codigo sea unico. 
        if (this.products.some(item => item.code === code)) {
            console.log("El codigo debe ser unico.");
            return;
        }

        //Verificamos cual es el ultimo id, para luego autoincrementarlo
        const ultimoId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;

        //Creamos el nuevo producto: 
        const nuevoProducto = {
            id: ultimoId + 1,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        }

        //Lo agrego al array: 
        this.products.push(nuevoProducto);

        //Lo guardamos en un archivo: 
        await this.guardarArchivo(this.products)
    }


    //Metodos reutilizables
    async leerArchivo() {
        const respuesta = await fs.readFile(this.path, "utf-8");
        const arrayProductos = await JSON.parse(respuesta);
        return arrayProductos;
    }

    async guardarArchivo(arrayProductos) {
        await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
    }

    async cargarArray() {
        try {
            this.products = await this.leerArchivo();
        } catch (error) {
            console.log("Error al inicializar ProductManager");
        }
    }


    //Metodo para obtener los productos
    async getProducts() {
        try {
            const nuevoArray = await this.leerArchivo();
            return nuevoArray;
        } catch (error) {
            console.log("Ocurrió un error al obtener los productos", error);
        }
    }

    //Metodo para obtener producto por id
    async getProductById(id)  {
        try{
            const arrayProductos = await this.leerArchivo();
            const productoBuscado = arrayProductos.find(item => item.id === id);

            if (!productoBuscado) {
                console.log("Producto no encontrado.");
                return null;
            } else {
                console.log("Producto encontrado. ")
                return productoBuscado;
            }
        }catch (error){
            console.log("Ocurrió un error al obtener un producto por id", error);
        } 
    }


    //Metodo actualizar producto
    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo(); 

            const indexProducto = arrayProductos.findIndex( item => item.id === id); 

            if(indexProducto !== -1) {
                arrayProductos[indexProducto] = {...arrayProductos[indexProducto], ...productoActualizado} ; 
                await this.guardarArchivo(arrayProductos); 
                console.log("Producto actualizado"); 
            } else {
                console.log("No se encuentra el producto"); 
            }
        } catch (error) {
            console.log("Ocurrio un error al actualizar producto"); 
        }
    }

    //Metodo para eliminar producto
    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo(); 

            const indexProducto = arrayProductos.findIndex(producto => producto.id === id); 

            if(indexProducto !== -1) {
                arrayProductos.splice(indexProducto, 1); 
                await this.guardarArchivo(arrayProductos); 
                console.log("Producto eliminado"); 
            } else {
                console.log("No se encuentra el producto"); 
            }
        } catch (error) {
            console.log("Ocuriio un error al eliminar producto"); 
        }
    }
}


export {ProductManager}

