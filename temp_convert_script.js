
        const puppeteer = require('puppeteer');

        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('file://C:\Users\Rororizzz\Desktop\Travail\cesizenDebug\cesizen\diagrammes_sequence_high_res.html', {
                waitUntil: 'networkidle0'
            });
            await page.pdf({
                path: 'diagrammes_sequence_high_res.pdf',
                format: 'A4',
                printBackground: true,
                margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
            });
            await browser.close();
            console.log('PDF généré avec succès!');
        })();
        