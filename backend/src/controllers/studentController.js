const Student = require('../models/Student');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Ajouter un étudiant
// @route   POST /api/students
// ─────────────────────────────────────────────────────────────────────────────
const addStudent = async (req, res, next) => {
  try {
    const { numEt, nom, note_math, note_phys } = req.body;
    const student = await Student.create({ numEt, nom, note_math, note_phys });

    res.status(201).json({
      success: true,
      message: 'Insertion réussie',
      data: student,
    });
  } catch (error) {
    next(error); // Transmis au middleware errorHandler
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Afficher tous les étudiants
// @route   GET /api/students
// ─────────────────────────────────────────────────────────────────────────────
const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Afficher un étudiant par son ID
// @route   GET /api/students/:id
// ─────────────────────────────────────────────────────────────────────────────
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Étudiant introuvable",
      });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Modifier un étudiant
// @route   PUT /api/students/:id
// ─────────────────────────────────────────────────────────────────────────────
const updateStudent = async (req, res, next) => {
  try {
    const { numEt, nom, note_math, note_phys } = req.body;

    // Prépare les champs à mettre à jour
    const updateFields = { numEt, nom, note_math, note_phys };

    // Recalcul de la moyenne si les deux notes sont présentes dans la requête
    // (sinon on récupère l'étudiant existant pour recalculer correctement)
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Étudiant introuvable, modification échouée",
      });
    }

    const finalMath =
      note_math !== undefined ? note_math : student.note_math;
    const finalPhys =
      note_phys !== undefined ? note_phys : student.note_phys;

    updateFields.note_math = finalMath;
    updateFields.note_phys = finalPhys;
    updateFields.moyenne = parseFloat(((finalMath + finalPhys) / 2).toFixed(2));

    student = await Student.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Modification réussie',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Supprimer un étudiant
// @route   DELETE /api/students/:id
// ─────────────────────────────────────────────────────────────────────────────
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Étudiant introuvable, suppression échouée",
      });
    }

    res.status(200).json({
      success: true,
      message: 'Suppression réussie',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Bilan global de la classe
// @route   GET /api/students/bilan
// ─────────────────────────────────────────────────────────────────────────────
const getBilan = async (req, res, next) => {
  try {
    const students = await Student.find();

    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Aucun étudiant enregistré',
        data: null,
      });
    }

    const moyennes = students.map((s) => s.moyenne);

    const moyenneClasse = parseFloat(
      (moyennes.reduce((acc, m) => acc + m, 0) / moyennes.length).toFixed(2)
    );
    const moyenneMin = parseFloat(Math.min(...moyennes).toFixed(2));
    const moyenneMax = parseFloat(Math.max(...moyennes).toFixed(2));

    const admis      = students.filter((s) => s.moyenne >= 10);
    const redoublants = students.filter((s) => s.moyenne < 10);

    res.status(200).json({
      success: true,
      data: {
        totalEtudiants : students.length,
        moyenneClasse,
        moyenneMin,
        moyenneMax,
        nbAdmis        : admis.length,
        nbRedoublants  : redoublants.length,
        tauxReussite   : `${((admis.length / students.length) * 100).toFixed(1)} %`,
        admis          : admis.map((s) => ({ numEt: s.numEt, nom: s.nom, moyenne: s.moyenne })),
        redoublants    : redoublants.map((s) => ({ numEt: s.numEt, nom: s.nom, moyenne: s.moyenne })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getBilan,
};
