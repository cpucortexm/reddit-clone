
// Get a post from the given Id
export const getPost = async (id, prisma) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    // Along with author, We can as well request comments section to read from the post
    comments: {
      orderBy: [
        {
          id: 'desc',
        },
      ],
      include: {
          author: true,
        },
    },
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

// give some feedback to the user, such as total votes, which we get by 
// subtracting upvotes and downvotes.
export const getVotes = async (post, prisma) => {
    const upvotes = await prisma.vote.count({
      where: {
        postId: post,
        up: true,
      },
    })
    const downvotes = await prisma.vote.count({
      where: {
        postId: post,
        up: false,
      },
    })

    return upvotes - downvotes
}


//  we’ll get the user’s vote:
export const getVote = async (post_id, user_id, prisma) => {
    const vote = await prisma.vote.findMany({
      where: {
        postId: post_id,
        authorId: user_id,
      },
    })

  if (vote.length === 0) return null
  return vote[0]
}