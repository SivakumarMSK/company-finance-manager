const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const studentRoutes  = require('./routes/student.route');
const clientRoutes = require('./routes/client.route');
const adminRoutes = require("./routes/admin.route")
const expenseRoutes = require('./routes/expense.route');
const incomeRoutes = require('./routes/income.route');
const invoiceRoutes = require('./routes/invoice.route') ;
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(bodyParser.json());
dotenv.config();
app.use(cors())

//database connection code moved to backend/config/db.js
const connectDB = require("./config/db");
connectDB();

app.use('/student',studentRoutes);
app.use('/client',clientRoutes);
app.use('/admin',adminRoutes);
app.use('/expense',expenseRoutes);
app.use('/income',incomeRoutes)
app.use('/invoice',invoiceRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);

});