import jwt from "jsonwebtoken";
import UserModel from '../models/User.js'
export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            console.log('Decoded userId:', req.userId);
            next();
        } catch (error) {
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
};

export const checkSuperUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (user.role !== 'superuser') {
            return res.status(403).json({ message: 'Доступ запрещён. Только для суперпользователя' });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
