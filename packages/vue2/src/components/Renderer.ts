
import Vue, { PropType } from "vue";
import { ProcessedContent } from "google-docs-components"


export default Vue.extend({
  props: {
    content: {
      type: Array as PropType<ProcessedContent>,
    }
  },

  render (h) {
    return h("p", {style: { color: "blue" }}, "Child text")
  }
})

