const Axios = require('axios');
const Parser = require('./parser');
const Listr = require('listr');
const FS = require('fs');

// Just helper
const createFolderIfNotExists = (path) => {
    if (!FS.existsSync(path)) {
        try {
            FS.mkdirSync(path);
        } catch (e) {
            throw e;
        }
    }
};

class App {
    constructor(mediaPath) {
        this.mediaPath = mediaPath;
        this.tasks = [];
        this.parser = new Parser(Axios);

        createFolderIfNotExists(this.mediaPath);
    }

    runTasks() {
        new Listr(this.tasks).run()
            .then(() => {
                console.log('Done!');
                process.exit(1);
            })
            .catch((e) => {
                console.error(`Error: ${e.message}`);
                process.exit(1);
            });
    }

    generateNewTask(taskData) {
        const coursePath = this.mediaPath + `/${taskData.courseName}`;
        const streamPath = coursePath + `/${taskData.videoName}.mp4`;

        createFolderIfNotExists(coursePath);

        this.tasks.push({
            title: `Downloading ${streamPath}...`,
            task: async (ctx, task) => {
                const response = await Axios({
                    method: 'GET',
                    url: taskData.url,
                    responseType: 'stream'
                });

                response.data.pipe(FS.createWriteStream(streamPath));

                return new Promise((resolve, reject) => {
                    response.data.on('end', () => resolve());
                    response.data.on('error', err => reject(err));
                })
            }
        });
    }

}

module.exports = App;
