const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68ca726e38b560f64431d3f1",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was intialized");
};

initDB();
