<script lang="ts" setup>
import PlaceholderCircle from "@/components/icons/PlaceholderCircle.vue";
import { computed } from "vue";

export type Size = "huge" | "large" | "medium" | "small";
export type Type = "primary" | "secondary" | "subtle" | "ghost";

export interface Props {
  size: Size;
  type: Type;
  darkMode?: boolean;
  showIcon?: boolean;
  iconPosition?: "left" | "right";
  color?: string;
}
const props = withDefaults(defineProps<Props>(), {
  showIcon: false,
  iconPosition: "left",
  darkMode: false,
});

const buttonClassObj = computed(() => {
  return {
    [props.size]: true,
    [props.type]: true,
    "dark-mode": props.darkMode,
    "light-mode": !props.darkMode,
  };
});
</script>

<template>
  <button
    :style="props.color ? `background-color: ${props.color}` : ''"
    class="desktop-link-medium px-8 transition d-flex justify-content-center align-items-center gap-x-4"
    :class="buttonClassObj"
  >
    <PlaceholderCircle
      class="transition"
      v-if="props.showIcon && props.iconPosition === 'left'"
    />
    <slot />
    <PlaceholderCircle
      class="transition"
      v-if="props.showIcon && props.iconPosition === 'right'"
    />
  </button>
</template>

<style lang="scss" scoped>
@use "@/scss/abstracts/functions";
button {
  border: none;
  transition-property: background, border, color;
  outline: 0.8rem solid transparent;

  svg {
    transition-property: all;
    height: 2.4rem;
    width: 2.4rem;
  }

  &.huge {
    height: 7.2rem;
    border-radius: 1.6rem;
  }

  &.large {
    height: 6.4rem;
    border-radius: 1.2rem;
  }
  &.medium {
    height: 5.6rem;
    border-radius: 1.2rem;

    svg {
      height: 2.2rem;
      width: 2.2rem;
    }
  }

  &.small {
    height: 4rem;
    border-radius: 0.8rem;

    svg {
      height: 1.6rem;
      width: 1.6rem;
    }
  }
}

button.primary {
  &.light-mode {
    $active-color: functions.get-color("alias", "grayscale", "header");
    background-color: functions.get-color("alias", "primary", "default");
    color: functions.get-color("alias", "grayscale", "bg");

    svg {
      stroke: functions.get-color("alias", "grayscale", "bg");
    }

    &:hover {
      background-color: functions.get-color("alias", "primary", "strong");
    }

    &:active {
      background-color: $active-color;
    }

    &:focus {
      outline: 0.8rem solid functions.get-color("alias", "primary", "bg-strong");
    }
  }

  &.dark-mode {
    $font-color: functions.get-color("alias", "primary", "strong");
    $active-color: functions.get-color("alias", "grayscale", "header");
    color: $font-color;
    background-color: functions.get-color("alias", "primary", "weak");

    &:hover {
      background-color: functions.get-color("alias", "primary", "bg-strong");
    }

    &:focus {
      background-color: functions.get-color("alias", "primary", "weak");
      outline: 0.8rem solid functions.get-color("alias", "primary", "bg-strong");
    }

    &:active {
      background-color: functions.get-color("alias", "grayscale", "bg");
      color: $active-color;
      svg {
        stroke: $active-color;
      }
    }

    svg {
      stroke: $font-color;
    }
  }
}

button.secondary {
  &.light-mode {
    $default-color: functions.get-color("alias", "primary", "default");
    $hover-color: functions.get-color("alias", "primary", "strong");
    $active-color: functions.get-color("alias", "grayscale", "header");

    background-color: transparent;
    color: $default-color;
    border: 0.2rem solid $default-color;

    svg {
      stroke: $default-color;
    }

    &:hover {
      color: $hover-color;
      border-color: $hover-color;
    }

    &:active {
      color: $active-color;
      border-color: $active-color;

      svg {
        stroke: $active-color;
      }
    }

    &:focus {
      outline: 0.8rem solid functions.get-color("alias", "primary", "bg-strong");
    }
  }

  &.dark-mode {
    $default-color: functions.get-color("alias", "primary", "weak");
    $hover-color: functions.get-color("alias", "primary", "bg-strong");
    $active-color: functions.get-color("alias", "grayscale", "bg");

    background-color: transparent;
    color: $default-color;
    border: 0.2rem solid $default-color;

    svg {
      stroke: $default-color;
    }

    &:hover {
      color: $hover-color;
      border-color: $hover-color;
    }

    &:active {
      color: $active-color;
      border: 0.2rem solid $active-color;

      svg {
        stroke: $active-color;
      }
    }

    &:focus {
      outline: 0.8rem solid functions.get-color("alias", "grayscale", "body");
    }
  }
}

button.subtle {
  background-color: transparent;
  &.light-mode {
    $font-color: functions.get-color("alias", "primary", "default");
    $font-hover-color: functions.get-color("alias", "primary", "strong");
    $font-active-color: functions.get-color("alias", "grayscale", "header");
    color: $font-color;
    border: 0.2rem solid functions.get-color("alias", "grayscale", "line");

    svg {
      stroke: $font-color;
    }

    &:hover {
      border: 0.2rem solid
        functions.get-color("alias", "grayscale", "placeholder");
      color: $font-hover-color;

      svg {
        stroke: $font-hover-color;
      }
    }

    &:focus {
      outline: 0.8rem solid functions.get-color("alias", "grayscale", "input");
    }

    &:active {
      color: $font-active-color;
      border: 0.2rem solid $font-active-color;

      svg {
        stroke: $font-active-color;
      }
    }
  }

  &.dark-mode {
    $font-color: functions.get-color("alias", "primary", "weak");
    $font-hover-color: functions.get-color("alias", "primary", "bg-strong");
    $border-hover-color: functions.get-color("alias", "grayscale", "body");
    $font-active-color: functions.get-color("alias", "grayscale", "bg");
    border: 0.2rem solid $font-color;
    color: $font-color;
    svg {
      stroke: $font-color;
    }

    &:hover {
      color: $font-hover-color;
      border: 0.2rem solid $border-hover-color;

      svg {
        stroke: $font-hover-color;
      }
    }

    &:focus {
      outline: 0.8rem solid $border-hover-color;
    }

    &:active {
      color: $font-active-color;
      svg {
        stroke: $font-active-color;
      }
    }
  }
}

button.ghost {
  &.light-mode {
    $font-color: functions.get-color("alias", "primary", "default");
    $font-hover-color: functions.get-color("alias", "primary", "strong");
    $font-active-color: functions.get-color("alias", "grayscale", "header");
    background-color: transparent;
    border: none;
    color: $font-color;

    svg {
      stroke: $font-color;
    }
    &:hover {
      background-color: functions.get-color(
        "global",
        "transparents",
        "solids",
        "light",
        "80"
      );
      color: $font-hover-color;
      svg {
        stroke: $font-hover-color;
      }
    }

    &:focus {
      outline: 0.8rem solid functions.get-color("alias", "grayscale", "input");
    }

    &:active {
      color: $font-active-color;
      svg {
        stroke: $font-active-color;
      }
    }
  }

  &.dark-mode {
    $font-color: functions.get-color("alias", "primary", "weak");
    $font-hover-color: functions.get-color("alias", "primary", "bg-strong");
    $font-active-color: functions.get-color("alias", "grayscale", "bg");
    $bg-hover-color: functions.get-color(
      "global",
      "transparents",
      "solids",
      "dark",
      "80"
    );
    background-color: transparent;
    color: $font-color;

    &:hover {
      color: $font-hover-color;
      background-color: $bg-hover-color;
      svg {
        stroke: $font-hover-color;
      }
    }

    &:focus {
      outline: 0.8rem solid functions.get-color("alias", "grayscale", "body");
    }

    &:active {
      color: $font-active-color;
      svg {
        stroke: $font-active-color;
      }
    }

    svg {
      stroke: $font-color;
    }
  }
}
</style>
