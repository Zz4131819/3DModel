<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/vr">About</router-link>
  </nav>
  <div class="box">
    <router-view/>
  </div>
</template>
<style>

nav {
  position: absolute;
  top: 20px;
  right: 100px;
  display: flex;
  padding: 30px;
  width: 150px;
  height: 50px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.box {
  width: 100%;
  height: 100%;
}
</style>