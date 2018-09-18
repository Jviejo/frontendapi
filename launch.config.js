module.exports = {
    ignore_watch: ['node_modules', 'pruebas', 'cmd', 'public', '.git', 'storage'],
    apps: [{
        name: "worker",
        script: "./app.js",
        watch: true,
        env: {
            "NODE_ENV": "development",
        },
        env_production: {
            "NODE_ENV": "production"
        }
    }]  
}