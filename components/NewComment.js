// Comment can be added in a post
// Uses the API route /api/comment

import { useRouter } from 'next/router'
import { useState } from 'react'


// Need to have some more information in the `NewComment` component.
// i.e. must know the comment too, because now a comment can be made to a comment, not just a post.
export default function NewComment({ post, comment }) {
  const router = useRouter()
  const [content, setContent] = useState('')

  const onclickSubmit = async(e) =>{
    e.preventDefault()
    if (!content) {
        alert('Enter some text in the comment')
          return
    }
    const requestParams = {
        body: JSON.stringify({
                    post: post.id,
    // In case we reply to a comment, i.e current? exists, then the current comment.id will be 
    // the parent, and we pass this info
                    comment: comment?.id, //for each comment we send the post information,
                                         // but also a “parent comment” id, and if we have
                                         // this information we send it when we make the 
                                         // POST call to /api/comment:
                    content: content,
                }),
        headers: {
                'Content-Type': 'application/json',
                },
        method: 'POST',
    }
    const res = await fetch('/api/comment',requestParams)
    // reload this page
    router.reload(window.location.pathname)
   }

  return (
    <form
      className='flex flex-col mt-10'
      onSubmit={onclickSubmit}
    >
      <textarea
        className='border border-gray-700 p-4 w-full text-lg font-medium bg-transparent outline-none color-primary '
        rows={1}
        cols={50}
        placeholder='Add a comment'
        onChange={(e) => setContent(e.target.value)}
      />
      <div className='mt-5'>
        <button className='border border-gray-700 px-8 py-2 mt-0 mr-8 font-bold '>
          Comment
        </button>
      </div>
    </form>
  )
}