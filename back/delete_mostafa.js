const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const JoinRequestSchema = new mongoose.Schema({ fullName: String }, { strict: false });

async function deleteMostafa() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const JoinRequest = mongoose.model('JoinRequest', JoinRequestSchema);

    // Force delete any request for 'مصطفي' or 'مصطفى'
    const result = await JoinRequest.deleteMany({ fullName: /مصطف/i });
    
    console.log(`SUCCESS: Deleted ${result.deletedCount} requests related to Mostafa.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

deleteMostafa();
