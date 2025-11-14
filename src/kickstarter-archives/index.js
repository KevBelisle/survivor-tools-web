import { HStack, Icon, Text } from '@chakra-ui/react'
import Fuse from 'fuse.js'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { HiArrowNarrowLeft, HiOutlineViewList } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import AppHeader from '../components/AppHeader'
import api from '../services/api'
import UpdateDetails from './components/UpdateDetails'
import UpdateList from './components/UpdateList'
import UpdateListSearch from './components/UpdateListSearch'

const KickstarterArchives = () => {
  useEffect(() => {
    document.title = 'KD Kickstarter Archives | Survivor.tools'
  }, [])

  const { path, url } = useRouteMatch()

  const { isLoading, isError, data, error } = useQuery(
    'updateList',
    async () => {
      const { data } = await api.get('/kickstarter-updates')
      return data
    },
    {
      select: React.useCallback(
        (data) => ({
          updates: data.updates,
          fuse: new Fuse(data.updates, {
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
        updates: [],
        fuse: new Fuse([], {
          minMatchCharLength: 3,
          keys: ['text'],
        }),
      },
    },
  )

  window.fuse = data.fuse

  const [searchTerm, setSearchTerm] = useState('')

  const filteredUpdates = useMemo(() => {
    if (!data) {
      return []
    }
    return searchTerm.length >= 3
      ? data.fuse.search(`'"${searchTerm}"`)
      : data.updates.map((x) => ({
          item: x,
        }))
  }, [data, searchTerm])

  return (
    <>
      <AppHeader
        backIcon={
          useRouteMatch('/kickstarter').isExact ? (
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
          path={`${path}/:updateId`}
          render={(routeProps) => (
            <UpdateDetails
              updateId={routeProps.match.params.updateId}
              filteredUpdates={filteredUpdates}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          )}
        ></Route>
        <Route path={path}>
          <UpdateListSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <UpdateList
            filteredUpdates={filteredUpdates}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        </Route>
      </Switch>
    </>
  )
}

export default KickstarterArchives
