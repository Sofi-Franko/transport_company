<template>
  <b-modal
    id="assign-modal"
    title="Assign Transport Route"
    @ok="assignTransport"
    @hidden="clearModal"
    :ok-disabled="!isFormValid"
  >
    <b-form>
      <b-form-group label="Transport Type (required)">
        <b-form-select v-model="route.transportType" :options="transportTypeOptions" required>
          <template #first>
            <option :value="null" disabled>Select Transport type</option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group label="Transport (required)">
        <b-form-select v-model="route.transportId" :options="transportOptions" required>
          <template #first>
            <option :value="null" disabled>Select Transport</option>
          </template>
        </b-form-select>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import AssignTransportModalLogic from "@/components/scripts/AssignTransportModalLogic";

export default {
  ...AssignTransportModalLogic
};
</script>
