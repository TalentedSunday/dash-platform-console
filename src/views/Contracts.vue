<template>
  <v-container>
    <v-row v-if="applicationIdentitiesWithContracts.length">
      <v-col>
        <v-simple-table>
          <thead>
            <tr>
              <th><h1>Contract List</h1></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="identity in applicationIdentitiesWithContracts"
              :key="identity.id"
            >
              <td class="pb-5">
                <div class="d-flex justify-space-between align-center">
                  <h2 class="py-5">{{ identity.id }}</h2>

                  <v-btn text @click="() => addNewContract(identity)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </div>
                <v-simple-table v-if="identity.contract.length > 0">
                  <tbody>
                    <tr
                      v-for="contract in identity.contract"
                      :key="contract.id"
                    >
                      <td>{{ contract.id }}</td>
                      <td>
                        <v-btn text @click="() => openDialog(contract)">
                          {{ contract.contract == null ? 'Register' : 'View' }}
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-alert type="error">
          You must have Application Identity
          in order to register a Contract for it
        </v-alert>
      </v-col>
    </v-row>
    <v-dialog
        v-model="showJsonDialog"
        fullscreen hide-overlay transition="dialog-bottom-transition"
    >
      <v-card>
        <v-form @submit="submit">
          <v-toolbar color="primary">
            <v-btn icon @click="showJsonDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Contract for {{selectedContract.id}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="!selectedContract.contract">
              <v-btn
                text
                :loading="submitting"
                @click="submit"
              >
                submit
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
            <AceEditor
              ref="aceEditor"
              v-model="json"
              @init="aceEditorInit"
              lang="json"
              theme="clouds_midnight"
              width="100%"
              height="94vh"
            />
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AceEditor from 'vue2-ace-editor';
import 'brace/mode/json';
import 'brace/theme/clouds_midnight';

export default {
  components: { AceEditor },
  data() {
    return {
      showJsonDialog: false,
      submitting: false,
      selectedContract: {},
      json: '',
    };
  },
  computed: {
    ...mapGetters([
      'applicationIdentitiesWithContracts',
    ]),
  },
  methods: {
    ...mapActions(['registerContract', 'initContract']),
    setAceEditorReadonly() {
      const readonly = this.selectedContract.contract;
      if (this.$refs.aceEditor) {
        this.$refs.aceEditor.editor.setReadOnly(readonly);
      }
    },
    aceEditorInit() {
      this.setAceEditorReadonly();
    },
    addNewContract(identity) {
      const { id } = identity;
      this.initContract({
        identity: id,
      }).then(() => {
        this.showJsonDialog = false;
      }).finally(() => {
        this.submitting = false;
      });
    },
    openDialog(contract) {
      this.selectedContract = contract;
      this.json = contract.contract ? contract.contract : '';
      this.showJsonDialog = true;
      this.setAceEditorReadonly();
    },
    submit() {
      const { json, selectedContract } = this;
      this.submitting = true;
      this.registerContract({
        selectedContract,
        json,
      }).then(() => {
        this.showJsonDialog = false;
      }).finally(() => {
        this.submitting = false;
      });
    },
  },
};
</script>

<style scoped>
  tr>td:last-child {
    width: 1%;
  }

  .ace_editor {
    font-size: 1rem;
  }
</style>
