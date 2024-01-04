import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    userCount: {
      type: Number,
      default: 0,
    },
    messageCount: {
        type: Number,
        default: 0,
    }
  });
  
  export default mongoose.model("Categories", categorySchema);