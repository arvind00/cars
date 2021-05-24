
const CarModel = require('./cars.model');

exports.makeEntry = (data) => {
    console.log('Car Save initiated');
    return CarModel.insertMany(data).then(d => {
        console.log('Car entry saved');
        return d[0];
    })
}

exports.getAll = async () => {
    console.log('Fetching all cars...');
    try {
        let result = await CarModel.find({});
        console.log('Fetched all cars.')
        return result;
    } catch (error) {
        throw error;
    }
}