// API Route for the setup page, called from /pages/setup.
// We update the name and company properties on the prisma.user model
// where the email field is equal to the current user’s email, which 
// we got through the session. Thanks to the getSession() function that
// NextAuth gives us

import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.end()

  if (req.method === 'POST') {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: req.body.name,
      },
    })

    res.end()
  }
}