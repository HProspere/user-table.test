<script setup lang="ts">
import UserTableCompHeader from '@/components/UserTableComp/UserTableCompHeader/UserTableCompHeader.vue';

</script>

<template>
  <div class="user-table-container">
    <UserTableCompHeader
      :title="'Управление пользователями'"
    />
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/vars.scss";

.user-table-container {
  font-size: $font-size-base;
  height: 100%;
  padding: 20px;
  background: #f5f5f5;
}
</style>