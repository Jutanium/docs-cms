<template>
  <div class="doc-table-root" :style="rootStyles">

  </div>
</template>

<script lang="ts">
import Vue, {ComponentOptions, PropType} from "vue"
import {TableData} from "google-docs-components";

const defaultTable: ComponentOptions<Vue>= {
  name: "defaultTable",
  props: {
    tableData: {
      type: Object as PropType<TableData>,
      required: true,
    }
  },
  computed: {
    numRows () {
      return (this.tableData as TableData).rows.length;
    },
    numColumns () {
      return (this.tableData as TableData).rows[0].length;
    },
    rootStyles () {
      return {

      }
    }
  },
  mounted () {
    console.log("table mounted")
  }
}
export default defaultTable;
</script>

