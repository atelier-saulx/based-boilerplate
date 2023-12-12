import React, { CSSProperties, FC, useState, useRef, useEffect } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeGrid as Grid } from 'react-window'
import { Style, styled } from 'inlines'
import { SortOptions, useInfiniteQuery } from './useInfiniteQuery'
import { BasedQuery } from '@based/client'
import { RenderAs } from './RenderAs'
import { useClient, useQuery } from '@based/react'
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
  Toggle,
  IconEdit,
  Tooltip,
  IconAlertFill,
} from '@based/ui'
import deepCopy from '../utils/deepCopy'

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
  columnNamesInRightOrder?: string[]
  style?: CSSProperties | Style
  selectedLang?: string
}

export const changedRows = {}

export const CmsTable: FC<CmsTableProps> = ({
  data,
  width = 300,
  height = 300,
  queryId,
  query,
  getQueryItems,
  onRowClick,
  onCellClick,
  columnNamesInRightOrder,
  style,
  filter,
  selectedLang,
}) => {
  const [hiddenColumns, setFilteredColumns] = useState<string[]>([
    'ancestors',
    'descendants',
    'aliases',
    'parents',
    'children',
  ])
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    $field: 'updatedAt',
    $order: 'desc',
  })
  const [selectedRowIndexes, setSelectedRowIndexes] = useState<number[]>([])

  // filter shizzle
  const [andOr, setAndOr] = useState('$and')
  const [operator, setOperator] = useState('=')
  const [typeOfValue, setTypeOfValue] = useState('string')
  const [fieldValue, setFieldValue] = useState('')
  const [filterValue, setFilterValue] = useState<number | string | boolean>('')
  const [addedFilters, setAddedFilters] = useState<{}[]>([])
  const [customFilter, setCustomFilter] = useState<any>('')
  const [renderCounter, setRenderCounter] = useState(1)
  const [errorMessage, setErrorMessage] = useState('')

  const [enableInlineEditModus, setEnableInlineEditModus] = useState(false)

  // let w = width
  // let h = height

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
      addedFilters.length +
      renderCounter,
    sortOptions: sortOptions,
    itemCount: data?.length,
    height: height,
    filter: customFilter || filter,
  })

  const parsedData = query ? result.items : data
  const shadowData = deepCopy(parsedData)

  // if row id is in changedRows set the shadowDAta rows to that
  shadowData.map((obj, idx) =>
    Object.keys(changedRows).includes(obj.id)
      ? (shadowData[idx] = changedRows[obj.id])
      : null
  )

  /// store the difference ??

  const client = useClient()
  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

  let columnNames: any[] = [...new Set(parsedData?.flatMap(Object.keys))]

  if (columnNamesInRightOrder && columnNamesInRightOrder.length > 0) {
    columnNames = columnNamesInRightOrder
  }

  let hiddenColumnNames = columnNames?.filter(
    (item) => !hiddenColumns?.includes(item?.toLowerCase())
  )

  // queryId is the type in this case
  let schemaFields = schema?.types[queryId as string]?.fields

  useEffect(() => {
    setCustomFilter('')
    setAddedFilters([])
    setSelectedRowIndexes([])
    setEnableInlineEditModus(false)
    setErrorMessage('')
  }, [queryId])
  console.log(result, 'Result>?')
  console.log(parsedData, 'ParsedDAta?')
  // console.log(schemaFields)
  //  console.log(query, 'the query?')
  //   console.log(filter, 'What the filter man')

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }, [errorMessage])

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

      // console.log('🥥', filterCopy)
      // console.log('🐵 added filters', addedFilters)
      setCustomFilter({ ...filterCopy })
    }
  }, [addedFilters.length])

  const tableHeaderRef = useRef<HTMLDivElement>()

  // Cell Component
  const Cell = ({ columnIndex, rowIndex, style }) => {
    let cellFieldTypeOf = schemaFields[hiddenColumnNames[columnIndex]]?.type

    const [inputState, setInputState] = useState(
      Object.keys(changedRows)?.includes(parsedData[rowIndex]?.id)
        ? shadowData[rowIndex][hiddenColumnNames[columnIndex]]
        : parsedData[rowIndex][hiddenColumnNames[columnIndex]]
    )

    useEffect(() => {
      // console.log('this changed -->', inputState)

      if (parsedData[rowIndex][hiddenColumnNames[columnIndex]] !== inputState) {
        // if (cellFieldTypeOf === 'text') {
        //   shadowData[rowIndex][hiddenColumnNames[columnIndex]] = inputState
        //   shadowData[rowIndex][hiddenColumnNames[columnIndex]] = {
        //     language: selectedLang,
        //   }
        // } else {
        shadowData[rowIndex][hiddenColumnNames[columnIndex]] = inputState
        // }

        console.log('this row changed -->', shadowData[rowIndex])
        changedRows[shadowData[rowIndex].id] = shadowData[rowIndex]

        console.log(changedRows, 'changed rows🤌')
      }
    }, [inputState])

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
          cursor: onRowClick && !enableInlineEditModus ? 'pointer' : 'auto',
          ...style,
        }}
        onClick={(e) => {
          // if (onCellClick) {
          //   // e.stopPropagation()
          //   onCellClick(
          //     parsedData[rowIndex][hiddenColumnNames[columnIndex]],
          //     rowIndex,
          //     columnIndex
          //   )
          // }
          if (onRowClick && !enableInlineEditModus) {
            setSelectedRowIndexes([])
            onRowClick(parsedData[rowIndex], rowIndex)
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
                  //  console.log('selected rowindex', rowIndex)
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
        {cellFieldTypeOf === 'boolean' && enableInlineEditModus ? (
          <Toggle
            style={{ marginLeft: 6 }}
            value={inputState}
            onChange={(v) => setInputState(v)}
          />
        ) : cellFieldTypeOf === 'string' && enableInlineEditModus ? (
          <Input
            type="text"
            value={inputState}
            onChange={(v) => setInputState(v)}
          />
        ) : cellFieldTypeOf === 'text' && enableInlineEditModus ? (
          <Input
            type="text"
            value={inputState && inputState[selectedLang as string]}
            onChange={(v) => setInputState(v)}
          />
        ) : cellFieldTypeOf === 'number' && enableInlineEditModus ? (
          <Input
            type="number"
            value={inputState}
            onChange={(v) => setInputState(v)}
          />
        ) : (
          <RenderAs
            input={parsedData[rowIndex][hiddenColumnNames[columnIndex]]}
            colName={hiddenColumnNames[columnIndex]}
            cellFieldTypeOf={cellFieldTypeOf}
            selectedLang={selectedLang}
          />
        )}
      </styled.div>
    )
  }

  const scrollbarColor = color('border', 'default', 'strong')
  const transparentAreaColor = color('background', 'default', 'surface')
  const borderColor = color('inputBorder', 'neutralNormal', 'default')

  return (
    <styled.div
      style={{
        width: width,
        height: height,
        '& .grid-class': {
          scrollbarGutter: 'stable',
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
                  //  console.log(parsedData[idx])

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
            <Modal.Root>
              <Modal.Trigger>
                <Button
                  size="small"
                  light
                  color="alert"
                  icon={<IconDelete />}
                  // onClick={async () => {
                  //   await selectedRowIndexes.map(async (idx) => {
                  //     await client.call('db:delete', {
                  //       $id: parsedData[idx].id,
                  //     })
                  //   })
                  //   setSelectedRowIndexes([])
                  //   setRenderCounter(renderCounter + 1)
                  // }}
                >
                  Delete
                </Button>
              </Modal.Trigger>
              <Modal.Confirmation
                title="Delete selection"
                label="Are you sure?"
                type="alert"
                action={{
                  action: async () => {
                    await selectedRowIndexes.map(async (idx) => {
                      await client.call('db:delete', {
                        $id: parsedData[idx].id,
                      })
                    })
                    setSelectedRowIndexes([])
                    setRenderCounter(renderCounter + 1)
                  },
                  label: 'Confirm',
                }}
              />
            </Modal.Root>
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
                  {item[0][itemKey].$value.toString()}
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
                        { value: 'includes' },
                      ]}
                      onChange={(v) => setOperator(v)}
                    />
                    <Row style={{ gap: 12 }}>
                      <div style={{ flex: '1  auto', alignItems: 'center' }}>
                        {typeOfValue === 'boolean' ? (
                          <>
                            <Text weight="medium">$value</Text>
                            <Toggle
                              value={filterValue as boolean}
                              onChange={(v) => setFilterValue(v)}
                            />
                          </>
                        ) : (
                          <Input
                            label="$value"
                            value={filterValue as any}
                            type={typeOfValue === 'number' ? 'number' : 'text'}
                            onChange={(v) =>
                              v ? setFilterValue(v) : setFilterValue(false)
                            }
                          />
                        )}
                      </div>
                      <div style={{ minWidth: 164 }}>
                        <Input
                          type="select"
                          label="Typeof $value"
                          value={typeOfValue}
                          options={[
                            { value: 'string' },
                            { value: 'number' },
                            { value: 'boolean' },
                          ]}
                          onChange={(v) => {
                            setTypeOfValue(v)
                            if (v === 'string') {
                              setFilterValue((filterValue) =>
                                filterValue.toString()
                              )
                            } else if (v === 'number') {
                              setFilterValue((filterValue) => +filterValue)
                            }
                          }}
                        />
                      </div>
                    </Row>
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
                        setTypeOfValue('string')
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
                            $value:
                              typeOfValue === 'boolean'
                                ? !!filterValue
                                : filterValue,
                          },
                        }

                        close()
                        setAddedFilters([...addedFilters, [newFilter]])

                        setAndOr('$and')
                        setOperator('=')
                        setFieldValue('')
                        setFilterValue('')
                        setTypeOfValue('string')
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

        <div
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}
        >
          {enableInlineEditModus && (
            <Button
              size="small"
              style={{ marginRight: 8 }}
              onClick={async () => {
                // console.log(parsedData, 'PARSED ')
                // console.log(shadowData, 'shadow data')

                // save the rows that are changed,
                Object.keys(changedRows).forEach(
                  async (key) =>
                    await client
                      .call('db:set', {
                        $id: key,
                        $language: selectedLang,
                        ...changedRows[key],
                      })
                      .catch((err) => {
                        console.error(err)
                        setErrorMessage(err.message)
                      })
                )

                // clear the rowChanges
                setEnableInlineEditModus(!enableInlineEditModus)
                Object.keys(changedRows).forEach(
                  (key) => delete changedRows[key]
                )
              }}
            >
              Save changes
            </Button>
          )}
          <Tooltip
            text={
              enableInlineEditModus
                ? 'disable inline-edit'
                : 'enable inline-edit'
            }
            position="top"
          >
            <Button
              color="system"
              icon={!enableInlineEditModus && <IconEdit />}
              size={!enableInlineEditModus ? 'xsmall' : 'small'}
              style={{
                marginRight: 8,
                border: enableInlineEditModus
                  ? `1px solid ${color('background', 'brand', 'muted')}`
                  : `1px solid ${borderColor}`,
              }}
              onClick={() => {
                setEnableInlineEditModus(!enableInlineEditModus)
                Object.keys(changedRows).forEach(
                  (key) => delete changedRows[key]
                )
              }}
            >
              {enableInlineEditModus && 'Cancel'}
            </Button>
          </Tooltip>

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
                      setFilteredColumns([
                        ...hiddenColumns,
                        item?.toLowerCase(),
                      ])
                    }
                  }}
                />
              ))}
            </Dropdown.Items>
          </Dropdown.Root>
        </div>
      </Row>

      {errorMessage && (
        <Row
          style={{
            justifyContent: 'end',
            alignItems: 'center',
            marginBottom: 6,
            marginTop: '-6px',
            marginRight: 6,
          }}
        >
          <IconAlertFill color="negative" style={{ marginRight: 6 }} />
          <Text color="negative" weight="strong">
            {errorMessage}
          </Text>
        </Row>
      )}
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
                backgroundColor: color('background', 'neutral', 'surface'),
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
              width={width}
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
