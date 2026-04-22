const User = require('../models/User');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/users/register
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? "Cet email est déjà utilisé" 
          : "Ce nom d'utilisateur est déjà pris"
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role: (await User.countDocuments()) === 0 ? 'admin' : 'user' // Le premier utilisateur est admin
    });

    res.status(201).json({
      success: true,
      message: "Inscription réussie ! Vous pouvez maintenant vous connecter",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Connexion utilisateur
// @route   POST /api/users/login
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect"
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect"
      });
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Obtenir le profil utilisateur
// @route   GET /api/users/profile
// ─────────────────────────────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mettre à jour le profil
// @route   PUT /api/users/profile
// ─────────────────────────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profil mis à jour",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};