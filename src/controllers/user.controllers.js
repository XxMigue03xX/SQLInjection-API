const sequelize = require('../utils/connection');
const catchError = require('../utils/catchError');
const User = require('../models/User');

const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results)
});

const create = catchError(async(req, res) => {
    const result = await User.create(req.body);
    return res.status(201).json(result)
});

const getOne = catchError(async(req, res) => {
    const  { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy( { where: { id }} );
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const {username, password} = req.body;
    const result = await User.update(
        { username, password },
        { where: { id}, returning: true}
    );
    if(result[0]===0) return res.sendStatus(404);
    return res.json(result[1][0])
});

// const login = catchError(async(req, res) => {
//     const { username, password } = req.body;
//     try {
//         const user = await User.findOne({
//             where: {
//                 username,
//                 password
//             }
//     });
//         if (user.length > 0) {
//             return res.json(user[0])
//         }else{
//             res.status(401).json({ message: 'Invalid Credentials' });
//         }
//     } catch (error) {
//         console.error('SQL Query Error:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

const login = catchError(async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM Users WHERE username = '${username}' AND password = '${password}'`;

    try {
        const user = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        
        if (user.length > 0) {
            return res.json(user[0])
        }else{
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    } catch (error) {
        console.error('SQL Query Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login
}