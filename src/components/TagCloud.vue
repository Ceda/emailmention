<template>
  <ul>
    <li
      v-for="tag in tags"
      :key="tag.key"
      @mousedown="onClick(tag, $event)"
    >
      <el-tooltip
        popper-class="tooltip-multiline"
        placement="right"
        :content="tag.preview"
      >
        <span class="el-tag el-tag--small el-tag--light">{{ tag.value }}</span>
      </el-tooltip>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'TagCloud',
  props: {
    tags: {
      type: Array,
      required: true,
    }
  },
  computed: {
  },
  methods: {
    onClick(tag) {
      this.$emit('tag-selected', tag);
    }
  }
};
</script>

<style lang="scss" scoped>
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0;
    right: 0;
    top: 0;
  }

  li {
    margin: 5px;
    cursor: pointer;
  }
</style>

<style lang="scss">
  .tooltip-multiline {
    white-space: break-spaces;
  }

</style>
