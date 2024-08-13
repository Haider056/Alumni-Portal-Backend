const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: '193.203.184.150',    
    user:  'u292277105_alumni',  
    password:  'AlumniPortal@12345',  
    database:  'u292277105_alumni',   
    port: 3306,                 
    waitForConnections: true,                          
    connectionLimit: 10,                               
    queueLimit: 0                                      
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database!');
        connection.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

testConnection();

module.exports = pool;
