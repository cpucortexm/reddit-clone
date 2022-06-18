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
            <header className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
                <Link href={`/`}>
                    <a className='underline'>Home</a>
                </Link>
                <p className='grow'></p>
            </header>
            <header className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
                <p className='text-center'>/r/{subreddit.name}</p>
                <p className='ml-4 text-left grow'>{subreddit.description}</p>
            </header>
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