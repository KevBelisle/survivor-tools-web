import React from 'react'
import NewsletterSummary from './NewsletterSummary'

const NewsletterListSimple = ({ filteredNewsletters }) => {
  return (
    <>
      {filteredNewsletters.map((newsletter) => (
        <NewsletterSummary
          key={newsletter.item.id}
          newsletter={newsletter.item}
          searchMatches={newsletter.matches?.[0].indices}
          includeDate
        />
      ))}
    </>
  )
}

export default NewsletterListSimple
