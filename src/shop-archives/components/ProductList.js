import React from 'react'

import ProductListSearch from './ProductListSearch'
import ProductMasonry from './ProductMasonry'
import ProductMasonrySkeleton from './ProductMasonrySkeleton'

const ProductList = ({
  searchTerm,
  setSearchTerm,
  tagFilters,
  dispatchTagFilterChange,
  typeFilters,
  dispatchTypeFilterChange,
  stateFilters,
  dispatchStateFilterChange,
  filteredProducts,
  isLoading,
  isError,
  error,
}) => {
  return (
    <>
      <ProductListSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tags={tagFilters}
        types={typeFilters}
        states={stateFilters}
        dispatchTagFilterChange={dispatchTagFilterChange}
        dispatchTypeFilterChange={dispatchTypeFilterChange}
        dispatchStateFilterChange={dispatchStateFilterChange}
      />
      {isLoading ? (
        <ProductMasonrySkeleton />
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : (
        <ProductMasonry products={filteredProducts} />
      )}
    </>
  )
}

export default ProductList
