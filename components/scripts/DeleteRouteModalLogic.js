export default {
  props: {
    routeId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      routeIdToDelete: "",
    }
  },
  watch: {
    routeId: {
      immediate: true,
      handler(id) {
        this.routeIdToDelete = id;
      },
    }
  },
  methods: {
    deleteRoute() {
      this.$emit("delete-route");
    },
  },
}
