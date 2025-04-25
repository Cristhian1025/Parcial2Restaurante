const connection = require('../db'); // Adjust the path as needed

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM Producto');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await connection.query('SELECT * FROM Producto WHERE id_prod = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Crear un nuevo producto
const crearProducto = async (req, res) => {
    const {id_prod, nombre, precio } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO Producto (id_prod, nombre, precio) VALUES ($1, $2, $3) RETURNING *',
            [id_prod, nombre, precio]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
    const id = req.params.id;
    const { nombre, precio } = req.body;
    try {
        const result = await connection.query(
            'UPDATE Producto SET nombre = $1, precio = $2 WHERE id_prod = $3 RETURNING *',
            [nombre, precio, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
    const id = req.params.id;
    try {
        await connection.query('DELETE FROM Producto WHERE id_prod = $1', [id]);
        res.json({ message: 'Producto eliminado' });
        res.status(204).send();
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};