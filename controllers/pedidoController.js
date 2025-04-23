const connection = require('../db'); // Adjust the path as needed

// Obtener todos los pedidos
const obtenerPedidos = async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM Pedido');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
};

// Obtener un pedido por ID
const obtenerPedidoPorId = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await connection.query('SELECT * FROM Pedido WHERE id_pedido = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
};

// Crear un nuevo pedido
const crearPedido = async (req, res) => {
    const { fecha, id_rest, total } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO Pedido (fecha, id_rest, total) VALUES ($1, $2, $3) RETURNING *',
            [fecha, id_rest, total]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
};

// Actualizar un pedido
const actualizarPedido = async (req, res) => {
    const id = req.params.id;
    const { fecha, id_rest, total } = req.body;
    try {
        const result = await connection.query(
            'UPDATE Pedido SET fecha = $1, id_rest = $2, total = $3 WHERE id_pedido = $4 RETURNING *',
            [fecha, id_rest, total, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
};

// Eliminar un pedido
const eliminarPedido = async (req, res) => {
    const id = req.params.id;
    try {
        await connection.query('DELETE FROM Pedido WHERE id_pedido = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido
};