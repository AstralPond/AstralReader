<script setup lang="ts">
import Button from "@/components/Button.vue";
import LogoIcon from "@/components/icons/Logo.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import useAuth from "@/use/auth";
import { useMutation } from "villus";
import { computed, reactive, ref, watch } from "vue";

const { auth, refetchUserData } = useAuth();
const libraryName = ref("");
const activeTabIndex = ref(0);
const tabs = ["Library Name", "Folders"];
const showFolderInputModal = ref(false);
const selectedFolder = reactive([]);
const folderPath = computed(() => {
  return "/" + selectedFolder.join("/");
});
const dirStack = ref([]);
const CreateLibrary = `
  mutation CreateLibraryWithFolder ($email: String!, $libraryName: String!, $targetPath: String!) {
    createLibraryWithFolder(email: $email, libraryName: $libraryName, targetPath: $targetPath) {
      id
    }
  }
`;
const { data, error, isFetching, execute } = useMutation(CreateLibrary);
async function updateDirTree() {
  const response = await fetch("http://localhost:3000/dir-autocompletion", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ input: folderPath.value }),
  });
  const data = await response.json();
  dirStack.value = data;
}

async function goOutOneDir() {
  selectedFolder.pop();
}
updateDirTree();
function handleNextBtn() {
  if (activeTabIndex.value === tabs.length - 1) {
    createLibrary();
  } else {
    activeTabIndex.value++;
  }
}

async function createLibrary() {
  const result = await execute({
    email: auth.value.user?.email,
    libraryName: libraryName.value,
    targetPath: folderPath.value,
  });

  if (result.error) {
    // TODO: error handling
  } else {
    await refetchUserData();
  }
}

watch(selectedFolder, () => {
  updateDirTree();
});
</script>

<template>
  <div
    v-show="showFolderInputModal"
    class="fullscreen modal-container"
    @click.self="showFolderInputModal = false"
  >
    <div id="folder-input-modal" class="modal d-flex">
      <div class="left-panel desktop-text-large overflow-y-scroll">
        <ul>
          <li @click="goOutOneDir">.. [Back]</li>
          <li
            :key="dir"
            v-for="dir in dirStack"
            @click="selectedFolder.push(dir)"
          >
            {{ dir }}
          </li>
        </ul>
      </div>
      <div
        class="main-panel d-flex justify-content-center align-items-center justify-content-around"
      >
        <Button
          class="action-btn"
          size="medium"
          type="primary"
          @click="showFolderInputModal = false"
        >
          Add
        </Button>
      </div>
    </div>
  </div>

  <div
    class="fullscreen text-center d-flex justify-content-center flex-column align-items-center"
  >
    <h2 class="d-flex align-items-center flex-column">
      <LogoIcon />
      <span class="desktop-display-x-small fw-3 font-poppins mt-2"
        >Astral Reader</span
      >
    </h2>

    <h1 class="desktop-display-huge mb-8">Create Your First Library</h1>
    <div class="modal d-flex">
      <div class="left-panel desktop-link-x-small">
        <ul>
          <li
            :key="tab"
            v-for="(tab, index) in tabs"
            class="transition"
            :class="{ active: index === activeTabIndex }"
            @click="activeTabIndex = index"
          >
            {{ tab }}
          </li>
        </ul>
      </div>
      <form
        class="main-panel d-flex justify-content-center align-items-center justify-content-around"
        @submit.prevent="handleNextBtn"
        autocomplete="off"
      >
        <TextInput
          v-if="activeTabIndex === 0"
          class="mb-10"
          size="medium"
          type="underlined"
          label="Library Name"
          name="libraryName"
          v-model:value="libraryName"
        />
        <TextInput
          v-if="activeTabIndex === 1"
          class="mb-10"
          size="medium"
          type="underlined"
          label="Folder Path"
          name="libraryName"
          v-model:value="folderPath"
          @click="showFolderInputModal = true"
        />
        <Button
          @click.prevent="showFolderInputModal = true"
          v-if="activeTabIndex === 1"
          size="small"
          type="secondary"
          darkMode
          >Browse...</Button
        >
        <Button class="action-btn" size="small" type="primary">{{
          activeTabIndex < tabs.length - 1 ? "Next" : "Finish"
        }}</Button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/scss/abstracts/functions";
@use "@/scss/abstracts/mixins";

.left-panel {
  background-color: functions.get-color("alias", "grayscale", "header");
  width: 25%;
  ul {
    list-style: none;
  }
}

.main-panel {
  width: 100%;
}

.modal {
  position: relative;
  border-radius: 1.6rem 0 0 1.6rem;
  height: 40rem;
  width: 70rem;
  background-color: functions.get-color("alias", "grayscale", "header-weak");
  overflow: hidden;
  border-top: 3rem solid functions.get-color("alias", "primary", "weak");
  @include mixins.elevation(3);
}

#folder-input-modal {
  height: 80%;
  width: 80%;
  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

div.fullscreen {
  background-color: functions.get-color("alias", "grayscale", "body");
  color: #ffffff;

  h2 {
    position: absolute;
    left: 5rem;
    top: 5rem;
  }

  li {
    transition-property: background;
    line-height: 4.2rem;
    vertical-align: middle;
    cursor: pointer;
    &:hover {
      background-color: functions.get-color(
        "alias",
        "grayscale",
        "header-weak"
      );
    }
  }

  li.active {
    background-color: functions.get-color("alias", "grayscale", "header-weak");
  }

  .action-btn {
    position: absolute;
    bottom: 3rem;
    right: 3rem;
  }
}

div.modal-container {
  background-color: rgba(#000000, 0.5);
  z-index: 999;
}
</style>
