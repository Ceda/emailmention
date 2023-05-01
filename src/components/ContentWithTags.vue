<template>
  <div
    ref="contentEditable"
    :contenteditable="true"
    class="content-with-tags"
    @input="onInput"
    @click="onClick"
  />
</template>

<script>
export default {
  name: "ContentWithTags",
  props: ["content", "valueOptions"],
  mounted() {
    this.initMutationObserver();
    this.updateInnerContent();
  },
  beforeDestroy() {
    this.mutationObserver.disconnect();
  },
  methods: {
    initMutationObserver() {
      this.mutationObserver = new MutationObserver(() => {
        this.$emit("update-content", this.restorePlaceholders(this.$refs.contentEditable.innerHTML));
      });

      this.mutationObserver.observe(this.$refs.contentEditable, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    },
    onInput(event) {
      if (event.inputType === "insertText" && event.data === "}") {
        this.$nextTick(() => {
          const savedSelection = this.saveSelection();
          this.updateInnerContent();
          this.restoreSelection(savedSelection);
          this.$emit("update-content", this.restorePlaceholders(this.$refs.contentEditable.innerHTML));
        });
      }
    },
    onClick(event) {
      if (event.target.classList.contains("el-icon-close--small")) {
        const tagElement = event.target.parentElement;
        tagElement.outerHTML = '';
        this.$emit("update-content", this.restorePlaceholders(this.$refs.contentEditable.innerHTML));
      }
    },
    updateInnerContent() {
      this.$refs.contentEditable.innerHTML = this.replacePlaceholders(this.content);
    },
    replacePlaceholders(content) {
      return this.valueOptions.reduce((replacedContent, option) => {
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light">${option.preview}<i class="el-icon-close el-tag__close el-icon-close--small" data-key="${option.key}"></i></span>`;
        const placeholder = `%{${option.key}}`;
        return replacedContent.split(placeholder).join(tagHtml);
      }, content);
    },
    restorePlaceholders(content) {
      return this.valueOptions.reduce((restoredContent, option) => {
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light">${option.preview}<i class="el-icon-close el-tag__close el-icon-close--small" data-key="${option.key}"></i></span>`;
        const placeholder = `%{${option.key}}`;
        return restoredContent.split(tagHtml).join(placeholder);
      }, content);
    },
    saveSelection() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        return range.cloneRange();
      }
      return null;
    },
    restoreSelection(savedSelection) {
      if (savedSelection) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedSelection);
      }
    },
  },
};
</script>
