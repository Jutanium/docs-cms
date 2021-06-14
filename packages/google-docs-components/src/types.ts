
type ValidatorFunction = (value: string) => boolean;

//TODO: convertor functions?

export type Props = {
  [propName: string]: {
    type: 'string' | 'number',
    validator?: ValidatorFunction
  }
}

export type Slots = {
  [slotName: string]: {
    validator?: ValidatorFunction
  }
}

export type ComponentDef = {
  matchName: string | Array<string>,
  componentName: string,
  props?: Props,
  slots?: Slots
}

export type Config = {
  components: Array<ComponentDef>
}