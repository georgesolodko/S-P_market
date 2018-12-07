<template>
  <v-tabs
    v-model="active"
    color="cyan"
    dark
    slider-color="yellow"
  >

    <v-tab>Register</v-tab>
    <v-tab>Login</v-tab>

    <v-tab-item>
      <v-form ref="register" v-model="valid" class="form-auth" lazy-validation>
        <v-text-field
          v-model="passwordRegister"
          :type="'password'"
          :rules="passwordRules"
          counter
          label="Password"
          required
        ></v-text-field>
        <v-text-field
          v-model="emailRegister"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-checkbox
          v-model="checkbox"
          :rules="[v => !!v || 'You must agree to continue!']"
          label="Do you agree?"
          required
        ></v-checkbox>

        <v-btn
          :disabled="!valid"
          @click="submitRegister"
        >
          submit
        </v-btn>
        <v-btn @click="clearRegister">clear</v-btn>
      </v-form>
    </v-tab-item>


    <v-tab-item>
      <v-form class="form-auth" ref="login">
        <v-text-field
          v-model="passwordLogin"
          :type="'password'"
          counter
          label="Password"
          required
        ></v-text-field>
        <v-text-field
          v-model="emailLogin"
          label="E-mail"
          required
        ></v-text-field>

        <v-btn
          @click="submitLogin"
        >
          submit
        </v-btn>
        <v-btn @click="clearLogin">clear</v-btn>
      </v-form>
    </v-tab-item>
  </v-tabs>
</template>

<script>
  import firebase from 'firebase/app'

  export default {
    name: "Auth",
    data: () => ({
      valid: true,
      passwordRegister: '',
      passwordLogin: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be more than 6 characters'
      ],
      emailRegister: '',
      emailLogin: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      checkbox: false,
      active: null
    }),
    methods: {
      async submitRegister() {
        if (this.$refs.register.validate()) {
          try {
            const registration = await firebase.auth().createUserWithEmailAndPassword(this.emailRegister, this.passwordRegister);
            this.$emit('registration', registration.user.uid);
          } catch (e) {
            console.log(e.message);
            throw e
          }
        }
      },
      clearRegister() {
        this.$refs.register.reset()
      },
      async submitLogin() {
        const login = await firebase.auth().signInWithEmailAndPassword(this.emailLogin, this.passwordLogin);
        this.$emit('registration', login.user.uid);
      },
      clearLogin() {
        this.$refs.login.reset()
      }
    },
  }
</script>

<style scoped>

</style>
