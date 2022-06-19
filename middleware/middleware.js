// Initialize nextConnect and Multiparty
// we’ll have the form data in `req.body`, and any files data in `req.files`.

import nextConnect from 'next-connect'
import multiparty from 'multiparty'

const middleware = nextConnect()

middleware.use(async (req, res, next) => {
  const form = new multiparty.Form()

  await form.parse(req, function (err, fields, files) {
    req.body = fields
    req.files = files
    next()
  })
})

export default middleware