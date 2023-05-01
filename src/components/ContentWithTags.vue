<template>
  <div
    ref="contentEditable"
    :contenteditable="true"
    @click="onClick"
  />
</template>

<script>
export default {
  name: "ContentWithTags",
  props: ["content", "valueOptions"],
  mounted() {
    this.updateInnerContent();

    this.mutationObserver = new MutationObserver(() => {
      this.$emit("update-content", this.replacePlaceholders(this.$refs.contentEditable.innerHTML));
    });

    this.mutationObserver.observe(this.$refs.contentEditable, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  },
  beforeDestroy() {
    this.mutationObserver.disconnect();
  },
  methods: {
    onClick(event) {
      if (event.target.classList.contains("el-icon-close--small")) {
        const tagElement = event.target.parentElement;
        tagElement.outerHTML = '';
        this.$emit("update-content", this.$refs.contentEditable.innerHTML);
      }
    },
    updateInnerContent() {
      this.$refs.contentEditable.innerHTML = this.replacePlaceholders(this.content);
    },
    replacePlaceholders(content) {
      let replacedContent = content;

      this.valueOptions.forEach((option) => {
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light">${option.preview}<i class="el-icon-close el-tag__close el-icon-close--small" data-key="${option.key}"></i></span>`;
        const placeholder = `%{${option.key}}`;

        replacedContent = replacedContent.split(placeholder).join(tagHtml);
      });

      return replacedContent;
    },
  },
};
</script>
