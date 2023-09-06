const notes = require('express').Router();
const { readFromFile, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all the notes
notes.get('/', (req, res) =>
	readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data))),
);

// POST Route for a specific note
notes.post('/', (req, res) => {
	let allNotes;
	readFromFile('./db/db.json')
		.then((data) => {
			// Parse the data as JSON
			allNotes = JSON.parse(data);
			// Deconstruct object
			const { title, text } = req.body;
			// Create new note
			if (req.body) {
				const newNote = {
					title,
					text,
					id: uuidv4(),
				};
				// Push new note into db
				allNotes.push(newNote);
				writeToFile('./db/db.json', allNotes);
			}
			res.status(200).json({ message: 'New note created successful.' });
		})
		.catch((err) => {
			res.status(404).json(err);
		});
});

// DELETE Route for a specific note
notes.delete('/:id', (req, res) => {
	let allNotes;
	readFromFile('./db/db.json')
		.then((data) => {
			// Parse the data as JSON
			allNotes = JSON.parse(data);
			// Deconstruct object
			const { id } = req.params;
			// Find index of the note id being deleted
			const delNoteIndex = allNotes.findIndex((note) => note.id == id);
			// Splice the index from db note array
			allNotes.splice(delNoteIndex, 1);
			// Return new array of notes
			writeToFile('./db/db.json', allNotes);
			res.status(200).json({ message: 'Note deleted successful.' });
		})
		.catch((err) => {
			res.status(404).json(err);
		});
});

module.exports = notes;
