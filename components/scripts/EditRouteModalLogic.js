export default {
  props: {
    routeToEdit: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      originalRouteData: {},
      editingRoute: {},
      statusTypeOptions: [
        {text: "Awaiting shipment", value: "awaiting shipment"},
        {text: "In progress", value: "in progress"},
        {text: "Completed", value: "completed"},
      ]
    };
  },
  watch: {
    routeToEdit: {
      immediate: true,
      handler(route) {
        this.editingRoute = { ...route };
        this.originalRouteData = { ...route };
      },
    },
  },
  methods: {
    updateRoute() {
      this.$emit("update-route", this.editingRoute);
    },
    clearModal() {
      this.editingRoute = {
        startCity: "",
        endCity: "",
        distance: null,
        dispatchDate: "",
        executionDate: "",
        revenue: null,
        status: "",
      }
    }
  },
}
