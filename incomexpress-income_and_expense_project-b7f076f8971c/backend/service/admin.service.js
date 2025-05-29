const AdminLogin = async (req, res) => {
    const { uname, password } = req.body;
    if (uname === 'anjana' && password === 'anjana123') {
        return res.status(200).json({ success: true });
    }
    return res.status(400).json({ success: false });
}

module.exports = {AdminLogin};