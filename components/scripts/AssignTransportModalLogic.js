export default {
  props: {
    routeToAssign: {
      type: Object,
      required: true,
    },
    transportOptions: {
      type: Array,
      required: true,
    },
    fetchAvailableTransports: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      originalRouteData: {},
      route: {},
      statusTypeOptions: [
        {text: "Awaiting shipment", value: "awaiting shipment"},
        {text: "In progress", value: "in progress"},
        {text: "Completed", value: "completed"},
      ],
      transportTypeOptions: [
        {text: "Truck", value: "truck"},
        {text: "Car", value: "car"},
        {text: "Van", value: "van"},
      ]
    };
  },
  watch: {
    routeToAssign: {
      immediate: true,
      handler(route) {
        this.route = { ...route };
        this.originalRouteData = { ...route };
      },
    },
    "route.transportType": {
      immediate: false,
      handler: async function (newValue) {
        const originalValue = this.originalRouteData.transportType

        if (originalValue === newValue) {
          this.transportOptions = await this.fetchAvailableTransports(newValue, this.originalRouteData.transportId)
          this.route.transportId = this.originalRouteData.transportId
        } else {
          this.transportOptions = await this.fetchAvailableTransports(newValue)
          this.route.transportId = null
        }
      },
    }
  },
  computed: {
    isFormValid() {
      return this.route.transportId && this.route.transportType;
    },
  },
  methods: {
    assignTransport() {
      this.$emit("assign-transport", this.route);
    },
    clearModal() {
      this.route = {
        id: "",
        transportType: "",
        transportId: null,
      }
    }
  },
}
