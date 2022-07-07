import Vue from 'vue'

export class GridLayout extends Vue {}

export class GridItem extends Vue {}

export interface GridItemData {
  x: number
  y: number
  w: number
  h: number
  i: string
  dashletTitle: string
  component: any
}
