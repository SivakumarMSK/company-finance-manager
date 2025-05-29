const client = require("../models/client.js")
const student = require("../models/studnet.js");

const GetClientIncome = async (req, res) => {
    try {
        const clientIncome = await client.find();
        return res.status(200).json(clientIncome);
    } catch (error) {
        console.error(error);
        
    }

};

const GetStudentIncome = async (req, res) => {
    try {
        const studentIncome = await student.find();
        return res.status(200).json(studentIncome);
    } catch (error) {
        console.error(error);
        
    }
};

module.exports = { GetClientIncome, GetStudentIncome };
