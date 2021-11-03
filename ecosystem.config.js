module.exports = {
  apps : [{
    name   : "bxt",
    script : "./index.js",
    instance_var: 'INSTANCE_ID',
    env: {
       NODE_ENV: "production"
    },
    watch : true,
    restart_delay: 5000
  }]
}
