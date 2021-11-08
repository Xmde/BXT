module.exports = {
  apps: [
    {
      name: 'bxt_beta',
      script: './prod/index.js',
      instance_var: 'INSTANCE_ID',
      watch: true,
      restart_delay: 5000,
      log_date_format: 'YYYY-MM-DDTHH:mm:ss',
    },
  ],
};
