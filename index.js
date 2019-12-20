const HTMLParser = require('node-html-parser');
const fs = require('fs');
const path = require('path');
const listr = require('listr');
const axios = require('axios');

(async () => {
    const args = process.argv.slice(2);
    const tasks = [];

    let html = '';
    let courseName = '';

    if (args[0]) {
        try {
            const response = await axios.get(args[0]);
            html = response.data;
        } catch (e) {
            throw new Error(`Error with loading html from ${args[0]}: ${e.message}`);
        }
    } else {
        try {
            html = await fs.promises.readFile(path.resolve(__dirname, 'page.html'), 'utf8');
        } catch (e) {
            throw new Error(`Problem with index.html file: ${e.message}`);
        }
    }

    const root = HTMLParser.parse(html);

    const pageTitle = root.querySelector('title');
    courseName = pageTitle ? pageTitle.rawText : 'unnamed';

    const liVideos = root.querySelector('#lessons-list');
    for (let li of liVideos.childNodes) {
        if (li.tagName === 'li') {
            const videoName = li.querySelector('.lessons-name').rawText;
            for (let link of li.childNodes) {
                if (link.tagName === 'link' && link.rawAttrs.includes('itemprop="url"')) {
                    const url = link.rawAttrs.replace('href="', '').replace('" itemprop="url"', '');
                    tasks.push(generateDownloadTask(courseName, videoName, url));
                }
            }
        }
    }

    createFolderIfNotExists(path.resolve(__dirname, 'media'));
    createFolderIfNotExists(path.resolve(__dirname, `media/${courseName}`));

    new listr(tasks).run()
        .then(() => {
            console.log('Done!');
            process.exit(1);
        })
        .catch((e) => {
            console.error(`Error: ${e.message}`);
            process.exit(1);
        });

})();



const generateDownloadTask = (courseName, videoName, url) => {
    return {
        title: `Downloading ${videoName}...`,
        task: async (ctx, task) => {
            const streamPath = path.resolve(__dirname, `media/${courseName}`, `${videoName}.mp4`);
            console.log(streamPath);
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'stream'
            });

            response.data.pipe(fs.createWriteStream(streamPath));

            return new Promise((resolve, reject) => {
                response.data.on('end', () => {
                    resolve()
                });

                response.data.on('error', err => {
                    reject(err)
                });
            })
        }
    };
};

const createFolderIfNotExists = (path) => {
    if (!fs.existsSync(path)) {
        try {
            fs.mkdirSync(path);
        } catch (e) {
            throw e;
        }
    }
}
