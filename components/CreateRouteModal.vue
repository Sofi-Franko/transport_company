<template>
  <b-modal
    id="create-modal"
    title="Create Route"
    @ok="createRoute"
    @hidden="clearModal"
    :ok-disabled="!isFormValid"
  >
    <b-form>
      <b-form-group label="Start City (required)">
        <b-form-input v-model="route.startCity" required />
      </b-form-group>
      <b-form-group label="End City (required)">
        <b-form-input v-model="route.endCity" required />
      </b-form-group>
      <b-form-group label="Distance">
        <b-form-input v-model="route.distance" type="number"/>
      </b-form-group>
      <b-form-group label="Dispatch Date">
        <b-form-datepicker v-model="route.dispatchDate"/>
      </b-form-group>
      <b-form-group label="Execution Date">
        <b-form-datepicker v-model="route.executionDate"/>
      </b-form-group>
      <b-form-group label="Expected Revenue">
        <b-form-input v-model="route.revenue" type="number"/>
      </b-form-group>
      <b-form-group label="Status">
        <b-form-select v-model="route.status" :options="statusTypeOptions">
          <template #first>
            <option :value="null" disabled>Select Status type</option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group label="Transport Type">
        <b-form-select v-model="route.transportType" :options="transportTypeOptions">
          <template #first>
            <option :value="null" disabled>Select Transport type</option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group label="Transport">
        <b-form-select v-model="route.transportId" :options="transportOptions">
          <template #first>
            <option :value="null" disabled>Select Transport</option>
          </template>
        </b-form-select>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import CreateRouteModalLogic from './scripts/CreateRouteModalLogic';

export default {
  ...CreateRouteModalLogic
};
</script>
