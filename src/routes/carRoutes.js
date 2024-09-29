import express from 'express';
import { 
    createCar, 
    getCars, 
    getCarById, 
    updateCar, 
    deleteCar, 
    searchCars 
} from '../controllers/carController.js';
import { upload } from '../middlewares/fileUpload.js';
import { authMiddleware } from '../middlewares/verifyToken.js';



const router = express.Router();







router.post('/', authMiddleware, upload.single('image'), createCar);


router.get('/', getCars);


router.get('/search', searchCars);


router.get('/:id', getCarById);

router.put('/:id', authMiddleware,upload.single('image'), updateCar);


router.delete('/:id', authMiddleware, deleteCar);

export default router;
