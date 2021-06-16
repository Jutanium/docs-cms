
export type ContentData = ElementData | ComponentData | DevSlotData;
export type ProcessedContent = Array<ContentData>;

export type ElementData = string | {
  element: string,
  children: ProcessedContent,
  style?: {
    [propertyName: string]: string | number,
  }
}

export type DevSlotData = {
  slot: string,
}
// type ValidatorFunction = (value: string) => boolean;

//TODO: validator and convertor functions?

export type PropsDef = {
  [propName: string]: {
    type: 'string' | 'number',
    required?: boolean
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
  default?: ProcessedContent,
  [propName: string]: ProcessedContent
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