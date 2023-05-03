<template>
  <component
    :is="tag"
    ref="element"
    :contenteditable="contenteditable"
    @input="update"
    @blur="update"
    @paste="onPaste"
    @keypress="onKeypress"
    v-on="eventHandlers"
    @click="onClick"
  />
</template>

<script>
export default {
  name: "ContentWithTags",
  props : {
    tag: {
      type: String,
      default: 'div'
    },
    contenteditable: {
      type : Boolean,
      default : true,
    },
    value: {
      type: String,
      default: ''
    },
    noHTML: {
      type : Boolean,
      default : false,
    },
    noNL: {
      type : Boolean,
      default : false,
    },
    valueOptions: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    eventHandlers() {
      const eventNames = [
        'keydown',
        'keyup',
        'mouseenter',
        'mouseover',
        'mousemove',
        'mousedown',
        'mouseup',
        'auxclick',
        'dblclick',
        'contextmenu',
        'wheel',
        'mouseleave',
        'mouseout',
        'select',
        'pointerlockchange',
        'pointerlockerror',
        'dragstart',
        'drag',
        'dragend',
        'dragenter',
        'dragover',
        'dragleave',
        'drop',
        'transitionstart',
        'transitioncancel',
        'transitionend',
        'transitionrun',
        'compositionstart',
        'compositionupdate',
        'compositionend',
        'cut',
        'copy',
      ];
      return Object.fromEntries(
        eventNames.map((eventName) => [eventName, this.fwdEv])
      );
    },
  },
  mounted() {
    this.updateContent(this.value);
  },
  methods: {
    currentContent(){
      return this.noHTML ? this.$refs.element.innerText : this.$refs.element.innerHTML;
    },
    updateContent(newcontent){
      this.$refs.element[this.noHTML ? 'innerText' : 'innerHTML'] = this.replacePlaceholders(newcontent);
    },
    update() {
      this.$emit('input', this.currentContent());
    },
    onPaste(event) {
      event.preventDefault();
      const clipboardData = (event.originalEvent || event).clipboardData;
      let text = clipboardData.getData('text/plain');

      if (this.noNL) {
        text = text.replace(/\r\n|\n|\r/g, ' ');
      }

      window.document.execCommand('insertText', false, text);
      this.fwdEv(event);
    },
    onKeypress(event) {
      if (event.key === 'Enter' && this.noNL) {
        event.preventDefault();
        this.$emit('returned', this.currentContent);
      }
      this.fwdEv(event);
    },
    fwdEv(event){
      this.$emit(event.type, event);
    },
    onInput() {
    },
    onClick(event) {
      if (event.target.classList.contains("el-icon-close--small")) {
        const tagElement = event.target.parentElement;
        tagElement.outerHTML = '';
      }
    },
    replacePlaceholders(content) {
      return this.valueOptions.reduce((replacedContent, option) => {
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light">${option.value}<i class="el-icon-close el-tag__close el-icon-close--small" data-key="${option.key}"></i></span>`;
        const placeholder = `%{${option.key}}`;
        const placeholderIndex = replacedContent.indexOf(placeholder);

        if (placeholderIndex === -1) {
          return replacedContent;
        }

        return replacedContent.slice(0, placeholderIndex) + tagHtml + replacedContent.slice(placeholderIndex + placeholder.length);
      }, content);
    },
    restorePlaceholders() {
      return this.valueOptions.reduce((restoredContent, option) => {
        const tagHtml = `<span class="el-tag el-tag--small el-tag--light">${option.value}<i class="el-icon-close el-tag__close el-icon-close--small" data-key="${option.key}"></i></span>`;
        const placeholder = `%{${option.key}}`;
        return restoredContent.split(tagHtml).join(placeholder);
      }, this.currentContent());
    },
  },
};
</script>
