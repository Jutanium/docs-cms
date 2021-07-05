<template>
  <div class="doc-table-root" :style="rootStyles">
    <div class="doc-table-cell" v-for="(_, i) in tableData.cells" :style="cellStyles(i)">
      <slot :name="`cell:${i}`"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "DefaultTable",
  props: {
    tableData: {
      type: Object,
      required: true,
    }
  },
  computed: {
    numRows() {
      return this.tableData.rows.length;
    },
    numColumns() {
      return this.tableData.rows[0].length;
    },
    rootStyles() {
      const gridTemplateAreas = this.tableData.rows.map(row =>
        `"${row
            .map(i => `area${i}`)
            .join(" ")}"`)
        .join(" ");
      return {
        display: "grid",
        gridTemplateAreas
      }
    },
    cellSpans() {
      const spans = {}
      for (let y = 0; y < this.numRows; y++) {
        const row = this.tableData.rows[y];
        for (let x = 0; x < this.numColumns; x++) {
          if (row[x] > -1) {
            if (row[x] in spans) {
              const span = spans[row[x]];
              span.rowEnd = y;
              span.rowStart = y;
            } else {
              spans[row[x]] = {
                rowStart: y,
                colStart: x,
                rowEnd: y,
                colEnd: x
              }
            }
          }
        }
      }
      return spans;
    }
  },
  methods: {
    cellStyles(index) {
      return {
        gridArea: `area${index}`
      }
    }
  },
  mounted() {
    console.log("table mounted")
  }
}
</script>

