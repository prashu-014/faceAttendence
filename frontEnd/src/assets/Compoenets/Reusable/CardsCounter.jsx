import React from 'react'

export const CardsCounter = ({element}) => {
  return (
    <div className='p-2  py-1'>{element.name}
    <hr className='p-0 my-2' />
    <h1>{element.count} </h1>
    </div>

  )
}
