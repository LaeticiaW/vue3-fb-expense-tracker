export type DashletOptions = {
  id: string
  component: string
  dashletTitle: string
}

export type DashboardContext = {
  maximizeDashlet: (options: DashletOptions) => void
  minimizeDashlet: () => void
}
