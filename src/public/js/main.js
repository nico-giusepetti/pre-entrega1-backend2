// crear instancia de websocket
console.log("conectado main js");

// Instancia de socket.io desde el front
const socket = io();



socket.on("productos", (response) => {
    renderProductos(response.docs);
});



const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");

        card.innerHTML = ` 
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${item.title}</h5>
                                <p class="card-text"> $ ${item.price}</p>
                                <button class="btn btn-primary"> Eliminar </button>
                            </div>
                        </div>
                        `;

        contenedorProductos.appendChild(card);

        //asignar funcion de eliminar al boton 
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item._id);
        })
    })
}


const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

//Agregamos productos desde el formulario: 

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
    };

    socket.emit("agregarProducto", producto);
}