export default {
  props: {
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
      route: {
        startCity: "",
        endCity: "",
        distance: null,
        dispatchDate: "",
        executionDate: "",
        revenue: null,
        transportType: "",
        status: "",
        transportId: null,
      },
      statusTypeOptions: [
        {text: "Awaiting shipment", value: "awaiting shipment"},
        {text: "In progress", value: "in progress"},
        {text: "Completed", value: "completed"},
      ],
      transportTypeOptions: [
        {text: "Truck", value: "truck"},
        {text: "Car", value: "car"},
        {text: "Van", value: "van"},
      ],
    };
  },
  watch: {
    "route.transportType": {
      immediate: false,
      handler: async function (newValue) {
        this.transportOptions = await this.fetchAvailableTransports(newValue)
      },
    },
  },
  computed: {
    isFormValid() {
      return this.route.startCity && this.route.endCity;
    },
  },
  methods: {
    createRoute() {
      this.$emit("create-route", this.route);
    },
    clearModal() {
      this.route = {
        startCity: "",
        endCity: "",
        distance: null,
        dispatchDate: "",
        executionDate: "",
        revenue: null,
        transportType: "",
        status: "",
        transportId: null,
      }
    }
  },
}
