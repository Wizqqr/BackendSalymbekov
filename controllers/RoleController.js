import UserModel from '../models/User.js'


export const updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;

        if (!['teacher', 'administration'].includes(newRole)) {
            return res.status(400).json({ message: 'Неверная роль' });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        user.role = newRole;
        await user.save();

        res.json({ message: 'Роль обновлена', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось обновить роль',
        });
    }
};

export const getStudents = async (req, res) => {
    try {
        const students = await UserModel.find({ role: 'student' });
        
        if (!students.length) {
            return res.status(404).json({
                message: 'Студенты не найдены',
            });
        }

        res.json(students);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить список студентов',
        });
    }
};