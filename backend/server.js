const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 6942;

app.use(cors());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
