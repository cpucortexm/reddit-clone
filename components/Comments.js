// Display the comments posted by the users under a post
// Steps for comments to comment
/*
  1. have a “reply” text below each comment
  2. when the “reply” text is clicked, we show a form to reply with a comment
  3. we implement the form to send the data to our API
  4. we’ll store that comment in the database
  5. we’ll display comments made to comments
*/
import timeago from 'lib/timeago'
import { useState } from 'react'
import NewComment from 'components/NewComment'

// put a “reply” text below each comment
const Comment = ({ comment, post }) => {
  // add a click handler so we set the showReply state variable to true if it’s clicked
  const [showReply, setShowReply] = useState(false)
  return (
    <div className=' mt-6'>
      <p>
        <Link href={`/u/${comment.author.name}`}>
            <a className='underline'>{comment.author.name}</a>
        </Link>{' '} 
        {timeago.format(new Date(comment.createdAt))}
      </p>
      <p>{comment.content}</p>

      {/*When the “reply” text is clicked, we show a form(from NewComment) to reply with a comment*/}
      {showReply ? (
          <div className='pl-10'>
            <NewComment post={post} comment={comment}  />
          </div>
        ) : (
          <p
            className='underline text-sm cursor-pointer'
            onClick={() => setShowReply(true)}
          >
            reply
          </p>
        )}
    </div>
  )
}

// accept post as prop as we need it for comment
export default function Comments({ comments, post }) {
  if (!comments) return null

  return (
    <>
      {comments.map((comment, index) => (
        <>
           <Comment key={index} comment={comment} post={post} />
           {/*display comments made to comments */}
           {comment.comments && (
            <div className='pl-10'>
              <Comments comments={comment.comments} post={post} />
            </div>
          )}
        </>
      ))}
    </>
  )
}