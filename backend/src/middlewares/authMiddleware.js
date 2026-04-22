// Middleware pour vérifier l'authentification
const protect = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Non authentifié"
      });
    }
    
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Non authentifié"
    });
  }
};

module.exports = { protect };