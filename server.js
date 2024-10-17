const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000;

// Cấu hình kết nối SQL Server
const config = {
    user: 'root',
    password: '',
    server: '127.0.0.1', // địa chỉ máy chủ
    database: 'SET',
    options: {
        encrypt: true, // sử dụng mã hóa nếu cần
        trustServerCertificate: true // chỉ sử dụng trong môi trường phát triển
    }
};

// Sử dụng body-parser và cors
app.use(bodyParser.json());
app.use(cors());

// API đăng nhập
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .query('SELECT * FROM Users WHERE Username = @username AND Password = @password');

        if (result.recordset.length > 0) {
            res.status(200).send({ message: 'Đăng nhập thành công' });
        } else {
            res.status(401).send({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Lỗi kết nối đến cơ sở dữ liệu', error: err.message });
    } finally {
        sql.close();
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
