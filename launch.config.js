module.exports = {
    ignore_watch: ['node_modules', 'pruebas', 'cmd', 'public', '.git', 'storage'],
    apps: [{
        name: "api",
        script: "./app.js",
        watch: true,
        env: {
            "NODE_ENV": "development",
            "PORT":3333
        },
        env_production: {
            "NODE_ENV": "production",
            "PORT":80
        }
    }]  
}