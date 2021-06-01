// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for birds
const Bird = require('../models/bird')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { bird: { title: '', text: 'foo' } } -> { bird: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /birds
// Index that will only return birds that are owned by user
// making the request
router.get('/birds', requireToken, (req, res, next) => {
  // access req.user for owner id
  const id = req.user.id
  // find the birds with owner of req.user.id
  Bird.find({ owner: id })
    .then(birds => {
      // `birds` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return birds.map(bird => bird.toObject())
    })
    // respond with status 200 and JSON of the birds
    .then(birds => res.status(200).json({ birds: birds }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX
// GET /birds
// Index that will return birds of ALL users regardless of
// the user making the request
router.get('/birds-all', requireToken, (req, res, next) => {
  Bird.find()
    .then(birds => {
      // `birds` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return birds.map(bird => bird.toObject())
    })
    // respond with status 200 and JSON of the birds
    .then(birds => res.status(200).json({ birds: birds }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /birds/5a7db6c74d55bc51bdf39793
router.get('/birds/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Bird.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "bird" JSON
    .then(bird => res.status(200).json({ bird: bird.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /birds
router.post('/birds', requireToken, (req, res, next) => {
  // set owner of new bird to be current user
  req.body.bird.owner = req.user.id

  Bird.create(req.body.bird)
    // respond to succesful `create` with status 201 and JSON of new "bird"
    .then(bird => {
      res.status(201).json({ bird: bird.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /birds/5a7db6c74d55bc51bdf39793
router.patch('/birds/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.bird.owner

  Bird.findById(req.params.id)
    .then(handle404)
    .then(bird => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, bird)

      // pass the result of Mongoose's `.update` to the next `.then`
      return bird.updateOne(req.body.bird)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /birds/5a7db6c74d55bc51bdf39793
router.delete('/birds/:id', requireToken, (req, res, next) => {
  Bird.findById(req.params.id)
    .then(handle404)
    .then(bird => {
      // throw an error if current user doesn't own `bird`
      requireOwnership(req, bird)
      // delete the bird ONLY IF the above didn't throw
      bird.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
