const express = require('express');
const mongoose = require('mongoose');
const Notebook = require('./models');
const notebooksRouter = express.Router();

const validateId = (req, res, next) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Notebook not found'});
    }
    next();
}

// create a new notebook: POST '/'
notebooksRouter.post('/', async (req, res) => {
    try {
        const {name, description} = req.body;
        if (!name) {
            return res.status(400).json({error: 'name is required'});
        }
        const notebook = new Notebook({name, description})
        const newNotebook = await Notebook.create(notebook);
        res.status(201).json({data: newNotebook});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Retrieve all notebooks: GET '/'
notebooksRouter.get('/', async (req, res) => {
    try {
        const notebooks = await Notebook.find();
        return res.status(200).json({data: notebooks});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Retrieve a single notebook: GET '/:id'
notebooksRouter.get('/:id', validateId, async (req, res) => {
    try {
        const notebook = await Notebook.findById(req.params.id);
        if (!notebook) {
            return res.status(404).json({error: 'notebook not found'});
        }
        return res.json({data: notebook});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Update a notebook: PUT '/:id'
notebooksRouter.put('/:id', validateId, async (req, res) => {
    try {
        const {name, description} = req.body;
        const notebook = await Notebook.findByIdAndUpdate(
            req.params.id,
            {name, description},
            {new: true}
        );
        if (!notebook) {
            return res.status(404).json({error: 'notebook not found'});
        }
        return res.status(200).send({data: notebook});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Delete a notebook: DELETE '/:id'
notebooksRouter.delete('/:id', validateId, async (req, res) => {
    try {
        const notebook = await Notebook.findByIdAndDelete(req.params.id);
        if (!notebook) {
            return res.status(404).json({error: 'notebook not found'});
        }
        return res.status(204).send();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});


module.exports = notebooksRouter;