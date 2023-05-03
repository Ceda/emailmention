<template>
  <ul>
    <li
      v-for="tag in tags"
      :key="tag.key"
      @mousedown="onClick(tag, $event)"
    >
      <el-tooltip
        class="item"
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
    margin: 10px 0;
    display: flex;
  }

  li {
    margin-right: 5px;
    cursor: pointer;
  }
</style>
