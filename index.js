import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import {UserController, RoleController, PostController} from './controllers/index.js'
import {registerValidation, loginValudation} from './validations.js'
import multer from "multer";
import { checkAuth, checkSuperUser } from './utils/checkAuth.js';


mongoose
.connect('mongodb+srv://rushwars0056:jzyYitqLCmb9tLqC@salymbekov.udd73.mongodb.net/college', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
})
.then(() => console.log('DB OK'))
.catch((err) => console.log('DB ERROR', err))

const app = express()
const port = 4444;

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ 
    storage, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB
});

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/upload', upload.single('image'), (req,res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});

app.post('/auth/register', registerValidation, UserController.register)
app.post('/auth/login', loginValudation, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.post('/posts/create', checkAuth, PostController.create)
app.get('/posts/:id', checkAuth, PostController.getOne)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.post('/superuser/update-role', checkAuth, checkSuperUser, RoleController.updateUserRole)
app.get('/students', checkAuth, RoleController.getStudents)

app.listen(port, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`The server started on port ${port}`)
})