const mongoose = require('mongoose')
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
  res.render('index', {title: 'Are you hungry'})
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store '})
}

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save()

  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`)
  res.redirect(`/store/${store.slug}`)
}

exports.getStores = async (req, res) => {
  // query db for list of all stores
  const stores = await Store.find()

  res.render('stores', {title: 'Stores', stores}) //< same as passing stores: stores
}

exports.editStore = async (req, res) => {
  // find the store given the id
  const store = await Store.findOne({ _id: req.params.id })
  // confirm they are owner of the store

  // render out edit form so user can update store
  res.render('editStore', {title: `Edit ${store.name}`, store})
}

exports.updateStore = async (req, res) => {
  //find and update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return new store instead of the old one
    runValidators: true,
  }).exec()

  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store ➝</a>`)

  //redirect them and tell them it worked
  res.redirect(`/stores/${store._id}/edit`)
}
