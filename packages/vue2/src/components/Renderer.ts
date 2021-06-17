
import Vue, {PropType, VNode, VNodeData} from "vue";
import { ProcessedContent, ContentData } from "google-docs-components"


export default Vue.extend({
  functional: true,
  props: {
    content: {
      type: Array as PropType<ProcessedContent>,
      required: false,
    },
    components: {
      type: Object,
      default: () => ({})
    }
  },
  render (h, context) {
    function fromContent (data: ContentData): VNode | VNode[] | string | false {
      if (typeof data == "string") {
        return data;
      }
      if ("element" in data) {
        const nodeData: VNodeData = {
          ...(data.style && {style: data.style})
        }
        return h(data.element, nodeData, fromContentArray(data.children));
      }
      if ("component" in data) {
        const nodeData: VNodeData = {}
        if (!(data.component in context.props.components))
          return false;
        if (data.props) {
          nodeData.props = data.props;
        }
        if (data.slots) {
          const slotsEntries = Object.entries(data.slots).map( ([slotName, contentData]) => [slotName, () => fromContentArray(contentData)]);
          nodeData.scopedSlots = Object.fromEntries(slotsEntries);
        }
        return h(context.props.components[data.component], nodeData);
      }
      if ("slot" in data) {
        if (data.slot in context.scopedSlots) {
          const resolvedSlot = context.scopedSlots[data.slot]({});
          if (resolvedSlot)
            return resolvedSlot;
        }
      }
      return false;
    }
    function fromContentArray (contentArray: ProcessedContent) {
      return contentArray.map(fromContent).filter(Boolean);
    }

    return h("div", fromContentArray(context.props.content));
  }
})

