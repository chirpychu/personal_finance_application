import { mapGetters } from "vuex";

export const authComputed = {
  ...mapGetters(["authentication/loggedIn"])
};

export const retrieveAccountId = {
  ...mapGetters(["authentication/getAccountId"])
};
