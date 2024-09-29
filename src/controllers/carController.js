import Car from '../models/car.js';
import User from '../models/user.js'


export const createCar = async (req, res) => {
  try {
    console.log(req.body,"createCar")
    const imageUrl = req.file ? req.file.filename : null;
    const carData = {
      ...req.body,  
      image: imageUrl
    };

   
    const car = await Car.create(carData);
    res.status(201).json({ message: 'Car created successfully', car });
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
};



export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const searchCars = async (req, res, next) => {
  const {
    make,
    model,
    year,
    isSecondHand,
    mileage,
    engineType,
    fuelType,
    transmission,
    color,
    driveType,
    condition,
    minPrice,
    maxPrice,
    searchTerm 
  } = req.query;

  
  const match = {};


  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i'); 
    match.$or = [
      { make: { $regex: regex } },
      { model: { $regex: regex } },
      { color: { $regex: regex } },
      { engineType: { $regex: regex } },
      { transmission: { $regex: regex } },
      { driveType: { $regex: regex } },
      { condition: { $regex: regex } },
    ];
  }
  
  if (make) match.make = { $regex: new RegExp(make, 'i') }; 
  if (model) match.model = { $regex: new RegExp(model, 'i') };
  if (engineType) match.engineType = { $regex: new RegExp(engineType, 'i') };
  if (color) match.color = { $regex: new RegExp(color, 'i') };
  if (transmission) match.transmission = { $regex: new RegExp(transmission, 'i') };
  if (driveType) match.driveType = { $regex: new RegExp(driveType, 'i') };
  if (condition) match.condition = { $regex: new RegExp(condition, 'i') };

 
  if (year) match.year = Number(year);
  if (isSecondHand !== undefined) match.isSecondHand = isSecondHand === 'true'; 


  if (minPrice || maxPrice) {
    match.price = {};
    if (minPrice) match.price.$gte = Number(minPrice); 
    if (maxPrice) match.price.$lte = Number(maxPrice);
  }

  
  if (mileage) match.mileage = { $lte: Number(mileage) }; 

  try {
    const cars = await Car.aggregate([
      { $match: match },
      { $project: { 
          _id: 1,
          make: 1,
          model: 1,
          year: 1,
          price: 1,
          isSecondHand: 1,
          mileage: 1,
          engineType: 1,
          fuelType: 1,
          transmission: 1,
          color: 1,
          driveType: 1,
          condition: 1,
          createdAt: 1,
          updatedAt: 1,
          image: 1,
      }},
      { $sort: { createdAt: -1 } } 
    ]);

    res.status(200).json({ success: true, cars });
  } catch (err) {
    next(err); 
  }
};


export const getCarById = async (req, res) => {
  console.log(req)
  const { id } = req.params;

  console.log(id)
  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};


export const updateCar = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  console.log(id,"")

  if (req.file) {
    updates.image = req.file.filename;  
  }

  try {
    const car = await Car.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car updated successfully', car });
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
};

export const deleteCar = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await Car.findByIdAndDelete(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
