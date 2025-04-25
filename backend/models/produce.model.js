import mongoose from "mongoose";

const produceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  unit: {
    type: String,
    required: true,
  },
});

const Produce = mongoose.model("Produce", produceSchema);

export default Produce;
