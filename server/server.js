const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();
 
// mongoDB connection
mongoose.connect(process.env.MONGODB_URI.replace("<DB_PASSWORD>", process.env.DATABASE_PASSWORD)).then(()=> console.log('MongoDB Connect')).catch((error)=> {
    console.log("MongoDB Connection Error", error);
});

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server running on port ${port}...`);
})