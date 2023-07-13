<template>
  <div>
    <b-container>
      <b-row class="mb-3">
        <b-col>
          <h4>Filters</h4>
          <b-row>
            <b-col md="4">
              <b-form-group label="Status">
                <b-form-select v-model="filter.status" :options="statusOptions" @change="filterList" />
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="Start City">
                <b-form-input v-model="filter.startCity" @input="filterList" />
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="End City">
                <b-form-input v-model="filter.endCity" @input="filterList" />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6">
          <h3>Route List</h3>
        </b-col>
        <b-col md="6" class="d-flex justify-content-end">
          <b-button @click="openCreateRouteModal">Create route</b-button>
        </b-col>
      </b-row>
      <b-table striped hover :items="filteredRoutes" :fields="routeFields">
        <template #cell(actions)="data">
          <b-dropdown text="..." no-caret>
            <b-dropdown-item v-if="data.item.status === 'awaiting shipment'" @click="openAssignTransportModal(data.item)">Assign Transport</b-dropdown-item>
            <b-dropdown-divider v-if="data.item.status === 'awaiting shipment'"></b-dropdown-divider>
            <b-dropdown-item v-if="data.item.status !== 'completed'" @click="openEditRouteModal(data.item)">Edit Route</b-dropdown-item>
            <b-dropdown-divider v-if="data.item.status === 'awaiting shipment'"></b-dropdown-divider>
            <b-dropdown-item v-if="data.item.status !== 'in progress'" @click="openDeleteRouteModal(data.item)">Delete Route</b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
    </b-container>
    <create-route-modal
      :transport-options="transportOptions"
      :fetch-available-transports="fetchAvailableTransports"
      @create-route="createRoute"
    />
    <edit-route-modal
      :route-to-edit="editingRoute"
      @update-route="editRoute"
    />
    <assign-transport-modal
      :route-to-assign="routeToAssignTransport"
      :transport-options="transportOptions"
      :fetch-available-transports="fetchAvailableTransports"
      @assign-transport="assignTransport"
    />
    <delete-route-modal
      :route-id="routeId"
      @delete-route="deleteRoute"
    />
  </div>
</template>

<script>
import RouteListLogic from './scripts/RouteListLogic';
import CreateRouteModal from '@/components/CreateRouteModal';
import EditRouteModal from '@/components/EditRouteModal';
import DeleteRouteModal from '@/components/DeleteRouteModal';
import AssignTransportModal from '@/components/AssignTransportModal';

export default {
  ...RouteListLogic,
  components: {
    CreateRouteModal,
    EditRouteModal,
    DeleteRouteModal,
    AssignTransportModal
  },
};
</script>

<style scoped>
th, td {
  border-right: 1px solid #ccc;
}

th:last-child, td:last-child {
  border-right: none;
}
</style>
