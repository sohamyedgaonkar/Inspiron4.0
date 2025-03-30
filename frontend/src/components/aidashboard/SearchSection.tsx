import { Search } from 'lucide-react'
import React from 'react'

const SearchSection = ({onSearchInput}:any) => {
  return (
    <div className='p-8 bg-gradient-to-br from-black-500 via-black-700 to-blue-600 flex flex-col justify-center items-center text-white'>
        <h2 className='text-3xl font-bold '>Browse all Templates</h2>
        <p>What would you like to create today!</p>
        <div className='w-full py-2'>
            <div className='flex gap-2 items-center p-2 border rounded bg-white'>
                <Search className='text-primary'/>
               <input type="text" placeholder="Search " className='bg-transparent outline-none text-black'
               onChange={(event)=>onSearchInput(event.target.value)} />

            </div>
        </div>
    </div>
  )
}

export default SearchSection