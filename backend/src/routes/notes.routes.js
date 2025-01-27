const { Router } = require("express");

const NotesController = require("../controllers/NotesController");

const notesRoutes = Router();

const notesController = new NotesController();

notesRoutes.get("/", notesController.index);
notesRoutes.post("/:user_id", notesController.create);
notesRoutes.get("/:id", notesController.getNote);
notesRoutes.delete("/:id", notesController.delete);
notesRoutes.get("/getNotes/:user_id", notesController.getNotes);

module.exports = notesRoutes;
