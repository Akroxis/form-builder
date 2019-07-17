<template>
  <div class="tree-menu">
    <div>{{ label }}</div>
    <tree-menu v-for="node in nodes" :nodes="node.items" :label="node.title" :key="node.uiid">
    </tree-menu>
  </div>
</template>
<script>
export default {
  props: ["label", "nodes"],
  name: "tree-menu"
};
</script>
