const Review = require('../models/Review.model');
const TechnicianProfile = require('../models/TechnicianProfile.model');

// @POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { technicianId, rating, comment } = req.body;
    
    const review = await Review.create({
      customerId: req.user._id,
      technicianId,
      rating,
      comment
    });

    // Update technician profile stats
    const reviews = await Review.find({ technicianId });
    const count = reviews.length;
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / count;

    await TechnicianProfile.findOneAndUpdate(
      { userId: technicianId },
      { 
        ratingAverage: Math.round(avg * 10) / 10,
        reviewsCount: count
      }
    );

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/reviews/technician/:id
exports.getTechnicianReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ technicianId: req.params.id })
      .populate('customerId', 'fullName');
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
