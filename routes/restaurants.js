const express = require('express');
const restaurantsRouter = express.Router();
const { Restaurant, MenuItem } = require('../models/');

// Your routes go here
restaurantsRouter.get('/', async (req, res, next) => {
  try {
    const restrants = await Restaurant.findAll();
    res.send(restrants);
  } catch (error) {
    next(error);
  }
});

restaurantsRouter.get('/:restaurantId', async (req, res, next) => {
  try {
    const theRestaurant = await Restaurant.findByPk(req.params.restaurantId, {
      include: {
        model: MenuItem,
        as: 'dishes',
      },
    });
    if (theRestaurant) {
      res.send(theRestaurant);
    } else {
      res.status(404).send('the restaurantId not fond');
    }
  } catch (error) {
    next(error);
  }
});

restaurantsRouter.post('/', async (req, res, next) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).send(newRestaurant);
  } catch (error) {
    next(error);
  }
});

// restaurantsRouter.put('/:restaurantId', async (req, res, next) => {
//   try {
//     const updatedItem = await Restaurant.update(req.body, {
//       where: {
//         id: req.params.restaurantId,
//       },
//     });
//     res.status(201).send(updatedItem);
//   } catch (error) {
//     next(error);
//   }
// });
restaurantsRouter.put('/:restaurantId', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId);

    // You can test your rate instance method here if you'd like
    // await restaurant.rate(5);

    await restaurant.update(req.body);
    res.status(201).send(restaurant);
  } catch (e) {
    next(e);
  }
});

restaurantsRouter.delete('/:restaurantId', async (req, res, next) => {
  try {
    await Restaurant.destroy({
      where: {
        id: req.params.restaurantId,
      },
    });
    res.status(204).send('the restaurant removed');
  } catch (error) {
    next(error);
  }
});

module.exports = restaurantsRouter;
