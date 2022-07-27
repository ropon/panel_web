<template>
  <div>
    <h2>{{ notFoundMsg }}</h2>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  data () {
    return {
      notFoundMsg: '404 - Not Found'
    }
  }
};
</script>

<style scoped>
</style>
