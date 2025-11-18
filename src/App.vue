<script setup lang="ts">
import { useRoute } from "vue-router";
import { routes } from "./router/routes.ts";

  const route = useRoute();

  const filteredRoutes = routes.filter(({ path }: { path: string }) => path !== '/');
</script>

<template>
  <nav>
    <RouterLink
      v-for="routerLink in filteredRoutes"
      :disabled="route.name === routerLink.name"
      :class="{ 'router-link': true, 'active': route.name === routerLink.name }"
      :to="routerLink.path"
    >
      {{ routerLink.meta?.title }}
    </RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
nav {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;

  .router-link {
    padding: 8px;
    color: #2196f3;

    &:hover {
      color: #0b7dda;
    }

    &.active {
      color: #4caf50;
      cursor: default;
    }
  }
}

main {
  flex: 1 1 0;
  overflow: auto;
}
</style>
