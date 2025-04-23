const connection = require('../db'); // Adjust the path as needed

// Obtener todos los detalles de pedido
const obtenerDetallesPedido = async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM Detalle_Pedido');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los detalles de pedido' });
    }
};

// Obtener un detalle de pedido por ID
const obtenerDetallePedidoPorId = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await connection.query('SELECT * FROM Detalle_Pedido WHERE id_detalle = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Detalle de pedido no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el detalle de pedido' });
    }
};

// Crear un nuevo detalle de pedido
const crearDetallePedido = async (req, res) => {
    const { id_pedido, id_prod, cantidad, subtotal } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO Detalle_Pedido (id_pedido, id_prod, cantidad, subtotal) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_pedido, id_prod, cantidad, subtotal]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el detalle de pedido' });
    }
};

// Actualizar un detalle de pedido
const actualizarDetallePedido = async (req, res) => {
    const id = req.params.id;
    const { id_pedido, id_prod, cantidad, subtotal } = req.body;
    try {
        const result = await connection.query(
            'UPDATE Detalle_Pedido SET id_pedido = $1, id_prod = $2, cantidad = $3, subtotal = $4 WHERE id_detalle = $5 RETURNING *',
            [id_pedido, id_prod, cantidad, subtotal, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Detalle de pedido no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el detalle de pedido' });
    }
};

// Eliminar un detalle de pedido
const eliminarDetallePedido = async (req, res) => {
    const id = req.params.id;
    try {
        await connection.query('DELETE FROM Detalle_Pedido WHERE id_detalle = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el detalle de pedido' });
    }
};

module.exports = {
    obtenerDetallesPedido,
    obtenerDetallePedidoPorId,
    crearDetallePedido,
    actualizarDetallePedido,
    eliminarDetallePedido
};