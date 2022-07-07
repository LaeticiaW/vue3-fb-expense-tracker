export type QueryResponse<Data> = {
  data: Data
  isLoading: boolean
  error: unknown
  internalError?: unknown
  fetch: () => Promise<Data>
}

export type QueryOptions<Data, Filter = any> = {
  promise: ((filter: Filter) => Promise<Data>) | (() => Promise<Data>)
  filter?: Filter
  initialState: Data
  runQuery?: boolean
  watchFilter?: boolean
}
