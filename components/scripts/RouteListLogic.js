export default {
  data() {
    return {
      routes: [],
      filteredRoutes: [],
      filter: {
        status: "",
        startCity: "",
        endCity: "",
      },
      statusOptions: [
        {text: "All", value: ""},
        {text: "Awaiting Shipment", value: "awaiting shipment"},
        {text: "In Progress", value: "in progress"},
        {text: "Completed", value: "completed"},
      ],
      orderOptions: [
        {text: "Ascending", value: "asc"},
        {text: "Descending", value: "desc"},
      ],
      routeFields: [
        {key: "id", label: "ID"},
        {key: "startCity", label: "Start City", sortable: true},
        {key: "endCity", label: "End City", sortable: true},
        {key: "distance", label: "Distance (km)", sortable: true},
        {key: "dispatchDate", label: "Dispatch Date", sortable: true},
        {key: "executionDate", label: "Execution Date", sortable: true},
        {key: "transportType", label: "Transport Type", sortable: true},
        {key: "status", label: "Status", sortable: true},
        {key: "revenue", label: "Revenue ($)", sortable: true},
        {key: "actions", label: "Actions"},
      ],
      editingRoute: {
        id: "",
        startCity: "",
        endCity: "",
        distance: null,
        dispatchDate: "",
        executionDate: "",
        revenue: null,
        status: "",
      },
      routeToAssignTransport: {
        id: "",
        transportType: "",
        transportId: null,
      },
      transportOptions: [],
      routeId: "",
    };
  },
  mounted() {
    this.fetchRoutes();
  },
  methods: {
    async fetchRoutes() {
      try {
        const routes = await this.$axios.$get('/api/routes');
        this.routes = routes;
        this.filteredRoutes = routes;
      } catch (error) {
        console.error(error);
      }
    },
    async filterList() {
      const {status, startCity, endCity} = this.filter

      const params = {}
      if (status) params.status = status
      if (startCity) params.startCity = encodeURIComponent(startCity);
      if (endCity) params.endCity = encodeURIComponent(endCity);

      let response;
      try {
        response = await this.$axios.$get('/api/routes', {params});
        this.filteredRoutes = response;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchAvailableTransports(type, assignedTransportId) {
      let transports
      try {
        transports = await this.$axios.$get(`/api/transports?type=${type}&status=free`);
      } catch (error) {
        console.error(error);
        return [];
      }

      const preparedTransports = transports.map((transport) => ({
        value: transport.id,
        text: `${transport.model} - ${transport.licensePlate} - ${transport.mileage} km`,
        type: transport.type
      }));

      if (assignedTransportId) {
        let assignedTransport;
        try {
          assignedTransport = await this.$axios.$get(`/api/transports/${assignedTransportId}`);
        } catch (error) {
          console.error(error);
          return
        }

        preparedTransports.unshift({
          value: assignedTransport.id,
          text: `${assignedTransport.model} - ${assignedTransport.licensePlate} - ${assignedTransport.mileage} km`,
          type: assignedTransport.type
        })
      }

      return preparedTransports
    },
    async openEditRouteModal(route) {
      this.editingRoute = {...route};
      this.$bvModal.show("edit-modal");
    },
    async editRoute(updatedRoute) {
      try {
        await this.$axios.$put(`/api/routes/${this.editingRoute.id}`, updatedRoute);
        await this.fetchRoutes();
        this.$bvModal.hide("edit-modal");
        alert("Updated successfully")
      } catch (error) {
        console.error(error);
      }
    },
    openDeleteRouteModal(route) {
      this.routeId = route.id;
      this.$bvModal.show("delete-modal");
    },
    async deleteRoute() {
      try {
        await this.$axios.$delete(`/api/routes/${this.routeId}`);
        await this.fetchRoutes();
        this.$bvModal.hide("delete-modal");
        alert("Route was successfully deleted")
      } catch (error) {
        console.error(error);
      }
    },
    async openCreateRouteModal() {
      this.$bvModal.show("create-modal");
    },
    async createRoute(newRoute) {
      try {
        await this.$axios.$post("/api/routes", newRoute);
        await this.fetchRoutes();
        this.$bvModal.hide("create-modal");
        alert("Route created successfully")
      } catch (error) {
        console.error(error);
      }
    },
    async openAssignTransportModal(route) {
      this.routeToAssignTransport = {
        id: route.id,
        transportId: route.transportId,
        transportType: route.transportType,
      };
      this.transportOptions = await this.fetchAvailableTransports(route.transportType, route.transportId);
      this.$bvModal.show("assign-modal");
    },
    async assignTransport(updatedRoute) {
      const route = {
        routeId: updatedRoute.id,
        transportId: updatedRoute.transportId,
        transportType: updatedRoute.transportType,
      }
      try {
        await this.$axios.$put(`/api/assign-transport`, route);
        await this.fetchRoutes();
        this.$bvModal.hide("assign-modal");
        alert("Transport assigned successfully")
      } catch (error) {
        console.error(error);
      }
    }
  },
};
