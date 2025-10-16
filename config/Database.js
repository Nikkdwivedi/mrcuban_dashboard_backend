import mongoose from "mongoose";


export const Database = async ()=>{
    try {
        const data = await mongoose.connect(process.env.DB);
        if(data) return console.log("Database connect successfully");
        
    } catch (error) {
        console.log(error);
    }
}