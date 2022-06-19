// API route for creating a new post. Called from pages/r/[subreddit]/submit.js

import middleware from 'middleware/middleware'
import nextConnect from 'next-connect'
import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'
import fs from 'fs'
import path from 'path'
import AWS from 'aws-sdk'

// init nextConnect
const handler = nextConnect()
handler.use(middleware)

// init s3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})


// upload to amazon S3 aws, return location
const uploadFile = (filePath, fileName, id) => {
  return new Promise((resolve, reject) => {
        const content = fs.readFileSync(filePath)

        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `post-${id}${path.extname(fileName)}`,
          Body: content,
        }

        s3.upload(params, (err, data) => {
          if (err) {
            reject(err)
          }
          resolve(data.Location)
        })
  })
}

handler.post(async (req, res) =>{

    const session = await getSession({ req })

    if (!session) return res.status(401).json({ message: 'Not logged in' })

      // before posting, first find if the user is existing

    const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      })

    if (!user) return res.status(401).json({ message: 'User not found' })


    const post = await prisma.post.create({
        data: {
            title: req.body.title[0],  // [0] is needed because of the FormData added for image,
                                       // otherwise it generates an error
            content: req.body.content[0],
            subreddit: {
              connect: {
                name: req.body.subreddit_name[0],
              },
            },
            author: {
              connect: { id: user.id },
            },
          },
    })

    if (req.files && req.files.image[0] && req.files.image[0].size > 0) {
      // uploadFile returns URL of the image on S3 amazon
        const location = await uploadFile(
          req.files.image[0].path,
          req.files.image[0].originalFilename,
          post.id
        )

        await prisma.post.update({
          where: { id: post.id },
          data: {
            image: location,
          },
        })
    }
    res.json(post)
    return
})


export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler