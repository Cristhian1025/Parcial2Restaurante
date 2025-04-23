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

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejo del cierre de la aplicación (Opcional, pero recomendado)
process.on('SIGINT', async () => {
    console.log("Cerrando el servidor...");
    try {
        await connection.end(); // Cierra el Pool de conexiones
        console.log("Conexión a la base de datos cerrada.");
        process.exit(0); // Sale del proceso sin errores
    } catch (error) {
        console.error("Error al cerrar la conexión a la base de datos:", error);
        process.exit(1); // Sale del proceso con un código de error
    }
});