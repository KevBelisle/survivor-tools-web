import { ReactPlugin } from '@microsoft/applicationinsights-react-js'
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { createBrowserHistory } from 'history'

const browserHistory = createBrowserHistory({ basename: '' })
const reactPlugin = new ReactPlugin()
const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      'InstrumentationKey=a64f6b2b-e54f-4aab-b747-4e317ca6f125;IngestionEndpoint=https://canadacentral-0.in.applicationinsights.azure.com/',
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory },
    },
    autoTrackPageVisitTime: true,
    disableFetchTracking: false,
    enableAutoRouteTracking: true,
    enableAjaxErrorStatusText: true,
    enableUnhandledPromiseRejectionTracking: true,
  },
})
appInsights.loadAppInsights()

export { reactPlugin, appInsights }
