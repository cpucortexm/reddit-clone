import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'

// We call this route API in pages/r/[subreddit]/comments/[id].js when we click the arrow

// Since we only allow one vote per user, we use the upsert() method 
// provided by Prisma to update or insert a value if it’s not there. 
// We can only upvote or downvote, but we cant unset it

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(501).end()
    }

    const session = await getSession({ req })

    if (!session) return res.status(401).json({ message: 'Not logged in' })

    const user = await prisma.user.findUnique({
        where: {
        id: session.user.id,
        },
    })

  if (!user) return res.status(401).json({ message: 'User not found' })


  // upsert = either update an existing or create new db record
  if (req.method === 'POST') {
    await prisma.vote.upsert({
        // Each vote must have a unique author(user) and postId
        // This is needed to prevent double voting.
        // If such a user already exists then update, else create a new one
            where: {
                authorId_postId: {
                authorId: user.id,
                postId: req.body.post,
                },
            },
            update: {
                up: req.body.up,
            },
            create: {
                up: req.body.up,
                post: {
                connect: {
                    id: req.body.post,
                },
            },
            author: {
                connect: { id: user.id },
            },
        },
        })

        res.end()
        return
    }
}