
// Get a post from the given Id
export const getPost = async (id, prisma) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  })

  return post
}

// Get all the posts
export const getPosts = async (prisma) => {
    const posts = await prisma.post.findMany({
        where: {},
        orderBy: [
        {
            id: 'desc',
        },
        ],
        include: {
        author: true,
        }
    })

    return posts
}

// Get Subreddit using its name
export const getSubreddit = async (name, prisma) => {
    return await prisma.subreddit.findUnique({
        where: {
            name,
        },
    })
}

// From a subreddit. get all the posts
export const getPostsFromSubreddit = async (subreddit, prisma) => {
    const posts = await prisma.post.findMany({
        where: {
        subreddit: {
            name: subreddit,
        },
        },
        orderBy: [
        {
            id: 'desc',
        },
        ],
        include: {
        author: true,
        },
    })

  return posts
}