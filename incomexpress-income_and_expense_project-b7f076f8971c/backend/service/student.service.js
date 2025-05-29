const studentModel = require('../models/studnet');

const AddStudent = async (req, res) => {
    const { name, email, totalAmount, paidAmount, remainingAmount, collegeName, domain, projectTitle } = req.body;

    if (!name || !email || !totalAmount || !paidAmount || remainingAmount === undefined || !collegeName || !domain || !projectTitle) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
        const parsedTotalAmount = parseFloat(totalAmount);
        const parsedPaidAmount = parseFloat(paidAmount);
        const existingStudent = await studentModel.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ msg: "Student already exists" });
        }
        else {
            const newStudent = new studentModel({
                name,
                email,
                totalamount: parsedTotalAmount,
                paidamount: parsedPaidAmount,
                remainingamount: remainingAmount,
                collegename: collegeName,
                domain,
                projecttitle: projectTitle
            });

            await newStudent.save();
            return res.status(201).json(newStudent);
        }
    }
    catch (error) {
        console.error(error);
    }

}

const DisplayStudent = async (req, res) => {
    try {
        // Fetch all student details from the database
        const studetails = await studentModel.find();

        // Respond with the fetched details
        return res.status(200).json(studetails);
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ message: "Error fetching student details", error });
    }
};

const EditStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Log request body to check if all fields are received
        console.log("Received update request:", req.body);

        const updatedStudent = await studentModel.findByIdAndUpdate(
            id, 
            {
                name: req.body.name,
                email: req.body.email,
                totalamount: req.body.totalamount,  // Ensure field names match
                paidamount: req.body.paidamount,
                remainingamount: req.body.remainingamount, // Now correctly received
                collegename: req.body.collegename,
                domain: req.body.domain,
                projecttitle: req.body.projecttitle,
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json({ message: "Student details updated successfully", updatedStudent });
    } catch (error) {
        console.error("Error updating student:", error);
        return res.status(500).json({ message: "Error updating student details", error });
    }
};



const DeleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await studentModel.findByIdAndDelete(id)
            .then(() => {
                res.status(200).json({ message: "Student deleted successfully" });
            })
            .catch((error) => {
                res.status(500).json({ message: "Error deleting student", error });
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    const StudentIncome = async (req, res) => {
        try {
            const studentIncome = await studentModel.aggregate([
                { $group: { _id: null, totalPaid: { $sum: "$paidamount" } } }
            ]);
            res.status(200).json({ totalPaid: studentIncome[0]?.totalPaid || 0 });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    

  const StudentCount = async(req,res) =>{
    try{
        const count = await studentModel.countDocuments()
        res.status(200).json({count})
    }
    catch(error)
    {
        res.status(500).json({error:error.message})
    }
  }

  const StudentTransaction = async (req, res) => {
    try {
      // Fetch only required fields including createdAt (which acts as date)
      const studentTransaction = await studentModel.find().select('name paidamount createdAt'); 
      res.status(200).json(studentTransaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const AddExcelData = async(req,res) => {
    try {
        const students = req.body;
    
        // Insert students into the database
        await studentModel.insertMany(students);
    
        return res.status(200).json({ message: "Students imported successfully" });
      } catch (error) {
        return res.status(500).json({ error: "Error importing students", details: error });
      }
}
  
  
module.exports = { AddStudent, DisplayStudent, EditStudent ,DeleteStudent,StudentIncome,StudentCount,StudentTransaction,AddExcelData};