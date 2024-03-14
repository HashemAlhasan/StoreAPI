require('dotenv').config();
const express=require('express');
const app=express();
const connctDB=require('./db/connect')
const NotFoundMiddelware=require('./middleware/not-found');
const ErrorMiddelware=require('./middleware/error-handler');
require('express-async-errors');
app.use(express.json());
const productRouter=require('./routes/products')
app.get('/',(req,res,next)=>{
    res.send('<h1>Store API</h1><a herf="/api/v1/products">Produtcts Routes<a>')
})
app.use('/api/v1/products',productRouter);
app.use(NotFoundMiddelware);
app.use(ErrorMiddelware);
const port=process.env.PORT ||3000;
const start =async()=>
{
    try {
        await connctDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log(`app is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
        
    }
}
start();