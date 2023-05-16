export type SearchFilterColumnsType = {
  index: number
  displayName: string
  columnName: string
  search: {
    value: string
    operator: SearchOperator
  }
}

export enum SearchOperator {
  equals,
  notequals,
  oneof,
  notoneof,
  inrange,
  notinrange
}

export type SearchFilterOrderType = {
  columnName: string
  direction: Direction
}

export enum Direction {
  asc,
  desc
}

export type SearchFilterType = {
  start?: number
  length?: number
  columns?: SearchFilterColumnsType[]
  order?: SearchFilterOrderType[]
  columnsExport?: string
}

export type LunaResponseType = {
  success: boolean
  message: string
  data: any
}

export type ErrorResponseType = {
  success: boolean
  message: string
  data: any
}
