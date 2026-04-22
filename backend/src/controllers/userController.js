const User = require('../models/User');
const crypto = require('crypto');
const PasswordReset = require('../models/PasswordReset');
const sendEmail = require('../utils/sendEmail');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Inscription
// @route   POST /api/users/register
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { username, email, fullName, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? "Cet email est déjà utilisé" : "Ce nom d'utilisateur est déjà pris"
      });
    }

    const user = await User.create({
      username,
      email,
      fullName,
      password,
      role: (await User.countDocuments()) === 0 ? 'admin' : 'user'
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Connexion
// @route   POST /api/users/login
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect"
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect"
      });
    }

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Profil
// @route   GET /api/users/profile
// ─────────────────────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mettre à jour le profil
// @route   PUT /api/users/profile
// ─────────────────────────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mot de passe oublié
// @route   POST /api/users/forgot-password
// ─────────────────────────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir votre email"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation"
      });
    }

    await PasswordReset.deleteMany({ userId: user._id, used: false });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await PasswordReset.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 3600000)
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e4e7f0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="background: #6366f1; width: 50px; height: 50px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px;">🎓</div>
        </div>
        <h2 style="color: #111827; text-align: center;">Réinitialisation du mot de passe</h2>
        <p style="color: #374151;">Bonjour ${user.fullName},</p>
        <p style="color: #374151;">Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Réinitialiser mon mot de passe</a>
        </div>
        <p style="color: #6b7280; font-size: 12px;">Ce lien expirera dans 1 heure.</p>
        <hr style="border: none; border-top: 1px solid #e4e7f0; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 11px; text-align: center;">GestiÉtudiants</p>
      </div>
    `;

    const emailResult = await sendEmail(user.email, "Réinitialisation de votre mot de passe", html);
    
    if (emailResult.success) {
      console.log(`📧 Email de réinitialisation envoyé à: ${user.email}`);
    }

    res.status(200).json({
      success: true,
      message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'email"
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Vérifier token
// @route   GET /api/users/verify-reset-token/:token
// ─────────────────────────────────────────────────────────────────────────────
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetRequest = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: "Lien invalide ou expiré"
      });
    }

    res.status(200).json({
      success: true,
      message: "Token valide",
      userId: resetRequest.userId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur de vérification"
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Réinitialiser mot de passe
// @route   POST /api/users/reset-password/:token
// ─────────────────────────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Les mots de passe ne correspondent pas"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères"
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetRequest = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: "Lien invalide ou expiré"
      });
    }

    const user = await User.findById(resetRequest.userId);
    user.password = password;
    await user.save();

    resetRequest.used = true;
    await resetRequest.save();

    res.status(200).json({
      success: true,
      message: "Mot de passe réinitialisé avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation"
    });
  }
};

// ─── EXPORTS ─────────────────────────────────────────────────────────────────
module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyResetToken,
  resetPassword
};