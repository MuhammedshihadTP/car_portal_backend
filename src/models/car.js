import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    make: { type: String, required: true },               
    model: { type: String, required: true },              
    year: { type: Number, required: true },               
    price: { type: Number, required: true },              
    isSecondHand: { type: Boolean, default: false },       
    mileage: { type: Number },                          
    engineType: { type: String },                         
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] }, 
    transmission: { type: String, enum: ['Automatic', 'Manual'] }, 
    color: { type: String },                               
    driveType: { type: String, enum: ['FWD', 'RWD', 'AWD'] }, 
    description: { type: String },                         
    condition: { type: String, enum: ['New', 'Good','Used'] },                      
    image: { type: String }
}, { timestamps: true });

export default mongoose.model('Car', carSchema);
