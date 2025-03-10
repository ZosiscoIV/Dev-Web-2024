const express = require('express');
const cors = require('cors');
const productController = require('./productController');

const app = express();
const PORT = 6942;

app.use(cors());

app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.use('/api', productController);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
