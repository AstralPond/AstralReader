<script setup lang="ts">
import Button from "@/components/Button.vue";
import LogoIcon from "@/components/icons/Logo.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import useAuth from "@/use/auth";
import { useMutation } from "villus";
import { computed, reactive, ref, watch } from "vue";

const { auth, refetchUserData } = useAuth();
// Used to store value for library name text input
const libraryName = ref("");
// Used to change tabs on the side of the smaller (initial) modal
const activeTabIndex = ref(0);
// Tabs to be used on the side of the smaller modal
const tabs = ["Library Name", "Folders"];
// Used for conditionally rendering the larger modal
const showFolderInputModal = ref(false);
// array of directory names from updateDirTree function
const dirStack = ref<string[]>([]);
// pushes/pops directories into here based on what the user selects
const selectedFolder = reactive<string[]>([]);
// convert array of selected folders to human readable path
const folderPath = computed(() => {
  return "/" + selectedFolder.join("/");
});

const CreateLibrary = `
  mutation CreateLibraryWithFolder ($email: String!, $libraryName: String!, $targetPath: String!) {
    createLibraryWithFolder(email: $email, libraryName: $libraryName, targetPath: $targetPath) {
      id
    }
  }
`;
const { execute } = useMutation(CreateLibrary);
async function updateDirTree() {
  const response = await fetch("http://localhost:3000/dir-autocompletion", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ input: folderPath.value }),
  });
  const data: string[] = await response.json();
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
    class="fullscreen modal-container bg-alias-grayscale-body"
    @click.self="showFolderInputModal = false"
  >
    <div
      id="folder-input-modal"
      class="modal pos-relative d-flex pos-absolute transform-center elevate-3 bg-alias-grayscale-header-weak overflow-hidden"
    >
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
          <li v-show="dirStack.length > 0" @click="goOutOneDir">.. [Back]</li>
        </ul>
      </div>
      <div
        class="main-panel d-flex justify-content-center align-items-center justify-content-around"
      >
        <Button
          class="pos-absolute bottom-8 right-8"
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
    class="fullscreen bg-alias-grayscale-body text-center d-flex justify-content-center flex-column align-items-center"
  >
    <h2
      class="d-flex align-items-center flex-column pos-absolute left-10 top-10"
    >
      <LogoIcon />
      <span class="desktop-display-x-small fw-3 font-poppins mt-2"
        >Astral Reader</span
      >
    </h2>

    <h1 class="desktop-display-huge mb-8">Create Your First Library</h1>
    <div
      class="modal d-flex pos-relative bg-alias-grayscale-header-weak overflow-hidden"
    >
      <div class="bg-alias-grayscale-header left-panel desktop-link-x-small">
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
        <Button
          class="pos-absolute right-8 bottom-8"
          size="small"
          type="primary"
          >{{ activeTabIndex < tabs.length - 1 ? "Next" : "Finish" }}</Button
        >
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/scss/abstracts/functions";

.left-panel {
  width: 25%;
}

.main-panel {
  width: 100%;
}

.modal {
  border-radius: 1.6rem 0 0 1.6rem;
  height: 40rem;
  width: 70rem;
  border-top: 3rem solid functions.get-color("alias", "primary", "weak");
}

#folder-input-modal {
  height: 80%;
  width: 80%;
}

div.fullscreen {
  color: #ffffff;

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
}

div.modal-container {
  background-color: rgba(#000000, 0.5);
  z-index: 999;
}
</style>
