<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Dash Platform Console</v-toolbar-title>

      <v-spacer />

      <v-btn text :to="{ name: 'identities' }">Identities</v-btn>
      <v-btn class="ml-1" text :to="{ name: 'names' }">Names</v-btn>
      <v-btn class="ml-1" text :to="{ name: 'contracts' }">Contracts</v-btn>
      <v-btn class="ml-1" text :to="{ name: 'documents' }">Documents</v-btn>
      <v-btn class="ml-1" text @click="forgetWalletDialog = true">Forget Wallet</v-btn>

    </v-app-bar>

    <v-dialog
      v-model="forgetWalletDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text>
          This action will delete all your data.
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="forgetWalletDialog = false">close</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            type="submit"
            :loading="submitting"
            @click="forgetWallet()"
          >
            Forget
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      forgetWalletDialog: false,
    };
  },
  created() {
    this.$vuetify.theme.dark = window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches;
  },
  methods: {
    ...mapActions(['removeAllData']),
    forgetWallet() {
      this.removeAllData();
      this.forgetWalletDialog = false;
    },
  },
};
</script>
