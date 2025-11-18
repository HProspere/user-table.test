import { defineComponent } from "vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
// @ts-ignore
import UserTable from "../components/UserTable.vue";
import UserTableComp from "../components/UserTableComp/UserTableComp.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'default',
    redirect: '/options',
  },
  {
    path: '/options',
    name: 'options',
    meta: {
      title: 'Options API table',
    },
    component: defineComponent(UserTable),
  },
  {
    path: '/composition',
    name: 'composition',
    meta: {
      title: 'Composition API table',
    },
    component: UserTableComp,
  },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
  },
);
