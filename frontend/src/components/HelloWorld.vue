<template>
  <div class="hello"></div>
  <div>{{ userName }}</div>
  <div>{{ users }}</div>
</template>

<script>
import axios from "axios";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      userName: "",
      users: [],
    };
  },
  created() {
    axios.post("http://localhost:5000/user").then((data) => {
      this.userName = data.data.user;
    });

    axios.get("http://localhost:5000/user").then((data) => {
      this.users = data.data.users;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
