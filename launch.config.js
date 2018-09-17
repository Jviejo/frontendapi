module.exports = {
    frontend: [
        {
            name: "frontend",
            script: "./app.js",
            node_args: [
                "--inspect=9999"
            ],
            ignore_watch: ['node_modules', 'pruebas', 'cmd', 'public', '.git', 'storage'],
            watch: true
        }
    ]
}