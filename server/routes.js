const express = require('express');
const router = express.Router();
const carService = require('./db_modules/car/car.service');

router.post('/enter_car', (req, res, next) => {
    carService.makeEntry(req.body)
    .then((data) => {
        console.log('Entered ', data);
        res.json(data);
    })
    .catch(err => {
        console.log(err.message);
        next(err);
    })
});

router.get('/car/getAll', (req, res, next) => {
    carService.getAll()
    .then(data=>{
        res.json(data);
    }).catch(err =>{
        console.log(err.message);
        next(err);
    });
});

module.exports = router;