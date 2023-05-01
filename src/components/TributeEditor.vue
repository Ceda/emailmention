<script>
import Tribute from 'tributejs/dist/tribute.js';
const tagAttributes = 'contenteditable="false" class="el-tag el-tag--small el-tag--light"';
const deleteIcon = '<i class="el-icon-close el-tag__close el-icon-close--small"></i>';

export default {
  name: 'TributeEditor',
  props: {
    valueOptions: {
      type: Array,
      required: true,
    },
  },
  computed: {
    options() {
      return {
        // trigger: '{{',
        // replaceTextSuffix: '\n',
        // autocompleteMode: true,
        // requireLeadingSpace: true,
        lookup: 'value',
        fillAttr: 'value',
        noMatchTemplate() {
          return '<span style:"visibility: hidden;"></span>';
        },
        values: this.valueOptions,
        positionMenu: true,
        selectTemplate(item) {
          if (typeof item === 'undefined') return null;
          return `<span ${tagAttributes}>${item.original.value}${deleteIcon}</span>`;
        },
      }
    },
  },
  mounted() {
    const element = this.$slots.default[0].elm;
    element.innerHTML = this.dataForEditor(element.innerHTML);
    this.tribute = new Tribute(this.options);
    this.tribute.attach(element);
    element.tributeInstance = this.tribute;
    element.addEventListener('tribute-replaced', event => {
      event.target.dispatchEvent(new Event('input', { bubbles: true }));
    });
  },
  beforeDestroy() {
    const element = this.$slots.default[0].elm;

    if (this.tribute) {
      this.tribute.detach(element);
    }
  },
  methods: {
    dataFromTribute(options = { previewOutput: false }) {

    const { previewOutput } = options;

      const el = this.$slots.default[0].elm;
      let html =  el.innerHTML;

      console.log(this.options.values);
      this.options.values.forEach((item) => {
        const { value, key, preview } = item;
        html = html.replace(
          new RegExp(`<span ${tagAttributes}>${value}${deleteIcon}</span>`, 'g'), previewOutput ? preview : `%{${key}}`
        );
      });

      return html;
    },
    dataForEditor(content) {
      if (content) {
        this.options.values.forEach((item) => {
          const key = `%{${item.key}}`;
          const { value } = item;
          content = content.replace(key, `<span ${tagAttributes}>${value}${deleteIcon}</span>`);
        });
      }
      return content;
    },
    getTributeInstance() {
      return this.tribute;
    },
  },
  render() {
    return this.$slots.default;
  },
};
</script>

<style lang="scss" >
.tribute-container {
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  max-height: 300px;
  max-width: 500px;
  overflow: auto;
  display: block;
  z-index: 999999;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(#000, 0.13);
}
.tribute-container ul {
  margin: 0;
  margin-top: 2px;
  padding: 0;
  list-style: none;
  background: #fff;
  border-radius: 4px;
  border: 1px solid rgba(#000, 0.13);
  background-clip: padding-box;
  overflow: hidden;
}
.tribute-container li {
  color: #3f5efb;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}
.tribute-container li.highlight,
.tribute-container li:hover {
  background: #3f5efb;
  color: #fff;
}
.tribute-container li span {
  font-weight: bold;
}
.tribute-container li.no-match {
  cursor: default;
}
.tribute-container .menu-highlighted {
  font-weight: bold;
}
.v-tribute {
  position: relative;
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
  font-size: 1rem;
  white-space: pre-wrap;
}
</style>
