module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    emulatedFormFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    screenEmulation: {
      mobile: false,
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      disabled: false
    }
  },
  audits: [
    'first-meaningful-paint',
    'first-contentful-paint',
    'speed-index',
    'largest-contentful-paint',
    'interactive',
    'total-blocking-time',
    'cumulative-layout-shift'
  ],
  categories: {
    performance: {
      weight: 1
    },
    accessibility: {
      weight: 1
    },
    'best-practices': {
      weight: 1
    },
    seo: {
      weight: 1
    }
  }
};
