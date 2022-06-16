// Page which gets triggered if the user session is not set from the home page (index.js)
// This asks user to setup name and checkbox if the user is a company using a form
// When the user click save, we route to /api/setup

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Setup() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const loading = status === 'loading'

    const [name, setName] = useState('')

    if (loading) return null

    if (!session || !session.user) {
        router.push('/')
        return null
    }

    if (!loading && session && session.user.name) {
        router.push('/')
    }

    const handleSave = async (event) => {
        // Stop the form from submitting and refreshing the page.
          event.preventDefault()
          // Post the content to the API route /api/setup for the user name and company
          const requestParams = {
              body: JSON.stringify({
                          name,
                        }),
              headers: {'Content-Type': 'application/json',},
              method: 'POST',
          }
          const result = await fetch('/api/setup', requestParams)

          session.user.name = name
          router.push('/')
    }

    return(

        <form
            className='mt-10 ml-20' onSubmit={handleSave}
        >
            {/*  do some frontend validation to ensure the username is 5 characters and is alphanumeric 
            via a regular expression pattern:*/}
            <div className='flex-1 mb-5'>
                    <div className='flex-1 mb-5'>Choose a username</div>
                    <input
                    type='text'
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='border p-1'
                    required                
                    pattern='\w*'
                    title='Numbers or letters or _ only'
                    placeholder='Numbers or letters or _ only'
                    minLength='5'
                    />
            </div>
            <button className='border px-8 py-2 mt-0 mr-8 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover'>
                Save
            </button>
        </form>
    )

}