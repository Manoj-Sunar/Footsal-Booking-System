import mongoose from "mongoose";

export const DatabaseConnection = async () => {
   try {
      await mongoose.connect(process.env.DATABASE_URI);
      console.log('Database Connection successfully');
   } catch (error) {
      console.log('Database connectivity error')
      throw new Error(error);
   }
}