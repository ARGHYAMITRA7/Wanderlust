const Listing = require("../models/listing");
const axios = require("axios");
const maptilerKey = process.env.MAP_TOKEN;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const location = req.body.listing.location; // e.g. "New Delhi, India"

  let geoData = null;

  try {
    // Fetch from MapTiler Geocoding API
    const geoResponse = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json`,
      { params: { key: maptilerKey } }
    );

    const feature = geoResponse.data.features?.[0];

    if (feature && feature.geometry) {
      geoData = {
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates,
      };
      console.log("📍 GeoJSON:", geoData);
    } else {
      console.log("⚠️ No geometry found for the location.");
    }
  } catch (error) {
    console.error("❌ Geocoding error:", error.response?.data || error.message);
  }

  // Now save both image + geometry
  try {
    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // ✅ Attach geometry if found, else default to empty Point
    newListing.geometry = geoData || { type: "Point", coordinates: [0, 0] };

    const savedListing = await newListing.save();
    console.log("✅ Listing saved:", savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("❌ Error creating listing:", err);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings/new");
  }
};


module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  let originalImgUrl = listing.image.url;
  originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImgUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
