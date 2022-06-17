// a dynamic page that receives the name of a subreddit as the parameter

import prisma from 'lib/prisma'
import { getSubreddit, getPostsFromSubreddit } from 'lib/data.js'
import Posts from 'components/Posts'
import Link from 'next/link'

export default function Subreddit({ subreddit, posts }) {
    if (!subreddit) {
        return <p className='text-center p-5'>Subreddit does not exist 😞</p>
    }

    return (
        <>
         {/*link to the homepage from a subreddit page*/}
        <Link href={`/`}>
            <a className='text-center p-5 underline block'>
            🔙 back to the homepage
            </a>
        </Link>
        <p className='text-center p-5'>/r/{subreddit.name}</p>
         <Posts posts={posts} />
        </>
    )
}

// params contains the route parameters. If the page name is [id].js , 
// then params will look like { id: ... }.

export async function getServerSideProps({ params }) {
    // Read from lib/data.js, first get the subreddit and from this get the posts
    const subreddit = await getSubreddit(params.subreddit, prisma)
    let posts = await getPostsFromSubreddit(params.subreddit, prisma)
    posts = JSON.parse(JSON.stringify(posts))

    return {
        props: {
        subreddit,
        posts,
        },
    }
}