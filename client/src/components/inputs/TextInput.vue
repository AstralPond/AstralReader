<script setup lang="ts">
import InputXIcon from "@/components/icons/InputX.vue";
import PlaceholderCircle from "@/components/icons/PlaceholderCircle.vue";
import { computed, ref, type InputHTMLAttributes, type VNodeRef } from "vue";

export type Type = "underlined" | "default";
export type Size = "medium" | "large";

export interface Props {
  type?: Type;
  size?: Size;
  inputType?: InputHTMLAttributes["type"];
  showIcon?: boolean;
  darkMode?: boolean;
  disabled?: boolean;
  value: string;
  label: string;
  name: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  size: "medium",
  inputType: "text",
  showIcon: false,
  darkMode: true,
  disabled: false,
});

const emit = defineEmits<{
  (event: "update:value", value: string): void;
  (event: "click"): void;
}>();

const isFocused = ref(false);
const isMouseOverIcon = ref(false);
const inputRef = ref<null | VNodeRef>(null);

function handleOnDivClick() {
  emit("click");
  inputRef.value.focus();
}

// Clear input value
function handleXIconClick() {
  emit("update:value", "");
}

function handleXIconMouseover() {
  if (props.value.length > 0) {
    isMouseOverIcon.value = true;
  }
}

const labelClassObj = computed(() => {
  if (props.type === "default") {
    return {
      [props.size]: true,
      "desktop-text-x-small above": isFocused.value || props.value.length > 0,
      "desktop-text-small": !isFocused.value,
    };
  } else {
    return {
      [props.size]: true,
      "desktop-text-small": true,
      above: isFocused.value || props.value.length > 0,
    };
  }
});

const divClassObj = computed(() => ({
  [props.size]: true,
  [props.type]: true,
  "py-2": props.size === "medium",
  "py-3": props.size === "large",
}));

const svgClassObj = computed(() => ({
  hide: !isFocused.value || (isFocused.value && props.value.length === 0),
  show: (isFocused.value && props.value.length > 0) || isMouseOverIcon.value,
}));

const inputClassObj = computed(() => ({
  [props.size]: true,
}));
</script>

<template>
  <div
    id="container"
    @click="handleOnDivClick"
    class="d-flex align-items-center pl-6 pos-relative transition"
    :class="divClassObj"
  >
    <div class="d-flex" v-if="props.showIcon">
      <PlaceholderCircle />
    </div>
    <div>
      <label
        class="px-6 pos-absolute z-1 transition"
        :class="labelClassObj"
        :for="props.name"
        >{{ label }}</label
      >
      <input
        :id="props.name"
        ref="inputRef"
        :disabled="props.disabled"
        class="desktop-text-small px-6 pos-absolute transition"
        :class="inputClassObj"
        :type="props.inputType"
        :value="props.value"
        @input="emit('update:value', ($event.target as HTMLInputElement).value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @click="emit('click')"
      />
      <InputXIcon
        class="x-icon pos-absolute z-10 transition"
        @click="handleXIconClick"
        :class="svgClassObj"
        @mouseover="handleXIconMouseover"
        @mouseout="isMouseOverIcon = false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/scss/abstracts/functions";
@use "@/scss/abstracts/mixins";

div#container {
  transition-property: border background;
  width: 32.5rem;
  cursor: text;

  &.large {
    height: 6.4rem;
  }

  &.medium {
    height: 5.6rem;
  }

  label {
    top: 50%;
    transform: translateY(-50%);
    transition-property: top;

    &.above {
      transform: translateY(0);
      &.medium {
        top: functions.get-space(2);
      }

      &.large {
        top: functions.get-space(3);
      }
    }
  }

  input {
    outline: none;
    border: none;
    transition-property: border-color background;

    &.medium {
      bottom: functions.get-space(2);
    }

    &.large {
      bottom: functions.get-space(3);
    }
  }

  &.underlined {
    border-bottom: 0.2rem solid
      functions.get-color("alias", "grayscale", "body");
    &:focus-within {
      border-bottom: 0.2rem solid
        functions.get-color("alias", "grayscale", "bg");
    }

    label {
      color: functions.get-color("alias", "grayscale", "bg");
    }

    input {
      color: functions.get-color("alias", "grayscale", "bg");
      background: transparent;
    }
  }

  &.default {
    border: 2px solid transparent;
    background-color: functions.get-color("alias", "grayscale", "header-weak");
    border-radius: 1.2rem;
    overflow: hidden;

    &:focus-within {
      background-color: functions.get-color("alias", "grayscale", "header");
      border: 2px solid functions.get-color("alias", "grayscale", "line");
      outline: none;
    }

    label {
      color: functions.get-color("alias", "grayscale", "line");
    }

    input {
      background-color: functions.get-color(
        "alias",
        "grayscale",
        "header-weak"
      );
      color: functions.get-color("alias", "grayscale", "bg");

      &:focus {
        background-color: functions.get-color("alias", "grayscale", "header");
      }
    }
  }

  svg.x-icon {
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);
    transition-property: opacity;

    &.hide {
      opacity: 0;
    }

    &.show {
      opacity: 1;
      cursor: pointer;
    }
  }
}
</style>
