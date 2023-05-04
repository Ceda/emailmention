<template>
  <div>
    <component
      :is="tag"
      ref="element"
      :contenteditable="contenteditable"
      @input="onInput"
      @mouseup="capturePosition"
      @keyup="capturePosition"
      @blur.passive="onBlur"
      @focus.passive="onFocus"
      @click="onClick"
      @contextmenu.prevent
      @copy.prevent
      @cut.prevent
      @paste.prevent
       class="el-textarea__inner el-textarea__inner--wrapped"
    />
    <TagCloud
      v-show="isFocused"
      :tags="valueOptions"
      @tag-selected="onTagSelected"
      class="tag-cloud"
    />
  </div>
</template>

<script>
import TagCloud from './TagCloud.vue';

export default {
  name: "ContentEditableEditor",
  components: {
    TagCloud
  },
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
  data() {
    return {
      isFocused: false,
      blurTimeout: null
    }
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
    onTagSelected(tag) {
      this.insertTag(tag.key);
    },
    currentContent(){
      return this.noHTML ? this.$refs.element.innerText : this.$refs.element.innerHTML;
    },
    replacePlaceholders(content) {
      return this.valueOptions.reduce((replacedContent, option) => {
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light" contenteditable="false">${option.value}<i class="el-icon-close el-tag__close el-icon-close--small"></i></span>`;
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
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light" contenteditable="false">${option.value}<i class="el-icon-close el-tag__close el-icon-close--small"></i></span>`;
        const placeholder = `%{${option.key}}`;
        return restoredContent.split(tagHtml).join(placeholder);
      }, this.currentContent());
    },
    getContentWithPreview() {
      return this.valueOptions.reduce((restoredContent, option) => {
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light" contenteditable="false">${option.value}<i class="el-icon-close el-tag__close el-icon-close--small"></i></span>`;
        const placeholder = option.preview;
        return restoredContent.split(tagHtml).join(placeholder);
      }, this.currentContent());
    },
    onBlur() {
      this.blurTimeoutId = setTimeout(() => {
        this.isFocused = false
      }, 1)
    },
    onFocus() {
      clearTimeout(this.blurTimeoutId)
      this.isFocused = true

      if (this.savedSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.savedSelection);
      }
    },
    insertTag(tag) {
      setTimeout(() => {
        this.$refs.element.focus();

        const tagHtml = this.replacePlaceholders(`%{${tag}}`);
        const sel = window.getSelection();

        if (sel.rangeCount) {
          const range = sel.getRangeAt(0);
          range.deleteContents();

          const el = document.createElement("div");
          el.innerHTML = ` ${tagHtml} `;
          const frag = document.createDocumentFragment();
          let node;
          let lastNode;

          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }

          range.insertNode(frag);

          // Preserve the selection
          if (lastNode) {
            range.setStartAfter(lastNode);
            range.setEndAfter(lastNode);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }, 0);
    },
    capturePosition() {
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        this.savedSelection = sel.getRangeAt(0);
      }
    },
    onInput() {
      let newVal = this.$refs.element.innerHTML;
      this.capturePosition();
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

<style lang="scss">
  .tag-cloud {
    position: absolute;
  }
</style>
