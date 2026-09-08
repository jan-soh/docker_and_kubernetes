const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Note = require('./models');

const notebooksApiUrl = process.env.NOTEBOOKS_API_URL;
const notesRouter = express.Router();

const validateId = (req, res, next) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Note not found'});
    }
    next();
}

// create a new notebook: POST '/'
notesRouter.post('/', async (req, res) => {
    try {
        const {title, content, notebookId} = req.body;

        let validatedNotebookId = null;
        if (!notebookId) {
            console.info({message: 'Notebook ID not provided, storing without notebook association'});
        } else if (! mongoose.Types.ObjectId.isValid(notebookId)) {
            return res.status(400).json({error: 'Invalid notebook ID', notebookId});
        } else {
            try {
                await axios.get(`http://${notebooksApiUrl}/api/notebooks/${notebookId}`);
            } catch (err) {
                const jsonError = err.toJSON();
                if (jsonError.status === 404) {
                    return res.status(400).json({error: 'Notebook not found', notebookId});
                } else {
                    console.error({
                        message: 'Error validating notebook ID. Upstream notebookservice not available. Storing notebook ID for later validation.',
                        notebookId,
                        error: err.message
                    });
                }
            } finally {
                validatedNotebookId = notebookId;
            }
        }

        if (!title || !content) {
            return res.status(400).json({error: 'title and content are required'});
        }
        const note = new Note({title, content, notebookId: validatedNotebookId})
        const newNote = await Note.create(note);
        return  res.status(201).json({data: newNote});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Retrieve all notebooks: GET '/'
notesRouter.get('/', async (req, res) => {
    try {
        const notes = await Note.find();
        return res.status(200).json({data: notes});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Retrieve a single notebook: GET '/:id'
notesRouter.get('/:id', validateId, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({error: 'note not found'});
        }
        return res.json({data: note});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Update a notebook: PUT '/:id'
notesRouter.put('/:id', validateId, async (req, res) => {
    try {
        const {title, content} = req.body;
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            {title, content},
            {new: true}
        );
        if (!note) {
            return res.status(404).json({error: 'note not found'});
        }
        return res.status(200).send({data: note});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Delete a notebook: DELETE '/:id'
notesRouter.delete('/:id', validateId, async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({error: 'note not found'});
        }
        return res.status(204).send();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});


module.exports = notesRouter;