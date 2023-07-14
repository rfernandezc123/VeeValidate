<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="m-5">
      <h1 class="text-start">Clients</h1>
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary" @click="newClient()">ADD CLIENT</button>
      </div>
      <div class="table-responsive">
        <b-table thead-class="table-dark" hover :fields="fields" :items="listClients">
          <template #cell(ClientName)="row">
            {{ row.item.name }}
          </template>
          <template #cell(DOB)="row">
            {{ row.item.dob }}
          </template>
          <template #cell(Phone)="row">
            {{ row.item.phone }}
          </template>
          <template #cell(Email)="row">
            {{ row.item.email }}
          </template>
          <template #cell(Address)="row">
            {{ row.item.address }}
          </template>
          <template #cell(Payments)="row">
            {{ row.item.payments }}
          </template>
          <template #cell(Total)="row">
            $ {{ row.item.total }}
          </template>
          <template #cell(actions)="row">
            <div class="btn-group" role="group" aria-label="Button group">
              <b-button size="sm" variant="success" @click="editClient(row.item.id)">UDATE</b-button>
              <b-button size="sm" variant="danger" @click="deleteClient(row.item.id)">DELETE</b-button>
            </div>
          </template>

        </b-table>
      </div>


    </div>
    <modalCreate v-if="showModalCreate" @closeModalCreate="showModalCreate = false" @close="registerClient()" />
    <modalUpdate v-if="showModalUpdate" @closeModalUpdate="showModalUpdate = false" :client_id="client_id"
      @close="updateClient()" />
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios"
import modalCreate from "@/components/create.vue"
import modalUpdate from "@/components/edit.vue"
import Swal from 'sweetalert2';
export default {
  name: 'HomeView',
  components: {
    modalCreate,
    modalUpdate,
  },
  data: function () {
    return {
      listClients: null,
      showModalCreate: false,
      showModalUpdate: false,
      client_id: null,
      fields: [
        { key: "ClientName", label: "Client Name" },
        { key: "DOB", label: "DOB" },
        { key: "Phone", label: "Phone" },
        { key: "Email", label: "Email" },
        { key: "Address", label: "Address" },
        { key: "Payments", label: "Payments" },
        { key: "Total", label: "Total" },
        { key: "Actions", label: "Actions" }
      ]
    }
  },
  mounted: function () {
    this.getClients();
  },
  methods: {
    async getClients() {
      try {
        const { status, data } = await axios.get("http://127.0.0.1:8000/api/clients");
        if (status === 200) {
          this.listClients = data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    newClient() {
      this.showModalCreate = true; close
    },
    registerClient() {
      this.showModalCreate = false;
      this.getClients();
    },
    editClient(id) {
      this.client_id = id;
      this.showModalUpdate = true;
    },
    updateClient() {
      this.showModalUpdate = false;
      this.getClients();
    },
    deleteClient(id) {
      Swal.fire({
        title: "You're sure?",
        text: 'This action can not be undone',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes continue',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.executeDeleteClient(id);
        }
      });
    },

    async executeDeleteClient(id) {
      try {
        const { data } = await axios.delete(`http://127.0.0.1:8000/api/clients/${id}`);
        Swal.fire({
          position: 'top-end',

          icon: 'success',
          title: 'Delete Clients',
          text: data.message,
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        this.getClients();
      } catch (error) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error',
          html: error.message,
          toast: true,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          showCancelButton: false,

        });
      }
    }
  }
}
</script>
