const mongoose= require("mongoose");
const colors= require('colors');


const connectDB = async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.yellow);
    } catch (error) {
        console.log(`Error ${error.message}`.red);
        process.exit();
    }
}
mongoose.set('strictQuery',true)
module.exports= connectDB;