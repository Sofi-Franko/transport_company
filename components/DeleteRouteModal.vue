<template>
  <b-modal
    id="delete-modal"
    title="Delete Route"
    @ok="deleteRoute"
  >
    <b-container>
      Are you sure you want to delete current route? ID: {{ routeIdToDelete }}
    </b-container>
  </b-modal>
</template>

<script>
import DeleteRouteModalLogic from './scripts/DeleteRouteModalLogic';

export default {
  ...DeleteRouteModalLogic
};
</script>
