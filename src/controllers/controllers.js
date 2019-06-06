import Note from '../models/models';

// create and save new note
exports.create = (req, res) => {

    //validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Note content cannot be empty create"
        });
    }

    // Create a Note
    const note = new Note({
        title: req.body.title || "Untitled Note",
        content: req.body.content
    });

    // save note in the DB
    note.save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating the note."
            });
        });
};

// retrieve and return all notes
exports.findAll = (req, res) => {
    Note.find()
        .then(notes => {
            res.send(notes);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving notes."
            });
        });
};

// find a single note with noteId
exports.findOne = (req, res) => {
    Note.findById(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: `Note not found with id ${req.params.noteId}`
                });
            }
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: `Note not found with id ${req.params.noteId}`
                });
            }
            return res.status(500).send({
                message: `Error retrieving note with id ${req.params.noteId}`
            });
        });
};

// update a note identified with noteId
exports.update = (req, res) => {

    // validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: 'Note content cannot be empty'
        });
    }

    // find note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || 'Untitled note',
        content: req.body.content
    },
        { new: true }
    )
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: `Note not found with id ${req.params.noteId}`
                });
            }
            res.send(note);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: `Note not found with id ${req.params.noteId}`
                });
            }
            return res.status(500).send({
                message: `Error updating note with id ${req.params.noteId}`
            });
        });
};

// delete a note identified with noteId
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send({ message: "Note deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Could not delete note with id " + req.params.noteId
            });
        });
};