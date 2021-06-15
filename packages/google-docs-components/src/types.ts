
export type ElementData = string | {
  element: string,
  children: Array<ElementData | ComponentData>,
  style?: {
    [propertyName: string]: string | number,
  }
}

// type ValidatorFunction = (value: string) => boolean;

//TODO: validator and convertor functions?

export type PropsDef = {
  [propName: string]: {
    type: 'string' | 'number',
    // validator?: ValidatorFunction
  }
}

export type PropsData = {
  [propName: string]: string | number
}

export type SlotsDef = {
  default?: {
    // validator?: ValidatorFunction
  },
  [slotName: string]: {
    // validator?: ValidatorFunction
  }
}

export type SlotsData = {
  default?: Array<ComponentData | ElementData>,
  [propName: string]: Array<ComponentData | ElementData>
}

export type ComponentDef = {
  matchName: string | Array<string>,
  componentName: string,
  props?: PropsDef,
  slots?: SlotsDef
}

export type ComponentData = {
  component: string,
  props?: PropsData
  slots?: SlotsData
}

export type Config = {
  components: Array<ComponentDef>
}