<template>
    <ValidationObserver v-slot="{ invalid }">
        <b-modal v-model="showModalCreate" @hidden="$emit('closeModalCreate')" id="modal-1" title="ADD CLIENT"
            dialog-class="modal-lg">


            <form>
                <validation-provider rules="required|alpha_spaces|min:4|max:100" v-slot="{ errors }">
                    <b-form-group label="Name" :class="{ 'text-danger': errors[0] }" class="mb-3" label-for="name">
                        <b-form-input id="name" :class="{ 'border-danger': errors[0] }"
                            v-model.trim="form.name"></b-form-input>
                        <span class="text-danger">{{ errors[0] }}</span>
                    </b-form-group>
                </validation-provider>

                <validation-provider rules="required" v-slot="{ errors }">
                    <b-form-group label="DOB" :class="{ 'text-danger': errors[0] }" class="mb-3" label-for="dob">
                        <b-form-input id="dob" :class="{ 'border-danger': errors[0] }" v-model.trim="form.dob" type="date"
                            required></b-form-input>
                        <span class="text-danger">{{ errors[0] }}</span>
                    </b-form-group>
                </validation-provider>

                <validation-provider rules="required" v-slot="{ errors }">
                    <b-form-group label="Phone" :class="{ 'text-danger': errors[0] }" class="mb-3" label-for="phone">
                        <b-form-input id="phone" :class="{ 'border-danger': errors[0] }" v-model.trim="form.phone"
                            v-mask="'(###)-###-###'" required></b-form-input>
                        <span class="text-danger">{{ errors[0] }}</span>
                    </b-form-group>
                </validation-provider>

                <validation-provider rules="required|email|max:100" v-slot="{ errors }">
                    <b-form-group label="Email" :class="{ 'text-danger': errors[0] }" class="mb-3" label-for="email">
                        <b-form-input id="email" :class="{ 'border-danger': errors[0] }" v-model.trim="form.email"
                            required></b-form-input>
                        <span class="text-danger">{{ errors[0] }}</span>
                    </b-form-group>
                </validation-provider>

                <validation-provider rules="required|max:255|min:5" v-slot="{ errors }">
                    <b-form-group label="Address" :class="{ 'text-danger': errors[0] }" class="mb-3" label-for="address">
                        <b-form-input id="address" :class="{ 'border-danger': errors[0] }" v-model.trim="form.address"
                            required></b-form-input>
                        <span class="text-danger">{{ errors[0] }}</span>
                    </b-form-group>
                </validation-provider>

                <h5>PAYMENTS</h5>

                <b-form-group label="Transaction ID" class="mb-3" label-for="transaction_id">
                    <b-form-input id="transaction_id" v-mask="'### - ### - ### - ###'"
                        v-model.trim="newPayment.transaction_id"></b-form-input>
                </b-form-group>

                <b-form-group label="Amount" description="amount must be greater than or equal to 1" class="mb-3"
                    label-for="amount">
                    <money id="amount" class="form-control" v-bind="money" v-model.trim="newPayment.amount"
                        ref="moneyInput"></money>
                </b-form-group>

                <b-form-group label="Date" class="mb-3" label-for="date">
                    <b-form-input id="date" type="date" v-model.trim="newPayment.date"></b-form-input>
                </b-form-group>

                <div v-if="editJson" class="mb-3 d-flex justify-content-end gap-2">
                    <button type="button"
                        :disabled="Object.values(newPayment).some(value => value.length === 0) || newPayment.amount < 1"
                        @click="updateJson()" class="btn  btn-success">EDIT</button>
                    <button type="button" @click="cancelJson()" class="btn  btn-danger">CANCEL</button>
                </div>

                <div v-else class="mb-3 d-flex justify-content-end">
                    <button type="button"
                        :disabled="form.payments.length === 5 || Object.values(newPayment).some(value => value.length === 0) || newPayment.amount < 1"
                        @click="addPayment()" class="btn  btn-primary">ADD PAYMENT</button>
                </div>
                <div v-if="form.payments.length > 0" class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Transaction ID</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(payments, index) in form.payments" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ payments.transaction_id }}</td>
                                <td>
                                    $ {{ payments.amount.toFixed(2) }}
                                </td>
                                <td>{{ payments.date }}</td>
                                <td>
                                    <div class="btn-group" role="group" aria-label="Button group">
                                        <a class="btn btn-sm btn-success" @click="showPayments(index)" href="#">edit</a>
                                        <a class="btn btn-sm btn-danger" href="#" @click="deletePayments(index)">delete</a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <span class="text-danger d-block" v-else>Payment list must not be empty</span>
                <span class="text-danger d-block" v-if="form.payments.length > 5">The list of payments must not exceed 5
                    records</span>
            </form>


            <template #modal-footer="{ cancel }">
                <b-button size="sm" variant="danger" @click="cancel()">
                    Cancel
                </b-button>
                <b-button :disabled="invalid || form.payments.length === 0 || form.payments.length > 5"
                    @click="registerClients()" size="sm" variant="success">
                    save
                </b-button>
            </template>
        </b-modal>
    </ValidationObserver>
</template>
<script>


import axios from 'axios';
import Swal from 'sweetalert2';
import VueTheMask from 'vue-the-mask';
import { Money } from 'v-money';
import { extend, } from 'vee-validate';
import { required, alpha_spaces, min, max, email } from 'vee-validate/dist/rules';



extend('required', required);
extend('required', {
    ...required,
    message: 'This field is required'
});

extend('alpha_spaces', alpha_spaces);
extend('alpha_spaces', {
    ...alpha_spaces,
    message: 'The field may only contain alphabetic characters'
});

extend('min', min);
extend('min', {
    ...min,
    message: 'The field must be at least {length} characters'
});

extend('max', max);
extend('max', {
    ...max,
    message: `The field may not be greater than {length} characters`
});

extend('email', email);
extend('email', {
    ...email,
    message: 'The field must be a valid email'
});



export default {
    name: "modalCreate",
    data: function () {
        return {
            showModalCreate: true,
            form: {
                name: '',
                dob: '',
                phone: '',
                email: '',
                address: '',
                payments: []
            },

            newPayment: {
                transaction_id: "",
                amount: 0,
                date: ""
            },
            editJson: false,
            indiceJson: null,
            money: {
                decimal: '.',
                thousands: ',',
                prefix: '$ ',
                suffix: '',
                precision: 2,
                masked: false
            }
        }
    },
    methods: {
        addPayment() {
            this.form.payments.push({ ...this.newPayment })
            this.$set(this.newPayment, 'transaction_id', "")
            this.$set(this.newPayment, 'amount', 0)
            this.$set(this.newPayment, 'date', "")
        },
        showPayments(index) {
            this.editJson = true;
            const data = this.form.payments[index];
            this.indiceJson = index;
            this.$set(this.newPayment, 'transaction_id', data.transaction_id)
            this.$set(this.newPayment, 'amount', data.amount)
            this.$set(this.newPayment, 'date', data.date)
        },
        updateJson() {
            const object = this.form.payments[this.indiceJson];
            object.transaction_id = this.newPayment.transaction_id;
            object.amount = this.newPayment.amount;
            object.date = this.newPayment.date;

            this.$set(this.newPayment, 'transaction_id', "")
            this.$set(this.newPayment, 'amount', 0)
            this.$set(this.newPayment, 'date', "")

        },
        cancelJson() {
            this.editJson = false;
            this.$set(this.newPayment, 'transaction_id', "")
            this.$set(this.newPayment, 'amount', 0)
            this.$set(this.newPayment, 'date', "")
        },
        deletePayments(index) {
            this.form.payments.splice(index, 1);
        },
        async registerClients() {
            try {
                const { data } = await axios.post("http://127.0.0.1:8000/api/clien1ts/", this.form);

                this.$emit('close');
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Add Clients',
                    text: data.message,
                    toast: true,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

            } catch (error) {
                if (error.message === "Request failed with status code 422") {

                    const errors = error.response.data;
                    const messages = [];

                    for (let field in errors) {
                        const messagesfield = errors[field];

                        messages.push(...messagesfield);
                    }
                    const listMessages = messages.map(message => `<div>${message}</div>`);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Error',
                        html: `${listMessages.join('<br>')}`,
                        toast: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 5000,
                        timerProgressBar: true,
                    });
                    return;
                }
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
    },
    directives: {
        TheMask: VueTheMask.directive,
        money: Money
    },
}
</script>
<style scoped></style>