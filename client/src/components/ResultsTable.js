import React from 'react'
import cx from 'classname'
import { StickyTable as Table, Row, Cell } from 'react-sticky-table'

import './ResultsTable.scss'

function ResultsTable({ className, columns, children }) {
  return (
    <Table
      className={cx('ResultsTable', className)}
      leftStickyColumnCount={0}
      topStickyColumnCount={columns ? 1 : 0}
    >
      {columns &&
        <Row className='ResultsTable__head'>
          {columns.map((column, i) =>
            <Cell key={i}>{column}</Cell>
          )}
        </Row>
      }
      {children}
    </Table>
  )
}

export default ResultsTable
export { Row, Cell }
