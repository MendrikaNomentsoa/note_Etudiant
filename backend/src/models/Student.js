const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    numEt: {
      type: String,
      required: [true, "Le numéro d'étudiant est obligatoire"],
      unique: true,
      trim: true,
    },
    nom: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
    },
    note_math: {
      type: Number,
      required: [true, 'La note de mathématiques est obligatoire'],
      min: [0, 'La note ne peut pas être inférieure à 0'],
      max: [20, 'La note ne peut pas dépasser 20'],
    },
    note_phys: {
      type: Number,
      required: [true, 'La note de physique est obligatoire'],
      min: [0, 'La note ne peut pas être inférieure à 0'],
      max: [20, 'La note ne peut pas dépasser 20'],
    },
    moyenne: {
      type: Number,
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

// ─── Middleware pre-save : calcul automatique de la moyenne ───────────────────
studentSchema.pre('save', function (next) {
  this.moyenne = parseFloat(((this.note_math + this.note_phys) / 2).toFixed(2));
  next();
});

// ─── Middleware pre-findOneAndUpdate : recalcul lors d'une mise à jour ────────
studentSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.note_math !== undefined || update.note_phys !== undefined) {
    // Récupère les valeurs existantes si une seule note est modifiée
    const math = update.note_math;
    const phys = update.note_phys;
    if (math !== undefined && phys !== undefined) {
      update.moyenne = parseFloat(((math + phys) / 2).toFixed(2));
    }
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
