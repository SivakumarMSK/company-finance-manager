const clientModel = require("../models/client.js");
const studentModel = require("../models/studnet.js");

const GetInvoice = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Try to find the invoice in the Student collection first
    let invoice = await studentModel.findOne({ email: email });

    // If not found, check in the Client collection
    if (!invoice) {
      invoice = await clientModel.findOne({ email: email });
    }

    // If still not found, return an error
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { GetInvoice };
