import React from 'react'
import UpdateSummary from './UpdateSummary'

const UpdateListSimple = ({ filteredUpdates }) => {
  return (
    <>
      {filteredUpdates.map((update) => (
        <UpdateSummary
          key={update.item.id}
          update={update.item}
          searchMatches={update.matches?.[0].indices}
          includeDate
        />
      ))}
    </>
  )
}

export default UpdateListSimple
