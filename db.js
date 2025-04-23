const { Pool } = require('pg'); // Importa la clase Pool para manejar conexiones a BDs
const connection = new Pool({ // Instancia de Pool con los parámetros necesarios
    connectionString: 'postgresql://postgres.bnawqpynuygvocihpcjx:BaseDatosMasivas@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
    

    ssl: {
        rejectUnauthorized: false
    } // Acepta conexiones SSL si el certificado no puede ser comprobado
});
// Verifica conexión
connection.query('SELECT NOW()', (error, result) => { // Consulta simple para comprobar conexión
    if (error) {
        console.error('Error de conexiónnn:', error);
    } else {
        console.log('Conectado a Supabase:', result.rows[0]);
    }
});

module.exports = connection; // Permite que el módulo sea importado y usado en otros archivos
