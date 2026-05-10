const express = require('express');
const sql = require('mssql/msnodesqlv8'); 

const app = express();
const PORT = 3000;

app.use(express.json());

const dbConfig = {
    server: 'DESKTOP-GR2KF2J\\SQLEXPRESS', 
    database: 'DecodeLabsDB',
    driver: 'SQL Server',
    options: {
        trustedConnection: true, 
        encrypt: false 
    }
};

sql.connect(dbConfig).then(() => {
    console.log("Database Connection: SUCCESS");
}).catch(err => console.log("Database Connection Failed!", err));

app.get('/users', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM Users');
        res.status(200).json({ message: "Users retrieved", data: result.recordset });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.post('/users', async (req, res) => {
    const { name, role } = req.body;
    if (!name || !role) return res.status(400).json({ error: "Name and role are required." });

    try {
        const request = new sql.Request();
        request.input('userName', sql.VarChar, name);
        request.input('userRole', sql.VarChar, role);
        await request.query('INSERT INTO Users (name, role) VALUES (@userName, @userRole)');
        res.status(201).json({ message: "User created securely", data: { name, role } });
    } catch (err) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

app.put('/users/:id', async (req, res) => {
    const userId = req.params.id; 
    const { name, role } = req.body; 

    try {
        const request = new sql.Request();
        request.input('id', sql.Int, userId);
        request.input('name', sql.VarChar, name);
        request.input('role', sql.VarChar, role);
        await request.query('UPDATE Users SET name = @name, role = @role WHERE id = @id');
        res.status(200).json({ message: "User Updated Successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
});


app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const request = new sql.Request();
        request.input('id', sql.Int, userId);
        await request.query('DELETE FROM Users WHERE id = @id');
        res.status(200).json({ message: "User Deleted Permanently!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

app.listen(PORT, () => {
    console.log(`Project 3 Server is running on http://localhost:${PORT}`);
});