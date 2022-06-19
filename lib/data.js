
 // responsible for actually fetching comments. It is recursive since
 // it calls fetchCommentsOfComments() again, so we fetch comments of
 // comments made to comments, etc:
 // trick” is enough to display nested comments, so we have infinite 
 // levels of comments possible with no further work on our side:
const getComments = async (parent_id, prisma) => {
  let comments = await prisma.comment.findMany({
    where: {
      parentId: parent_id,
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

  if (comments.length) {
    comments = await fetchCommentsOfComments(comments, prisma)
  }

  return comments
}



// this iterates over the comments array and uses Array.map() to call multiple async 
// function calls and wait until they are all finished:
const fetchCommentsOfComments = async (comments, prisma) => {
  const fetchCommentsOfComment = async (comment, prisma) => {
    comment.comments = await getComments(comment.id, prisma)
    return comment
  }

  return Promise.all(
    comments.map((comment) => {
      comment = fetchCommentsOfComment(comment, prisma)
      return comment
    })
  )
}


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
      where: {
          parentId: null,    // Important, so only top level comments show up in the top level
      },
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
  // If the post has comments, for each comment we call this new function
  if (post.comments) {
    post.comments = await fetchCommentsOfComments(post.comments, prisma)
  }
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