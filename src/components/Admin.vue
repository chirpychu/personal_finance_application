<template>
  <v-data-table
    :headers="headers"
    :items="users"
    sort-by="username"
    class="elevation-1"
  >
    <template v-slot:item.CRE_ON="{ item }">
      <span>{{ new Date(item.CRE_ON).toLocaleString() }}</span>
    </template>
    <template v-slot:item.LAST_LOGIN="{ item }">
      <span v-if="item">{{ new Date(item.LAST_LOGIN).toLocaleString() }}</span>
    </template>
    <template v-slot:item.STAT="{ item }">
      <v-chip :color="getColor(item.STAT)" dark>{{ item.STAT }}</v-chip>
    </template>
    <template v-slot:item.IS_ADMIN="{ item }">
      <v-chip :color="getUserAccessRole(item.STAT)" dark>{{
        item.IS_ADMIN
      }}</v-chip>
    </template>
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>User's Table</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
              >New User</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-form v-model="isFormValid">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.USER_NAME"
                        label="Username"
                        required
                        :counter="12"
                        :rules="usernameRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.STAT"
                        :items="stat"
                        label="Status"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.USER_EMAIL"
                        label="E-mail"
                        :rules="emailRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.IS_ADMIN"
                        :items="isAdmin"
                        label="Access Role"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-btn @click="autoGeneratePassword"
                        >Generate Password</v-btn
                      >
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="password"
                        label="New Password"
                        :rules="passwordRules"
                        outlined
                        clearable
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-form>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn
                :disabled="!isFormValid"
                color="blue darken-1"
                text
                @click="save"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    isFormValid: false,
    usernameRules: [
      v => !!v || "UserName is required",
      v => (v && v.length <= 12) || "UserName must be less than 12 characters"
    ],
    emailRules: [
      v => !!v || "Email Address is required",
      v => /.+@.+\..+/.test(v) || "Email Address must be valid",
      v => (v || "").indexOf(" ") < 0 || "No spaces are allowed"
    ],
    passwordRules: [v => !!v || "password is required"],
    dialog: false,
    headers: [
      {
        text: "Username",
        align: "start",
        sortable: false,
        value: "USER_NAME"
      },
      { text: "Status", value: "STAT" },
      { text: "E-mail", value: "USER_EMAIL" },
      { text: "Registered", value: "CRE_ON" },
      { text: "Last Login", value: "LAST_LOGIN", sortable: false },
      { text: "Is Admin", value: "IS_ADMIN" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      USER_NAME: null,
      STAT: null,
      USER_EMAIL: null,
      CRE_ON: null,
      LAST_LOGIN: null,
      IS_ADMIN: null
    },
    defaultItem: {
      USER_NAME: null,
      STAT: null,
      USER_EMAIL: null,
      CRE_ON: null,
      LAST_LOGIN: null,
      IS_ADMIN: null
    },
    select: null,
    stat: [
      { value: "A", text: "Active" },
      { value: "D", text: "Deactive" }
    ],
    isAdmin: [
      {
        value: "true",
        text: "Admin"
      },
      {
        value: "false",
        text: "Normal User"
      }
    ],
    password: ""
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit User";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.retrieveRegisteredUsers();
  },
  methods: {
    getColor(stat) {
      if (stat == "A") return "green";
      else return "red";
    },
    getUserAccessRole(role) {
      if (role == 0) return "No";
      else return "Yes";
    },
    autoGeneratePassword() {
      var length = 8,
        charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      this.password = retVal;
    },
    retrieveRegisteredUsers() {
      this.$http
        .get("admin/retrieveusers")
        .then(response => {
          this.users = response.data;
          console.log(typeof this.users);
          console.log(this.users);
        })
        .catch(err => {
          console.log(err);
        });
    },
    editUpdateUsers(userId) {
      console.log(`Logging users array`, this.users);
      console.log(`Editing user id of: ${userId}`);
      const user_Id = userId + 1;
      console.log(`Editing user id After: ${user_Id}`);
      console.log(`User password: ${this.password}`);
      this.$http
        .post(`admin/updateUser/${user_Id}`, {
          username: this.users[userId].USER_NAME,
          useremail: this.users[userId].USER_EMAIL,
          stat: this.users[userId].STAT,
          isAdmin: this.users[userId].IS_ADMIN,
          password: this.password
        })
        .then(() => {
          alert("Updated User");
          console.log(
            `Updated for user of userid: ${userId},
              username: ${this.users[userId].USER_NAME},
              useremail: ${this.users[userId].USER_EMAIL},
              status: ${this.users[userId].STAT},
            `
          );
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.data);
          }
        });
    },
    deleteUser(userid) {
      const authorizationToken = localStorage.getItem("user");
      console.log(`Deleting user of userid: ${userid}`);
      console.log(`Authorization token: ${authorizationToken}`);
      this.$http
        .delete(`admin/deleteuser/${userid}`, {
          headers: {
            Authorization: authorizationToken
          }
        })
        .then(res => {
          alert("Deleted User!");
          console.log(res.data);
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.data);
          }
        });
    },
    createNewUser() {
      const newUserCount = this.users.length;
      const newUserArray = this.users.length - 1;
      console.log(`User count after upon new user insertion: ${newUserCount}`);
      console.log(`Array user index upon new user insertion: ${newUserArray}`);
      this.$http
        .post("admin/addnewuser", {
          username: this.users[newUserArray].USER_NAME,
          useremail: this.users[newUserArray].USER_EMAIL,
          password: this.password,
          isAdmin: this.users[newUserArray].IS_ADMIN,
          status: this.users[newUserArray].STAT
        })
        .then(res => {
          alert("User Created");
          console.log(res.data);
        })
        .catch(err => {
        this.users.pop(this.editedItem);
          console.log(err.response.data);
          alert(err.response.data);
        });
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.users.indexOf(item);
      confirm("Are you sure you want to delete this user?") &&
        this.users.splice(index, 1);
      this.deleteUser(index + 1);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem);
        this.editUpdateUsers(this.editedIndex);
      } else {
        console.log(`Current users: ${this.users.length}`);
        this.users.push(this.editedItem);
        console.log("Logging new user info", this.editedItem);
        this.createNewUser();
      }
      console.log("Logging User Details for " + this.editedIndex, this.users);
      this.close();
    }
  }
};
</script>

<style></style>
