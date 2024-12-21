const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true},
  designation: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  salary: { type: Number, required: true },
  image: { type: String }, 
});


const UserModel = mongoose.model("User",EmployeeSchema)


module.exports = UserModel;
