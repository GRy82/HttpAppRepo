import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

function init(){
    Sentry.init({
        dsn: "https://dbbb6194e3b6443e9b3320808a8fb47d@o950876.ingest.sentry.io/5899522",
        integrations: [new Integrations.BrowserTracing()],
    
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}

export default {
    init
};