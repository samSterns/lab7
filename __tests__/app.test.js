require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/Recipe');

describe('test app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can CREATE a recipe', () =>{
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [{ name: 'flour', measurement: 'cup', amount: 2 }]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{ _id: expect.any(String), name: 'flour', measurement: 'cup', amount: 2 }],
          __v: 0
        });
      });
  });
    
  it('GET recipe by ID', async() => {
    const recipe = await Recipe.create(
      {
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [{ name: 'flour', measurement: 'cup', amount: 2 }]
      }
    );
    return request(app)
      .get(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: recipe.name, 
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{  _id: expect.any(String), name: 'flour', measurement: 'cup', amount: 2 }],
          __v: 0
        });
      });
  });
    
  it('PATCH a recipe by ID', async() => {
    const recipe = await Recipe.create(
      {
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [{ name: 'flour', measurement: 'cup', amount: 2 }]
      }
    );
    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{  _id: expect.any(String), name: 'flour', measurement: 'cup', amount: 2 }],
          __v: 0 
        });
      });
  });
    
  it('can DELETE a recipe', async() => {
    const recipe = await Recipe.create(
      {
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [{ name: 'flour', measurement: 'cup', amount: 2 }]
      }
    );
    return request(app)
      .delete(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{  _id: expect.any(String), name: 'flour', measurement: 'cup', amount: 2 }],
          __v: 0
        });
      });
  });
})
;
