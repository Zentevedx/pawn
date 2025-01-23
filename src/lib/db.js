import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'zenteved_emp',
  port: 3306, // Puerto personalizado
});
