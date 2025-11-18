<script setup lang="ts">
  import type { BadgeProps } from './Badge.interface.ts';

  const {
    colorStyle = 'neutral',
    clickable = false,
    title,
    fullWidth = false,
  } = defineProps<BadgeProps>();
</script>

<template>
  <div :class="[ 'badge', fullWidth && 'full-width', colorStyle, clickable && 'clickable' ]">
    {{ title }}
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/vars.scss";

.badge {
  position: relative;
  display: inline-flex;
  justify-content: center;
  font-size: $font-size-s;
  font-weight: 500;
  padding: $spacing-xs $spacing-base;
  border-radius: $spacing-xl;
  user-select: none;
  cursor: default;

  &.full-width {
    width: 100%;
  }

  &.neutral {
    color: $color-neutral-text;
    background-color: $color-neutral-background;
  }

  &.positive {
    color: $color-positive-text;
    background-color: $color-positive-background;
  }

  &.warning {
    color: $color-warning-text;
    background-color: $color-warning-background;
  }

  &.negative {
    color: $color-negative-text;
    background-color: $color-negative-background;
  }

  &.clickable {
    cursor: pointer;

    &:hover::after {
      display: block;
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: $spacing-xl;
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>