const { playwrightLauncher } = require('@web/test-runner-playwright');

module.exports = {
    concurrency: 1,
    coverage: true,
    coverageConfig: {
        report: true,
        reportDir: 'coverage',
        exclude: [
            'packages/*/stories/*',
            'packages/icons-ui/*',
            'packages/icons-workflow/*',
        ],
        threshold: {
            statements: 97,
            branches: 92,
            functions: 97,
            lines: 97,
        },
    },
    testRunnerHtml: (testRunnerImport) => `
        <html>
        <head></head>
        <body>
            <script type="module">
            import '${testRunnerImport}';
            window.process = window.process || {};
            window.process.env = window.process.env || {};
            window.process.env.NODE_ENV = window.process.env.NODE_ENV || 'production';
            </script>
        </body>
        </html>
    `,
    // browsers: [
    //     playwrightLauncher({product: 'chromium'}),
    //     playwrightLauncher({
    //         product: 'firefox',
    //         launchOptions: {
    //             headless: false,
    //             args: ['-headless'],
    //             firefoxUserPrefs: {
    //                 'toolkit.telemetry.reportingpolicy.firstRun': false,
    //                 'browser.shell.checkDefaultBrowser': false,
    //                 'browser.bookmarks.restore_default_bookmarks': false,
    //                 'dom.disable_open_during_load': false,
    //                 'dom.max_script_run_time': 0,
    //                 'dom.min_background_timeout_value': 10,
    //                 'extensions.autoDisableScopes': 0,
    //                 // 'browser.tabs.remote.autostart': false,
    //                 // 'browser.tabs.remote.autostart.2': false,
    //                 'extensions.enabledScopes': 15,
    //             }
    //         }
    //     }),
    // ]
};
