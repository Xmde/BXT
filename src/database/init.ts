//Inits the database
import mongoose from 'mongoose';

module.exports = () => {
  const db = process.env.BXT_db!;
  mongoose.connect(db).then(() => console.log(`Connected to ${db}...`));
};
