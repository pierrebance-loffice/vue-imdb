<template>
  <v-dialog
    :model-value="dialog"
    max-width="800px"
    persistent
    @update:model-value="emit('update:dialog', $event)"
  >
    <v-card>
      <v-card-title
        class="d-flex justify-end sticky-top"
        style="position: sticky; top: 0; z-index: 1"
      >
        <v-btn icon @click="emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="position: relative">
        <slot></slot>
      </v-card-text>
      <div
        v-if="props.navigateTo"
        class="mt-4 pa-4"
        style="position: sticky; bottom: 0; left: 0; right: 0; z-index: 1"
      >
        <v-btn
          color="primary"
          class="mt-4 m-1"
          style="width: 100%"
          @click="emit('navigate', props.navigateTo)"
        >
          {{ props.navigateLabel }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

/**
 * Modal Component
 *
 * A reusable modal dialog component that provides a consistent interface for displaying
 * content in a popup window. The modal includes a close button and optional navigation.
 *
 * @component
 * @example
 * ```vue
 * <Modal
 *   v-model:dialog="showModal"
 *   :navigate-to="'/some-path'"
 *   navigate-label="Go to Details"
 *   @close="handleClose"
 *   @navigate="handleNavigate"
 * >
 *   <div>Modal content goes here</div>
 * </Modal>
 * ```
 */
const props = defineProps({
  /** Controls the visibility of the modal */
  dialog: {
    type: Boolean,
    required: true,
  },
  /** Optional path to navigate to when the navigation button is clicked */
  navigateTo: {
    type: String,
    default: "",
  },
  /** Label text for the navigation button */
  navigateLabel: {
    type: String,
    default: "Navigate to",
  },
});

/**
 * Component events
 * @emits {boolean} update:dialog - Emitted when the dialog visibility changes
 * @emits {void} close - Emitted when the close button is clicked
 * @emits {string} navigate - Emitted when the navigation button is clicked, with the target path
 */
const emit = defineEmits(["close", "update:dialog", "navigate"]);
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style>
