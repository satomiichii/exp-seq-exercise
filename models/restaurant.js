const Sequelize = require('sequelize');
const db = require('./db');
const MenuItem = require('./menuItem');

const Restaurant = db.define('restaurant', {
  // Your code here
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  },
  cuisineType: {
    type: Sequelize.ENUM('CHINESE', 'MEXICAN', 'KOREAN', 'INDIAN', 'AMERICAN'),
    allowNull: false,
    notEmpty: true,
  },
  rating: {
    type: Sequelize.FLOAT(2),
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  },
  numVisits: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  discription: {
    type: Sequelize.VIRTUAL,
    get() {
      return `${this.name}serves ${this.cuisineType} food!`;
    },
  },
});

// Your instance + class methods go here
Restaurant.findBestBy = function (rating) {
  return this.findAll({
    where: { rating: { [Sequelize.Op.gte]: [rating] } },
  });
};

Restaurant.prototype.rate = async function (newRating) {
  this.rating = newRating;
  await this.save();
};
// Your hooks go here
// Restaurant.beforeUpdate((restaurant) => {
//   restaurant.numVisits++;
// });

Restaurant.addHook('beforeUpdate', function (restaurant) {
  restaurant.numVisits++;
});

Restaurant.beforeValidate((restaurant) => {
  restaurant.name = restaurant.name
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
});

module.exports = Restaurant;
