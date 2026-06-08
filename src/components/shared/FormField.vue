<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  label?: string
  type?: string
  placeholder?: string
}>()

const { value, errorMessage } = useField<string>(() => props.name)
</script>

<template>
  <div class="space-y-1.5">
    <Label v-if="label" :for="name">{{ label }}</Label>
    <Input
      :id="name"
      v-model="value"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :class="errorMessage ? 'border-destructive focus-visible:ring-destructive' : ''"
    />
    <p v-if="errorMessage" class="text-xs text-destructive">{{ errorMessage }}</p>
  </div>
</template>
