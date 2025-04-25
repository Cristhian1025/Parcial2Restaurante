const connection = require('../db'); // Adjust the path as needed

// Obtener todos los empleados
const obtenerEmpleados = async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM Empleado');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los empleados' });
    }
};

// Obtener un empleado por ID
const obtenerEmpleadoPorId = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await connection.query('SELECT * FROM Empleado WHERE id_empleado = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el empleado' });
    }
};

// Crear un nuevo empleado
const crearEmpleado = async (req, res) => {
    const {id_empleado, nombre, rol, id_rest } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO Empleado (id_empleado, nombre, rol, id_rest) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_empleado,nombre, rol, id_rest]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el empleado' });
    }
};

// Actualizar un empleado
const actualizarEmpleado = async (req, res) => {
    const id = req.params.id;
    const { nombre, rol, id_rest } = req.body;
    try {
        const result = await connection.query(
            'UPDATE Empleado SET nombre = $1, rol = $2, id_rest = $3 WHERE id_empleado = $4 RETURNING *',
            [nombre, rol, id_rest, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el empleado' });
    }
};

// Eliminar un empleado
const eliminarEmpleado = async (req, res) => {
    const id = req.params.id;
    try {
        await connection.query('DELETE FROM Empleado WHERE id_empleado = $1', [id]);
        res.json({ message: 'Empleado eliminado' });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el empleado' });
    }
};

module.exports = {
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
};