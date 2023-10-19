import express from 'express';
import "express-async-errors";
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'
import jobsRoutes from './routes/jobsRoutes.js'
import cors from 'cors';
import morgan from 'morgan';
import middelWare from './middelwares/middelWare.js';
import swaggerDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';


//configure env
dotenv.config() // use {path:' '} when env is out from root 

//database config
connectDB();

//rest object
const app = express();

//swaggger confiq
const options = {
    definition:{
    openapi:"3.0.0",
    Info:{
    title:'Job Board App',
    description:'Node js JOB BOard App'
},
servers:[
    {
        url:"http://localhost:8080"
    }
]
},
apis:['./routes/*js']
};

//swaggger Doc
const spec = swaggerDoc(options)
//middlewares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobsRoutes);

//Home root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));


// validtion midleware
app.use(middelWare)


//rest api
// app.get('/', (req, res) => {
//     res.send(
//         '<h1>Welcome to ecommerece app</h1> '
//     );

// });

//port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});