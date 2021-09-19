import { useState, useEffect } from 'react'

import range from 'components/Shared/rage'
import leftArrow from 'images/left-path.png'
import rightArrow from 'images/right-path.png'
import * as S from './pagination.styles'

const LEFT_PAGE = 'LEFT'
const RIGHT_PAGE = 'RIGHT'

const Pagination = (props) => {
  const [isCurrentPage, setIsCurrentPage] = useState(1)
  let { totalMembers, pageLimit, pageNeighbors } = props

  totalMembers = typeof totalUsers === 'number' ? totalMembers : 200
  pageLimit = typeof pageLimit === 'number' ? pageLimit : 9

  pageNeighbors =
    typeof pageNeighbors === 'number'
      ? Math.max(0, Math.min(pageNeighbors, 2))
      : 0

  const totalPages = Math.ceil(totalMembers / pageLimit)

  const gotoPage = (page) => {
    const { onPageChanged = (i) => i } = props

    const currentPage = Math.max(0, Math.min(page, totalPages))

    const paginationData = {
      currentPage,
      totalPages,
      pageLimit,
      totalMembers
    }
    setIsCurrentPage(currentPage)
    onPageChanged(paginationData)
  }

  useEffect(() => {
    gotoPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = (page, evt) => {
    evt.preventDefault()
    gotoPage(page)
  }

  const handleMoveLeft = (evt) => {
    evt.preventDefault()
    gotoPage(isCurrentPage - pageNeighbors * 2 - 1)
  }

  const handleMoveRight = (evt) => {
    evt.preventDefault()
    gotoPage(isCurrentPage + pageNeighbors * 2 + 1)
  }

  const fetchPageNumbers = () => {
    const totalNumbers = pageNeighbors * 2 + 3
    const totalBlocks = totalNumbers + 2

    if (totalPages > totalBlocks) {
      let pages = []

      const leftBound = isCurrentPage - pageNeighbors
      const rightBound = isCurrentPage + pageNeighbors
      const beforeLastPage = totalPages - 1

      const startPage = leftBound > 2 ? leftBound : 2
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage

      pages = range(startPage, endPage)

      const pagesCount = pages.length
      const singleSpillOffset = totalNumbers - pagesCount - 1

      const leftSpill = startPage > 2
      const rightSpill = endPage < beforeLastPage

      const leftSpillPage = LEFT_PAGE
      const rightSpillPage = RIGHT_PAGE

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1)
        pages = [leftSpillPage, ...extraPages, ...pages]
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset)
        pages = [...pages, ...extraPages, rightSpillPage]
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage]
      }

      return [1, ...pages, totalPages]
    }

    return range(1, totalPages)
  }

  if (!totalMembers) return null

  if (totalPages === 1) return null

  const pages = fetchPageNumbers()

  return (
    <S.PaginationWrapper>
      <button
        type="button"
        className="left-button"
        disabled={isCurrentPage === 1}
        onClick={(event) => handleClick(isCurrentPage - 1, event)}
      >
        <img src={leftArrow} alt="button-icon" />
      </button>
      <ul className="pagination">
        {pages.map((page, index) => {
          if (page === LEFT_PAGE)
            return (
              <li key={index} className="page-item">
                <a className="page-link" href="#" onClick={handleMoveLeft}>
                  <span>&laquo;</span>
                </a>
              </li>
            )

          if (page === RIGHT_PAGE)
            return (
              <li key={index} className="page-item">
                <a className="page-link" href="#" onClick={handleMoveRight}>
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            )

          return (
            <li
              key={index}
              className={`page-item${isCurrentPage === page ? ' active' : ''}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={(event) => handleClick(page, event)}
              >
                {page}
              </a>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className="right-button"
        disabled={isCurrentPage === 23}
        onClick={(event) => handleClick(isCurrentPage + 1, event)}
      >
        <img src={rightArrow} alt="button-icon" />
      </button>
    </S.PaginationWrapper>
  )
}

export default Pagination
