export type SearchFilterColumnsType = {
  index: number
  displayName: string
  columnName: string
  search: {
    value: string
    operator: string
  }
}

export type SearchFilterOrderType = {
  columnName: string
  direction: string
}

export type SearchFilterType = {
  start?: number
  length?: number
  columns?: SearchFilterColumnsType[]
  order?: SearchFilterOrderType[]
  columnsExport: string
}

export type LunaResponseType = {
  success: boolean
  message: string
  data: any
}
