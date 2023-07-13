<template>
  <b-modal
    id="edit-modal"
    title="Edit Route"
    @ok="updateRoute"
  >
    <b-form>
      <b-form-group label="Start City">
        <b-form-input v-model="editingRoute.startCity"/>
      </b-form-group>
      <b-form-group label="End City">
        <b-form-input v-model="editingRoute.endCity"/>
      </b-form-group>
      <b-form-group label="Distance">
        <b-form-input v-model="editingRoute.distance" type="number"/>
      </b-form-group>
      <b-form-group label="Dispatch Date">
        <b-form-datepicker v-model="editingRoute.dispatchDate"/>
      </b-form-group>
      <b-form-group label="Execution Date">
        <b-form-datepicker v-model="editingRoute.executionDate"/>
      </b-form-group>
      <b-form-group label="Expected Revenue">
        <b-form-input v-model="editingRoute.revenue" type="number"/>
      </b-form-group>
      <b-form-group label="Status">
        <b-form-select v-model="editingRoute.status" :options="statusTypeOptions">
          <template #first>
            <option :value="null" disabled>Select Status type</option>
          </template>
        </b-form-select>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import EditRouteModalLogic from './scripts/EditRouteModalLogic';

export default {
  ...EditRouteModalLogic
};
</script>
