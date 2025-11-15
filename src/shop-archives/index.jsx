import { HStack, Icon, Text } from '@chakra-ui/react'
import Fuse from 'fuse.js'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { HiArrowNarrowLeft, HiOutlineViewGrid } from 'react-icons/hi'
import { useQuery } from '@tanstack/react-query'
import { Routes, Route, useMatch, useLocation } from 'react-router-dom'

import AppHeader from '../components/AppHeader'
import api from '../services/api'
import ProductDetailsContainer from './components/ProductDetailsContainer'
import ProductList from './components/ProductList'

const ShopArchives = () => {
  useEffect(() => {
    document.title = 'KD Shop Archives | Survivor.tools'
  }, [])

  const location = useLocation()
  const isExactMatch = useMatch('/shop')

  const { isLoading, isError, data, error } = useQuery(
    'productList',
    async () => {
      const { data } = await api.get('/products')
      return data
    },
    {
      select: React.useCallback(
        (data) => ({
          products: data.products,
          fuse: new Fuse(data.products, {
            minMatchCharLength: 3,
            keys: ['title'],
          }),
          tags: data.products.reduce((tags, product) => {
            product.currentTags
              ?.map((x) => x.toLowerCase())
              .forEach((tag) => {
                if (!(tag in tags)) {
                  tags[tag] = false
                }
              })
            product.previousTags
              ?.map((x) => x.toLowerCase())
              .forEach((tag) => {
                if (!(tag in tags)) {
                  tags[tag] = false
                }
              })
            return tags
          }, {}),
          types: data.products.reduce((types, product) => {
            if (product.type && !(product.type.toLowerCase() in types)) {
              types[product.type.toLowerCase()] = false
            }
            return types
          }, {}),
          states: data.products.reduce((states, product) => {
            if (product.state && !(product.state.toLowerCase() in states)) {
              states[product.state.toLowerCase()] = false
            }
            return states
          }, {}),
        }),
        [],
      ),
      initialData: {
        products: [],
        fuse: new Fuse([], {
          minMatchCharLength: 3,
          keys: ['title'],
        }),
        tags: [],
        types: [],
        states: [],
      },
    },
  )

  const [searchTerm, setSearchTerm] = useState('')

  const [tagFilters, dispatchTagFilterChange] = useReducer((state, action) => {
    if (action.action === 'newTagList') {
      return action.payload
    }
    if (action.action === 'tagFilterChanged') {
      var newState = { ...state }
      newState[action.payload.name] = action.payload.value
      return newState
    }
  }, {})

  const [typeFilters, dispatchTypeFilterChange] = useReducer(
    (state, action) => {
      if (action.action === 'newTypeList') {
        return action.payload
      }
      if (action.action === 'typeFilterChanged') {
        var newState = { ...state }
        newState[action.payload.name] = action.payload.value
        return newState
      }
    },
    {},
  )

  const [stateFilters, dispatchStateFilterChange] = useReducer(
    (state, action) => {
      if (action.action === 'newStateList') {
        return action.payload
      }
      if (action.action === 'stateFilterChanged') {
        var newState = { ...state }
        newState[action.payload.name] = action.payload.value
        return newState
      }
    },
    {},
  )

  const filteredProducts = useMemo(() => {
    if (!data) {
      return []
    }
    const titleMatches =
      searchTerm.length >= 3
        ? data.fuse.search(searchTerm).map((x) => x.item)
        : data.products
    const tagsMatch =
      Object.values(tagFilters).filter((x) => x).length > 0
        ? titleMatches.filter(
            (product) =>
              product.currentTags.some(
                (tag) => tagFilters[tag.toLowerCase()],
              ) ||
              product.previousTags.some((tag) => tagFilters[tag.toLowerCase()]),
          )
        : titleMatches
    const typesMatch =
      Object.values(typeFilters).filter((x) => x).length > 0
        ? tagsMatch.filter((product) => typeFilters[product.type.toLowerCase()])
        : tagsMatch
    const statesMatch =
      Object.values(stateFilters).filter((x) => x).length > 0
        ? typesMatch.filter(
            (product) => stateFilters[product.state.toLowerCase()],
          )
        : typesMatch
    return statesMatch
  }, [data, searchTerm, tagFilters, typeFilters, stateFilters])

  useEffect(() => {
    dispatchTagFilterChange({ action: 'newTagList', payload: data.tags })
    dispatchTypeFilterChange({ action: 'newTypeList', payload: data.types })
    dispatchStateFilterChange({ action: 'newStateList', payload: data.states })
  }, [data.tags, data.types, data.states])

  return (
    <>
      <AppHeader
        backIcon={
          isExactMatch ? (
            <></>
          ) : (
            <HStack spacing="0">
              <Text lineHeight="12px">
                <Icon as={HiOutlineViewGrid} />
              </Text>
              <Text lineHeight="12px">
                <Icon as={HiArrowNarrowLeft} />
              </Text>
            </HStack>
          )
        }
      ></AppHeader>
      <Routes>
        <Route
          path=":productId"
          element={
            <ProductDetailsContainer
              productId={location.pathname.split('/').pop()}
              filteredProducts={filteredProducts}
            />
          }
        />
        <Route
          path="/"
          element={
            <ProductList
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              tagFilters={tagFilters}
              dispatchTagFilterChange={dispatchTagFilterChange}
              typeFilters={typeFilters}
              dispatchTypeFilterChange={dispatchTypeFilterChange}
              stateFilters={stateFilters}
              dispatchStateFilterChange={dispatchStateFilterChange}
              filteredProducts={filteredProducts}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          }
        />
      </Routes>
    </>
  )
}

export default ShopArchives
