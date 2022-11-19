const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const todo = [
    { task_id: 1, name: 'Task1' },
    { task_id: 2, name: 'Task2' },
    { task_id: 3, name: 'Task3' },
];

app.get('/api/todo', (req, res) => {
    res.send(todo); 
});

app.get('/api/todo/:task_id', (req, res) => {
    const TASK = todo.find(c => c.task_id === parseInt(req.params.task_id)); 
    if (!TASK) return res.status(404).send('The task with the given ID was not found');// 404
    res.send(TASK);
});

app.post('/api/todo', (req, res) => {
    const { error } = validateTask(req.body); // result.error

    if (error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - Bad request

    const TASK = {
       task_id: todo.length + 1,
       name:  req.body.name
    };
    todo.push(TASK);
    res.send(TASK);
});

app.put('/api/todo/:task_id', (req, res) => {
    
    const TASK = todo.find(c => c.task_id === parseInt(req.params.task_id)); // Look up the task
    if (!TASK) return res.status(404).send('The task with the given ID was not found'); // If not existing, return 404

    const schema = {
        name: Joi.string().min(3).required()
    };
    
    const { error } = validateTask(req.body);// result.error

    if (error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - Bad request
    
    TASK.name = req.body.name; // Update task

    res.send(TASK); // Return the updated task

});

app.delete('/api/todo/:task_id', (req, res) => {
    const TASK = todo.find(c => c.task_id === parseInt(req.params.task_id)); // Look up the task
    if (!TASK) return res.status(404).send('The task with the given ID was not found'); // If not existing, return 404
    
    const index = todo.indexOf(TASK);
    todo.splice(index, 1); // Delete

    res.send(TASK); // Return the same task

});

function validateTask(TASK) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(TASK, schema);// Validate
};

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));