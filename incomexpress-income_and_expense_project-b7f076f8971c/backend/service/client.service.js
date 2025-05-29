const clientModel = require('../models/client');

const AddClient = async (req, res) => {
    const { name, email, totalAmount, paidAmount, remainingAmount, companyName, domain, projectTitle } = req.body;

    if (!name || !email || !totalAmount || !paidAmount || remainingAmount === undefined || !companyName || !domain || !projectTitle) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
        const parsedTotalAmount = parseFloat(totalAmount);
        const parsedPaidAmount = parseFloat(paidAmount);
        const existingStudent = await clientModel.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ msg: "Client already exists" });
        }
        else {
            const newClient = new clientModel({
                name,
                email,
                totalamount: parsedTotalAmount,
                paidamount: parsedPaidAmount,
                remainingamount: remainingAmount,
                companyname: companyName,
                domain,
                projecttitle: projectTitle
            });

            await newClient.save();
            res.status(201).json(newClient);
        }
    }
    catch (error) {
        console.error(error);
    }


}

const DisplayClient = async (req, res) => {
    try {
        const clientdata = await clientModel.find(); // Fetch all data from the database
        return res.status(200).json(clientdata); // Return the data with a 200 OK status
    } catch (error) {
        console.error("Error fetching client data:", error);
        return res.status(500).json({
            message: "Failed to fetch client data",
            error: error.message
        }); // Return a 500 status with an error message
    }
};


const EditClient = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedClient = await clientModel.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                email: req.body.email,
                totalamount: req.body.totalamount,
                paidamount: req.body.paidamount,
                remainingamount: req.body.remainingamount, // ✅ Now allowing remaining amount update
                companyname: req.body.companyname,
                domain: req.body.domain,
                projecttitle: req.body.projecttitle
            },
            { new: true } // Returns the updated document
        );

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }
        return res.status(200).json({ message: "Client details updated successfully", updatedClient });
    } catch (error) {
        console.error("Error updating client:", error);
        return res.status(500).json({ message: "Error updating client details", error });
    }
};


const DeleteClient = async (req, res) => {
    try {
        const { id } = req.params; // Fixed incorrect parameter extraction

        const deletedClient = await clientModel.findByIdAndDelete(id);

        if (!deletedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        return res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        console.error("Error deleting client:", error);
        return res.status(500).json({ message: "Error deleting client", error });
    }
};

const ClientIncome = async (req, res) => {
    try {
        const clientIncome = await clientModel.aggregate([
            { $group: { _id: null, totalPaid: { $sum: "$paidamount" } } }
        ]);
        res.status(200).json({ totalPaid: clientIncome[0]?.totalPaid || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const ClientCount = async(req,res) =>{
    try
    {
        const count = await clientModel.countDocuments()
        console.log(count)
        res.status(200).json({count})
    }
    catch(error)
    {
        res.status(500).json({error:error.message})
    }
    
}


const AddExcelClientData = async(req,res) => {
    try {
        const clients = req.body;
    
        // Insert students into the database
        await clientModel.insertMany(clients);
    
        res.status(200).json({ message: "Clients imported successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error importing clients", details: error });
      }
}

const ClientTransaction = async (req, res) => {
    try {
      // Fetch only required fields including createdAt (which acts as date)
      const clientTransaction = await clientModel.find().select('name paidamount createdAt'); 
      res.status(200).json(clientTransaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports = { AddClient, DisplayClient, EditClient, DeleteClient,AddExcelClientData,ClientIncome,ClientCount,ClientTransaction };