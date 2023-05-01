<template>
  <span
    class="el-tag el-tag--small el-tag--light"
    @click="deleteTag"
  >
    <slot />
    <i class="el-icon-close el-tag__close el-icon-close--small" />
  </span>
</template>

<script>
export default {
  name: 'TagItem',
  methods: {
    deleteTag() {
      this.$emit('delete');
    },
  },
};
</script>
