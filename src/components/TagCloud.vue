<template>
  <ul>
    <li
      v-for="tag in tags"
      :key="tag.key"
      @mousedown="onClick"
    >
      <el-tooltip
        class="item"
        :content="tag.preview"
      >
        <span>{{ tag.value }}</span>
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
    onClick() {
      // const tag = e.target.innerText;
      // this.$emit('click', e);
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
    margin: 5px;
    padding: 5px;
    background-color: #eee;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
