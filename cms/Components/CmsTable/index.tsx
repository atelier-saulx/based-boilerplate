import React, { CSSProperties, FC, useState, useRef, useEffect } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeGrid as Grid } from 'react-window'
import { Style, styled } from 'inlines'
import { SortOptions, useInfiniteQuery } from './useInfiniteQuery'
import { BasedQuery } from '@based/client'
import { RenderAs } from './RenderAs'
import { useClient } from '@based/react'
import {
  Row,
  Modal,
  IconEye,
  IconSortDesc,
  IconSortAsc,
  IconDelete,
  IconFilter,
  Button,
  Dropdown,
  Input,
  Text,
  color,
  IconCopy,
} from '@based/ui'

type CmsTableProps = {
  data?: any
  width?: number
  height?: number
  queryId?: number | string
  query?: (
    start: number,
    limit: number,
    sortOptions?: SortOptions,
    filter?: {}
  ) => BasedQuery
  getQueryItems?: (data: any) => any[]
  filter?: {
    $field?: string
    $operator?: string
    $value?: string | number | boolean
  }
  onRowClick?: (v, rIdx) => void
  onCellClick?: (v, rIdx, cIdx) => void
  onDelete?: () => void
  columnNamesInRightOrder?: string[]
  style?: CSSProperties | Style
}

export const CmsTable: FC<CmsTableProps> = ({
  data,
  width = 300,
  height = 300,
  queryId,
  query,
  getQueryItems,
  onRowClick,
  onCellClick,
  onDelete,
  columnNamesInRightOrder,
  style,
  filter,
}) => {
  const [hiddenColumns, setFilteredColumns] = useState<string[]>([])
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    $field: 'updatedAt',
    $order: 'desc',
  })
  const [selectedRowIndexes, setSelectedRowIndexes] = useState<number[]>([])

  // filter shizzle
  const [andOr, setAndOr] = useState('$and')
  const [operator, setOperator] = useState('=')
  const [fieldValue, setFieldValue] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [addedFilters, setAddedFilters] = useState<{}[]>([])
  const [customFilter, setCustomFilter] = useState<any>()

  let w = width
  let h = height

  let COLUMN_WIDTH = 124
  let ROW_HEIGHT = 60

  const result = useInfiniteQuery({
    query,
    getQueryItems,
    rowHeight: 60,
    queryId:
      queryId +
      sortOptions.$field +
      sortOptions.$order +
      customFilter +
      addedFilters.length,
    sortOptions: sortOptions,
    itemCount: data?.length,
    height: h,
    filter: customFilter || filter,
  })

  const parsedData = query ? result.items : data

  // console.log(filter, customFilter, 'Query??')

  const client = useClient()

  let columnNames: any[] = [...new Set(parsedData?.flatMap(Object.keys))]

  // console.log(columnNamesInRightOrder, '🍟')
  if (columnNamesInRightOrder && columnNamesInRightOrder.length > 0) {
    columnNames = columnNamesInRightOrder
  }

  let hiddenColumnNames = columnNames?.filter(
    (item) => !hiddenColumns?.includes(item?.toLowerCase())
  )

  useEffect(() => {
    setCustomFilter('')
    setAddedFilters([])
    setSelectedRowIndexes([])
  }, [queryId])
  // console.log(result, 'Result>?')
  // console.log(parsedData, 'ParsedDAta?')
  //  console.log(query, 'the query?')
  //   console.log(filter, 'What the filter man')

  // update the filter
  useEffect(() => {
    if (addedFilters.length > 0) {
      let allKeys = addedFilters.map(
        (item, idx) => Object.keys(addedFilters[idx][0])[0]
      )

      var nestedObject = {}
      allKeys.reduce(function (o, s, idx) {
        return (o[s] = addedFilters[idx][0][s])
      }, nestedObject)

      let filterCopy = { ...filter }
      filterCopy[allKeys[0]] = nestedObject[allKeys[0]]
      //  filter[allKeys[0]] = nestedObject[allKeys[0]]

      //   console.log('🥝', filter)
      console.log('🥥', filterCopy)
      setCustomFilter({ ...filterCopy })
    }
  }, [addedFilters.length])

  const tableHeaderRef = useRef<HTMLDivElement>()

  const Cell = ({ columnIndex, rowIndex, style }) => {
    return (
      <styled.div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${color(
            'inputBorder',
            'neutralNormal',
            'default'
          )}`,
          paddingRight: 8,
          cursor: onRowClick ? 'pointer' : 'auto',
          ...style,
        }}
        onClick={() => {
          if (onRowClick) {
            setSelectedRowIndexes([])
            onRowClick(parsedData[rowIndex], rowIndex)
          }

          if (onCellClick) {
            onCellClick(
              parsedData[rowIndex][hiddenColumnNames[columnIndex]],
              rowIndex,
              columnIndex
            )
          }
        }}
      >
        {columnIndex === 0 && (
          <styled.div
            style={{
              marginRight: '8px',
              marginLeft: '3px',
              '& div': { width: '24px' },
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation()
                // e.preventDefault()
              }}
            >
              <Input
                type="checkbox"
                style={{ maxWidth: 24 }}
                value={selectedRowIndexes.includes(rowIndex)}
                onChange={() => {
                  console.log('selected rowindex', rowIndex)
                  if (!selectedRowIndexes.includes(rowIndex)) {
                    setSelectedRowIndexes([...selectedRowIndexes, rowIndex])
                  } else {
                    let tempArr = selectedRowIndexes.filter(
                      (item) => item !== rowIndex
                    )
                    setSelectedRowIndexes([...tempArr])
                  }
                }}
              />
            </div>
          </styled.div>
        )}
        {/* render cell based on column name type renderAs */}
        <RenderAs
          input={parsedData[rowIndex][hiddenColumnNames[columnIndex]]}
          colName={hiddenColumnNames[columnIndex]}
        />
      </styled.div>
    )
  }

  const scrollbarColor = color('border', 'default', 'strong')
  const transparentAreaColor = color('background', 'default', 'surface')
  const borderColor = color('inputBorder', 'neutralNormal', 'default')

  return (
    <styled.div
      style={{
        width: w,
        height: h,
        '& .grid-class': {
          scrollbarGutter: 'stable',
          // overflowY: 'overlay',
          // overflowX: 'overlay',
          overflow: 'scroll !important',
          // firefox
          scrollbarColor: `${scrollbarColor} transparent`,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            visibility: 'hidden',
          },
          // the rest
          '&::-webkit-scrollbar:vertical': {
            width: '8px',
          },
          '&::-webkit-scrollbar:horizontal': {
            height: '8px',
          },
          '@media (hover: hover)': {
            '&:hover': {
              // the rest
              '&::-webkit-scrollbar': {
                visibility: 'visible',
              },

              '&::-webkit-scrollbar-thumb': {
                backgroundColor: scrollbarColor,
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:vertical': {
                borderRight: `2px solid ${transparentAreaColor}`,
                minHeight: '32px',
              },
              '&::-webkit-scrollbar-thumb:horizontal': {
                borderBottom: `2px solid ${transparentAreaColor}`,
                minWidth: '32px',
              },
            },
          },
        },
      }}
    >
      {/* selected rows options */}

      {selectedRowIndexes.length > 0 && (
        <Row style={{ marginBottom: 12 }}>
          <Row style={{ gap: 12, padding: '0px 12px' }}>
            <Text weight="strong" color="brand">
              {selectedRowIndexes.length} selected
            </Text>
            <Button
              size="small"
              color="system"
              light
              onClick={() => setSelectedRowIndexes([])}
            >
              Clear selection
            </Button>
            <Button
              size="small"
              color="neutral"
              light
              onClick={() => {
                selectedRowIndexes.map(async (idx) => {
                  console.log(parsedData[idx])

                  await client.call('db:set', {
                    // TODO check this language
                    $language: 'en',
                    type: parsedData[idx].type,
                    ...parsedData[idx],
                  })
                })

                setSelectedRowIndexes([])
              }}
              icon={<IconCopy />}
            >
              Duplicate
            </Button>
            <Button
              size="small"
              light
              color="alert"
              icon={<IconDelete />}
              onClick={async () => {
                await selectedRowIndexes.map(async (idx) => {
                  await client.call('db:delete', {
                    $id: parsedData[idx].id,
                  })
                })

                setSelectedRowIndexes([])
              }}
            >
              Delete
            </Button>
          </Row>
        </Row>
      )}
      {/* filter and show button */}
      <Row style={{ marginBottom: 12 }}>
        <styled.div
          style={{
            height: '32px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 4,
            border: `1px solid ${borderColor}`,
            marginRight: 8,
          }}
        >
          <Text light size={14}>
            {filter?.$field} {filter?.$operator} {filter?.$value}
          </Text>
        </styled.div>
        {addedFilters.map((item, idx) => {
          let itemKey = Object.keys(item[0])[0]

          console.log(itemKey)

          return (
            <React.Fragment key={idx}>
              <Text color="brand" weight="strong" style={{ marginRight: 8 }}>
                {itemKey}
              </Text>
              <styled.div
                style={{
                  height: '32px',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 4,
                  border: `1px solid ${borderColor}`,
                  marginRight: 8,
                }}
              >
                <Text light size={14}>
                  {item[0][itemKey].$field} {item[0][itemKey].$operator}{' '}
                  {item[0][itemKey].$value}
                </Text>
              </styled.div>
            </React.Fragment>
          )
        })}
        <Modal.Root>
          <Modal.Trigger>
            <Button color="primary" size="xsmall" icon={<IconFilter />}>
              Add Filter
            </Button>
          </Modal.Trigger>
          <Modal.Content>
            {({ close }) => {
              return (
                <>
                  <Modal.Title>Define your filter.</Modal.Title>
                  <Modal.Body>
                    <Input
                      label={'$and or $or?'}
                      value={andOr}
                      type="select"
                      options={[
                        { value: '$and', label: 'AND' },
                        { value: '$or', label: 'OR' },
                      ]}
                      onChange={(v) => setAndOr(v)}
                    />
                    <Input
                      label="$field"
                      value={fieldValue}
                      type="select"
                      options={columnNames?.map((item) => ({
                        value: item,
                      }))}
                      onChange={(v) => setFieldValue(v)}
                    />
                    <Input
                      label="$operator"
                      value={operator}
                      type="select"
                      options={[
                        { value: '=' },
                        { value: '!=' },
                        { value: '<' },
                        { value: '>' },
                      ]}
                      onChange={(v) => setOperator(v)}
                    />
                    <Input
                      label="$value"
                      value={filterValue}
                      type="text"
                      onChange={(v) => setFilterValue(v)}
                    />
                  </Modal.Body>
                  <Modal.Actions>
                    <Button
                      keyboardShortcut="Esc"
                      displayShortcut
                      onClick={() => {
                        setAndOr('$and')
                        setOperator('=')
                        setFieldValue('')
                        setFilterValue('')
                        close()
                      }}
                      color="system"
                    >
                      Cancel
                    </Button>
                    <Button
                      keyboardShortcut="Enter"
                      displayShortcut
                      onClick={() => {
                        let newFilter = {
                          [andOr]: {
                            $field: fieldValue,
                            $operator: operator,
                            $value: filterValue,
                          },
                        }

                        close()
                        setAddedFilters([...addedFilters, [newFilter]])

                        setAndOr('$and')
                        setOperator('=')
                        setFieldValue('')
                        setFilterValue('')
                      }}
                      color="primary"
                    >
                      Add
                    </Button>
                  </Modal.Actions>
                </>
              )
            }}
          </Modal.Content>
        </Modal.Root>

        {addedFilters.length > 0 && (
          <Button
            size="xsmall"
            style={{ marginLeft: 8 }}
            onClick={() => {
              setCustomFilter('')
              setAddedFilters([])
            }}
          >
            Clear Filter{addedFilters.length < 2 ? '' : 's'}
          </Button>
        )}

        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button
              color="system"
              icon={<IconEye />}
              size="xsmall"
              style={{ marginLeft: 'auto' }}
            />
          </Dropdown.Trigger>

          <Dropdown.Items>
            {columnNames?.map((item, idx) => (
              <Input
                key={idx}
                title={item}
                type="checkbox"
                value={!hiddenColumns?.includes(item?.toLowerCase())}
                onChange={(v) => {
                  if (v) {
                    setFilteredColumns([
                      ...hiddenColumns?.filter(
                        (x) => x !== item?.toLowerCase()
                      ),
                    ])
                  } else {
                    setFilteredColumns([...hiddenColumns, item?.toLowerCase()])
                  }
                }}
              />
            ))}
          </Dropdown.Items>
        </Dropdown.Root>
      </Row>
      <AutoSizer>
        {({ height, width }) => (
          <>
            {/* Table header */}
            <styled.div
              ref={tableHeaderRef}
              style={{
                borderTop: `1px solid ${borderColor}`,
                borderBottom: `1px solid ${borderColor}`,
                display: 'flex',
                width: width,
                overflowX: 'hidden',
                scrollBehavior: 'auto',
                // right scrollbar offset here
                paddingRight: 8,
              }}
            >
              {hiddenColumnNames?.map((item, idx) => (
                <styled.div
                  key={idx}
                  style={{
                    minWidth: idx === 0 ? COLUMN_WIDTH + 32 : COLUMN_WIDTH,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {idx === 0 && (
                    <styled.div
                      style={{
                        marginRight: '8px',
                        marginLeft: '3px',
                        '& div': { width: '24px' },
                      }}
                    >
                      <Input
                        type="checkbox"
                        style={{ maxWidth: 24 }}
                        value={selectedRowIndexes.length === parsedData.length}
                        onChange={() => {
                          if (selectedRowIndexes.length !== parsedData.length) {
                            let arr = Array.from(
                              Array(parsedData.length).keys()
                            )
                            setSelectedRowIndexes([...arr])
                          } else {
                            setSelectedRowIndexes([])
                          }
                        }}
                      />
                    </styled.div>
                  )}
                  {sortOptions.$field === item &&
                    sortOptions.$order === 'desc' && (
                      <IconSortDesc color="brand" style={{ marginRight: 6 }} />
                    )}
                  {sortOptions.$field === item &&
                    sortOptions.$order === 'asc' && (
                      <IconSortAsc color="brand" style={{ marginRight: 6 }} />
                    )}
                  <Text
                    weight="strong"
                    transform="capitalize"
                    truncate
                    color={sortOptions.$field === item ? 'brand' : 'default'}
                    onClick={() => {
                      if (sortOptions.$order === 'desc') {
                        setSortOptions({ $field: item, $order: 'asc' })
                      } else {
                        setSortOptions({ $field: item, $order: 'desc' })
                      }
                      setSelectedRowIndexes([])
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {item}
                  </Text>
                </styled.div>
              ))}
            </styled.div>
            <Grid
              className="grid-class"
              height={height}
              rowCount={parsedData?.length}
              columnCount={hiddenColumnNames?.length}
              width={w}
              rowHeight={(index) => ROW_HEIGHT}
              columnWidth={(index) =>
                index === 0 ? COLUMN_WIDTH + 32 : COLUMN_WIDTH
              }
              onScroll={(e) => {
                if (tableHeaderRef?.current) {
                  tableHeaderRef.current.scrollLeft = e.scrollLeft
                }
                result.onScrollY(e.scrollTop)
              }}
              style={{ ...style }}
            >
              {Cell}
            </Grid>
          </>
        )}
      </AutoSizer>
    </styled.div>
  )
}
