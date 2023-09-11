const db = require('../../database');

const bcrypt = require('bcrypt');

const userController = {};


userController.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db('users').where({ username }).first();

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

        // Menyimpan userId ke dalam session
        req.session.userId = user.id;

        // menyimpan username ke dalam session
        req.session.username = user.username;

        res.redirect("/todo");
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};


userController.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Enkripsi password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke database
        await db('users').insert({ username, password: hashedPassword });

        res.redirect("/login");
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};






module.exports = userController;

