require('dotenv').config();
require('../utils/connect')();

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../models/Recipe');
const Recipe = require('./Recipe');

describe('Recipe model', () => {
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let recipe;

  beforeEach(async() => {
    recipe = await Recipe.create({
      name: 'soup',
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('has a required name', () => {
    const recipe = new Recipe();
    const { errors } = recipe.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('has a name and directions field', () => {
    const recipe = new Recipe({
      name: 'Cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    expect(recipe.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
  });

  it('can CREATE a recipe', () =>{
    return request(app)
      .post('/api/v1/recipe')
      .send({
        name: 'soup',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        _id: expect.any(String),
        name: 'soup',
        directions: [
          { _id: expect.any(String), 'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'}
        ],
        _v: 0
      });
  });

  it('GETs by ID recipe', async() => {
    return request(app)
      .get('api/v1/recipe')
      .then(res => {
        expect(res.body).toEqual([{
          _id: recipe._id.toString();
          name: recipe.name, 
          directions: [
            { _id: expect.any(String), 'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'}
          ],
          _v: 0
        }]);
      });
  });

  it('PATCH a recipe by ID', async() => {
    return request(app)
    .patch(`api/v1/recipe/${recipe._id}`)
    .send({ name: 'cookies'})
    .then(res => {
      expect(res.body).toEqual({
        _id: recipe._id.toString(),
        name: 'cookies',
        directions: [
          { _id: expect.any(String), 'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes' }
        ],
        _v: 0 
      });
    });
  });

  it('can DELETE a recipe', async() => {
    return request(app)
    .delete(`api/v1/recipe/${recipe._id}`)
    .then(res => {
      expect(res.body).toEqual({
        _id: recipe._id.toString(),
        name: 'soup',
        drections: [
          { _id: expect.any(String), 'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes' }
        ],
        _v: 0
      });
    });
  });

});
