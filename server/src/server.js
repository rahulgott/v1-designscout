const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const s3Routes = require('./routes/s3Routes');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: 'http://localhost:5173' || 'https://designscout-v1.netlify.app',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/s3', s3Routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
