import { spawn } from 'child_process';
import puppeteer from 'puppeteer-core';
import { startFlow } from 'lighthouse'; 
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function auditElectronApp() {
  const DEBUG_PORT = 9222;

  const electronPath = join(__dirname, '..', 'node_modules', 'electron', 'dist', 'electron.exe');
  const mainScript = join(__dirname, '..', 'main.js');
  
  console.log('Launching Electron application...');
  const electronProcess = spawn(electronPath, [mainScript, `--remote-debugging-port=${DEBUG_PORT}`], {
    stdio: 'inherit'
  });

  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    console.log('Connecting Puppeteer to Electron via DevTools port...');
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${DEBUG_PORT}`,
      defaultViewport: null
    });

    const pages = await browser.pages();
    const mainPage = pages[0];

    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`Detected Electron Application URL: ${mainPage.url()}`);
    console.log('Initializing Lighthouse Snapshot Flow...');

    const flow = await startFlow(mainPage, {
      name: 'Electron App Audit',
      configContext: {
        settings: {
          preset: 'desktop',
          screenEmulation: { disabled: true },
          formFactor: 'desktop'
        }
      }
    });

    console.log('Capturing screen snapshot audit...');
    await flow.snapshot({ stepName: 'Electron Live View' });

    console.log('Generating Lighthouse report...');
    
    const reportHtml = await flow.generateReport();
    
    const flowResult = await flow.createFlowResult();
    const perfScore = flowResult.steps[0].lhr.categories.performance?.score;
    const scoreText = perfScore !== undefined ? `${perfScore * 100}` : 'N/A';
    
    console.log(`✅ Audit completed! Performance Score: ${scoreText}`);

    fs.writeFileSync(join(__dirname, 'lighthouse-report.html'), reportHtml);
    console.log('Report saved to ./lighthouse/lighthouse-report.html');

    await browser.disconnect();
    electronProcess.kill();

  } catch (error) {
    console.error('❌ Error during audit execution:', error);
    electronProcess.kill();
    process.exit(1);
  }
}

auditElectronApp();
