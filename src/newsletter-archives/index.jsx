import { HStack, Icon, Text } from '@chakra-ui/react'
import Fuse from 'fuse.js'
import React, { useEffect, useMemo, useState } from 'react'
import { HiArrowNarrowLeft, HiOutlineViewList } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import AppHeader from '../components/AppHeader'
import api from '../services/api'
import NewsletterDetails from './components/NewsletterDetails'
import NewsletterList from './components/NewsletterList'
import NewsletterListSearch from './components/NewsletterListSearch'

const NewsletterArchives = () => {
  useEffect(() => {
    document.title = 'KD Newsletter Archives | Survivor.tools'
  }, [])

  const { path, url } = useRouteMatch()

  const { isLoading, isError, data, error } = useQuery(
    'newsletterList',
    async () => {
      const { data } = await api.get('/newsletters')
      return data
    },
    {
      select: React.useCallback(
        (data) => ({
          newsletters: data.newsletters,
          fuse: new Fuse(data.newsletters, {
            minMatchCharLength: 3,
            useExtendedSearch: true,
            ignoreLocation: true,
            includeMatches: true,
            shouldSort: false,
            keys: ['text'],
          }),
        }),
        [],
      ),
      initialData: {
        newsletters: [],
        fuse: new Fuse([], {
          minMatchCharLength: 3,
          keys: ['text'],
        }),
      },
    },
  )

  window.fuse = data.fuse

  const [searchTerm, setSearchTerm] = useState('')

  const filteredNewsletters = useMemo(() => {
    if (!data) {
      return []
    }
    return searchTerm.length >= 3
      ? data.fuse.search(`'"${searchTerm}"`)
      : data.newsletters.map((x) => ({
          item: x,
        }))
  }, [data, searchTerm])

  return (
    <>
      <AppHeader
        backIcon={
          useRouteMatch('/newsletter').isExact ? (
            <></>
          ) : (
            <HStack spacing="0">
              <Text lineHeight="12px">
                <Icon as={HiOutlineViewList} />
              </Text>
              <Text lineHeight="12px">
                <Icon as={HiArrowNarrowLeft} />
              </Text>
            </HStack>
          )
        }
      ></AppHeader>
      <Switch>
        <Route
          path={`${path}/:newsletterId`}
          render={(routeProps) => (
            <NewsletterDetails
              newsletterId={routeProps.match.params.newsletterId}
              filteredNewsletters={filteredNewsletters}
            />
          )}
        ></Route>
        <Route path={path}>
          <NewsletterListSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <NewsletterList
            filteredNewsletters={filteredNewsletters}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        </Route>
      </Switch>
    </>
  )
}

export default NewsletterArchives
