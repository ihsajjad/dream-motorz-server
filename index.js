const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> {
    res.send('play sporta server is running...');
})

app.listen(port, ()=>{
    console.log(`play sporta server is running on port ${port}`)
})