const express = require('express');
const router = express.Router();

const {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getBilan,
} = require('../controllers/studentController');

// ─── Route bilan EN PREMIER (avant /:id pour éviter le conflit de route) ────
router.get('/bilan', getBilan);

// ─── CRUD standard ───────────────────────────────────────────────────────────
router.post('/', addStudent);         // POST   /api/students
router.get('/', getAllStudents);       // GET    /api/students
router.get('/:id', getStudentById);   // GET    /api/students/:id
router.put('/:id', updateStudent);    // PUT    /api/students/:id
router.delete('/:id', deleteStudent); // DELETE /api/students/:id

module.exports = router;
