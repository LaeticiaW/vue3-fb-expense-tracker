export type QueryResponse<Data> = {
  data: Data
  isLoading: boolean
  error?: string
  internalError?: unknown
  fetch: () => Promise<void>
}

export type QueryOptions<Data, Filter = void> = {
  promise: ((filter: Filter) => Promise<Data>) | (() => Promise<Data>)
  filter?: Filter
  initialState: Data
  runQuery?: boolean
  watchFilter?: boolean
}
