<template>
  <div class="hello"></div>
  <div>{{ displayName }}</div>
  <img :src="imgURL" />

  <button v-on:click="getCurrentTrack">get current track</button>
  <div>listening to: {{ currentTrack }}</div>
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
      key: "",
      displayName: "",
      imgURL: "",
      currentTrack: "",
    };
  },
  created() {
    if (localStorage.getItem("key") == null) {
      axios.post("http://localhost:5000/user/join").then((data) => {
        console.log(data);
        localStorage.setItem("key", data.data.key);
        window.location.href = unescape(data.data.uri);
      });
    }

    if (localStorage.getItem("key") != null) {
      axios
        .get("http://localhost:5000/spotify/me", {
          headers: { "spotify-key": localStorage.getItem("key") },
        })
        .then((data) => {
          console.log(data);
          this.displayName = data.data.display_name;
          this.imgURL = data.data.img_url;
        });
    }
  },
  beforeMount() {
    let urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get("code")); // "MyParam"
    const code = urlParams.get("code");

    if (code != null) {
      axios.get(
        `http://localhost:5000/callback?code=${code}&key=${localStorage.getItem(
          "key"
        )}`
      );
    }
  },
  methods: {
    getCurrentTrack() {
      axios
        .get(`http://localhost:5000/spotify/current`, {
          headers: { "spotify-key": localStorage.getItem("key") },
        })
        .then((data) => {
          console.log(data);
        });
    },
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
