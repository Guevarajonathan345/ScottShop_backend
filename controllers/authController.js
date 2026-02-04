import pool from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//Generar jwt 

const generateAccessToken = (id) => {
    //firma token con ID para usuario
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15min' //expiracion de token
    }); 
};

const generateRefreshToken = (id) => {
    return jwt.sign ({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d' //expiracion de refresh token
    });
};


//POST nuevo usuario registrado

export const registerUser = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        //verifica si el usuario es existente
        const [existingUser] = await pool.query('SELECT id FROM usuarios WHERE email= ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({message: 'El correo ya esta en uso'});
        }
        //hash contraseña

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //crear nuevo usuario
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );

        //generar token
        res.status(201).json({
            id: result.insertId,
            nombre,
            email,
            rol: 'user',
            token: generateToken(result.insertId),    
        });
    } catch (error) {
        console.error("Error al registrar", error.message);
        res.status(500).json({message: "Error en el servidor al registrar usuario"});
    }
};

//login usuario 

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    //verifica
    const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = users[0];

    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });
9
    const match =await bcrypt.compare (password, user.password);
    if (!match) return res.status(401).json({ message: "Error de credenciales"});

    const accessToken = generateAccessToken (user.id);
    const refreshToken = generateRefreshToken (user.id);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, //true en produccion
        sameSite: 'strict',
        maxAge: 7 * 24 *60 *60 *1000, //7 dias
    });

    res.json({
        id: user.id,
        nombre: user.nombre,
        rol: user.rol,
        token: accessToken,
    });
};