<template>
  <component
    :is="tag"
    ref="element"
    :contenteditable="contenteditable"
    @input="onInput"
    @blur="saveSelection"
    @focus="restoreSelection"
    @click="onClick"
    @contextmenu.prevent
    @copy.prevent
    @cut.prevent
    @paste.prevent
  />
</template>

<script>
export default {
  name: "ContentEditableEditor",
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    contenteditable: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      default: '',
    },
    noHTML: {
      type: Boolean,
      default: false,
    },
    noNL: {
      type: Boolean,
      default: false,
    },
    valueOptions: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  mounted() {
    this.$refs.element.innerHTML = this.replacePlaceholders(this.value);
  },
  watch: {
    value(newValue) {
      if (newValue !== this.$refs.element.innerHTML) {
        this.$refs.element.innerHTML = newValue;
      }
    },
  },
  methods: {
    currentContent(){
      return this.noHTML ? this.$refs.element.innerText : this.$refs.element.innerHTML;
    },
    replacePlaceholders(content) {
      return this.valueOptions.reduce((replacedContent, option) => {
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light" contenteditable="false">${option.value}<i class="el-icon-close el-tag__close el-icon-close--small" data-key="${option.key}"></i></span>`;
        const placeholder = `%{${option.key}}`;
        const placeholderIndex = replacedContent.indexOf(placeholder);

        if (placeholderIndex === -1) {
          return replacedContent;
        }

        return replacedContent.slice(0, placeholderIndex) + tagHtml + replacedContent.slice(placeholderIndex + placeholder.length);
      }, content);
    },
    getContentWithPlaceholders() {
      return this.valueOptions.reduce((restoredContent, option) => {
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light" contenteditable="false">${option.value}<i class="el-icon-close el-tag__close el-icon-close--small" data-key="${option.key}"></i></span>`;
        const placeholder = `%{${option.key}}`;
        return restoredContent.split(tagHtml).join(placeholder);
      }, this.currentContent());
    },
    getContentWithPreview() {
      return this.valueOptions.reduce((restoredContent, option) => {
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light" contenteditable="false">${option.value}<i class="el-icon-close el-tag__close el-icon-close--small" data-key="${option.key}"></i></span>`;
        const placeholder = option.preview;
        return restoredContent.split(tagHtml).join(placeholder);
      }, this.currentContent());
    },
    saveSelection() {
      console.log('blured');
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        this.savedSelection = sel.getRangeAt(0);
      }
    },
    restoreSelection() {
      if (this.savedSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.savedSelection);
      }
    },
    insertTag(tag) {
      setTimeout(() => {
        this.$refs.element.focus();
        document.execCommand('insertHTML', false, `${this.replacePlaceholders(`%{${tag}}`)} `);
        document.execCommand("delete", false, null);
      }, 0);
    },

    onInput() {
      let newVal = this.$refs.element.innerHTML;
      this.$emit('input', newVal);
    },
    onClick(event) {
      if (event.target.classList.contains("el-icon-close--small")) {
        const tagElement = event.target.parentElement;
        tagElement.remove();
      }
    },
  },
};
</script>
