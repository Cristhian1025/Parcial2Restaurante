const express = require('express');
const cors = require('cors');
const connection = require('./db');
const path = require('path');

// Importar los controladores
const restauranteController = require('./controllers/restauranteController');
const empleadoController = require('./controllers/empleadoController');
const productoController = require('./controllers/productoController');
const pedidoController = require('./controllers/pedidoController');
const detallePedidoController = require('./controllers/detallePedidoController');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Habilita CORS para evitar problemas de origen cruzado en desarrollo

const PORT = 3000;

// API de prueba
app.get('/api/prueba', (req, res) => {
    res.status(200).json({
        message: 'API funcionando correctamente',
        port: PORT,
        status: 'success'
    });
});

// Rutas para Restaurante
app.get('/restaurantes', restauranteController.obtenerRestaurantes);
app.get('/restaurantes/:id', restauranteController.obtenerRestaurantePorId);
app.post('/restaurantes', restauranteController.crearRestaurante);
app.put('/restaurantes/:id', restauranteController.actualizarRestaurante);
app.delete('/restaurantes/:id', restauranteController.eliminarRestaurante);

// Rutas para Empleado
app.get('/empleados', empleadoController.obtenerEmpleados);
app.get('/empleados/:id', empleadoController.obtenerEmpleadoPorId);
app.post('/empleados', empleadoController.crearEmpleado);
app.put('/empleados/:id', empleadoController.actualizarEmpleado);
app.delete('/empleados/:id', empleadoController.eliminarEmpleado);

// Rutas para Producto
app.get('/productos', productoController.obtenerProductos);
app.get('/productos/:id', productoController.obtenerProductoPorId);
app.post('/productos', productoController.crearProducto);
app.put('/productos/:id', productoController.actualizarProducto);
app.delete('/productos/:id', productoController.eliminarProducto);

// Rutas para Pedido
app.get('/pedidos', pedidoController.obtenerPedidos);
app.get('/pedidos/:id', pedidoController.obtenerPedidoPorId);
app.post('/pedidos', pedidoController.crearPedido);
app.put('/pedidos/:id', pedidoController.actualizarPedido);
app.delete('/pedidos/:id', pedidoController.eliminarPedido);

// Rutas para Detalle Pedido
app.get('/detalles-pedido', detallePedidoController.obtenerDetallesPedido);
app.get('/detalles-pedido/:id', detallePedidoController.obtenerDetallePedidoPorId);
app.post('/detalles-pedido', detallePedidoController.crearDetallePedido);
app.put('/detalles-pedido/:id', detallePedidoController.actualizarDetallePedido);
app.delete('/detalles-pedido/:id', detallePedidoController.eliminarDetallePedido);




// RUTAS Y APIsS PARA LAS CONSULTAS NATIVAS

// 1. Obtener todos los productos de un pedido específico
app.get('/pedidos/:id_pedido/productos', async (req, res) => {
    const idPedido = req.params.id_pedido; //recibimos el id en la URl
    try {
        const result = await connection.query( //creamos, ejecutamos y guardamos la query y su resultado
            `SELECT p.*
             FROM Producto p
             JOIN Detalle_Pedido dp ON p.id_prod = dp.id_prod
             WHERE dp.id_pedido = $1;`,
            [idPedido]
        );  //Seleccionamos los productos que se relacionan a cierto pedido
        res.json(result.rows); //respondemos con el resultado
    } catch (error) {
        console.error(error); //mostramos el error en consola y el mensaje en la petición
        res.status(500).json({ error: 'Error al obtener los productos del pedido' });
    }
});


// 2. Obtener los productos más vendidos (más de X unidades)
app.get('/productos/mas-vendidos/:cantidad_minima', async (req, res) => { //en la petición se especifica la cantidad
    const cantidadMinima = parseInt(req.params.cantidad_minima); //convertimos el dato recibido a entero
    try {
        const result = await connection.query( //creamos, ejecutamos y guardamos la query y su resultado
            `SELECT p.*, SUM(dp.cantidad) as total_vendido
             FROM Producto p
             JOIN Detalle_Pedido dp ON p.id_prod = dp.id_prod
             GROUP BY p.id_prod
             HAVING SUM(dp.cantidad) > $1;`,
            [cantidadMinima]
        );   //seleccionamos los productos con mas cantidad vendida, mayor a x
        res.json(result.rows);//respondemos con el resultado
    } catch (error) {
        console.error(error); //mostramos el error en consola y el mensaje en la petición
        res.status(500).json({ error: 'Error al obtener los productos más vendidos' });
    }
});

// 3. Obtener el total de ventas por restaurante
app.get('/restaurante/ventas', async (req, res) => {  //definimos la ruta
    try {
        const result = await connection.query( //creamos, ejecutamos y guardamos la query y su resultado
            `SELECT r.id_rest, r.nombre, SUM(p.total) as total_ventas
             FROM Restaurante r
             JOIN Pedido p ON r.id_rest = p.id_rest
             GROUP BY r.id_rest, r.nombre;`
        );   //consultamos los restaurantes con sus ventas, sumando los valores de sus pedidos
        res.json(result.rows); //respondemos con el resultado
    } catch (error) {
        console.error(error); //mostramos el error en consola y el mensaje en la petición
        res.status(500).json({ error: 'Error al obtener el total de ventas por restaurante' });
    }
});


// 4. Obtener los pedidos realizados en una fecha específica
app.get('/pedidos/fecha/:fecha', async (req, res) => {
    const fecha = req.params.fecha; // Formato AAAA-MM-DD
    try {
        const result = await connection.query( //creamos, ejecutamos y guardamos la query y su resultado
            `SELECT *
             FROM Pedido
             WHERE fecha = $1;`,
            [fecha]
        );
        res.json(result.rows);//respondemos con el resultado
    } catch (error) {
        console.error(error); //mostramos el error en consola y el mensaje en la petición
        res.status(500).json({ error: 'Error al obtener los pedidos por fecha' });
    }
});

// 5. Obtener los empleados por rol en un restaurante
app.get('/restaurantes/:id_rest/empleados/:rol', async (req, res) => {
    const idRest = req.params.id_rest;
    const rol = req.params.rol;
    try {
        const result = await connection.query( //creamos, ejecutamos y guardamos la query y su resultado
            `SELECT *
             FROM Empleado
             WHERE id_rest = $1 AND rol = $2;`,
            [idRest, rol]
        );
        res.json(result.rows);//respondemos con el resultado
    } catch (error) {
        console.error(error); //mostramos el error en consola y el mensaje en la petición
        res.status(500).json({ error: 'Error al obtener los empleados por rol' });
    }
});






// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// manejo del cierre de la aplicación

process.on('SIGINT', async () => {
    console.log("Cerrando el servidor...");
    try {
        await connection.end(); // cerrar el Pool de conexiones
        console.log("Conexión a la base de datos cerrada.");
        process.exit(0); // Sale del proceso
    } catch (error) {
        console.error("Error al cerrar la conexión a la base de datos:", error);
        process.exit(1); // Sale del proceso mostrando el error
    }
});