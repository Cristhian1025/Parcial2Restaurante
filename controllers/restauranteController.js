const connection = require('../db'); // Adjust the path as needed

// Obtener todos los restaurantes
const obtenerRestaurantes = async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM Restaurante');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los restaurantes' });
    }
};

// Obtener un restaurante por ID
const obtenerRestaurantePorId = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await connection.query('SELECT * FROM Restaurante WHERE id_rest = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Restaurante no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el restaurante' });
    }
};

// Crear un nuevo restaurante
const crearRestaurante = async (req, res) => {
    const { id_rest,nombre, ciudad, direccion, fecha_apertura } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO Restaurante (id_rest, nombre, ciudad, direccion, fecha_apertura) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_rest, nombre, ciudad, direccion, fecha_apertura]
        );
        res.status(201).json(result.rows[0]); // 201 Created
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el restaurante' });
    }
};

// Actualizar un restaurante
const actualizarRestaurante = async (req, res) => {
    const id = req.params.id;
    const { nombre, ciudad, direccion, fecha_apertura } = req.body;
    try {
        const result = await connection.query(
            'UPDATE Restaurante SET nombre = $1, ciudad = $2, direccion = $3, fecha_apertura = $4 WHERE id_rest = $5 RETURNING *',
            [nombre, ciudad, direccion, fecha_apertura, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Restaurante no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el restaurante' });
    }
};

// Eliminar un restaurante
const eliminarRestaurante = async (req, res) => {
    const id = req.params.id;
    try {
        await connection.query('DELETE FROM Restaurante WHERE id_rest = $1', [id]);
        res.json({ message: 'Producto eliminado' });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el restaurante' });
    }
};

module.exports = {
    obtenerRestaurantes,
    obtenerRestaurantePorId,
    crearRestaurante,
    actualizarRestaurante,
    eliminarRestaurante
};