require('dotenv').config();
const path = require('path'); 
const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/v1/api/users', usersRouter);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something broke!' });
});

const PORT = process.env.PORT || 3007;
const HOST = process.env.HOST || '0.0.0.0'; 

app.listen(PORT, () => {
    console.log(`Server running on port`);
    console.log(`http://${HOST}:${PORT}`);
});