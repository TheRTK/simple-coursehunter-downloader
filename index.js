const App = require('./app');
const FS = require('fs');
const Path = require('path');
const Glob = require('glob').Glob;

const MEDIA_FOLDER = Path.resolve(__dirname, 'media');
const HTML_FOLDER = Path.resolve(__dirname, 'html');

// Helper
const GlobPromise = async (pattern) => {
    return new Promise(((resolve, reject) => {
        new Glob(pattern, {}, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        })
    }));
};

(async () => {
    const args = process.argv.slice(2);
    const app = new App(MEDIA_FOLDER);

    if (args.length > 0) {
        try {
            for (let url of args) {
                const html = await app.parser.getHtmlByUrl(url);
                const courseDataArr = await app.parser.parseCourseData(html);
                for (let courseData of courseDataArr) {
                    app.generateNewTask(courseData);
                }
            }
        } catch (e) {
            throw e;
        }
    } else {
        try {
            const htmlFiles = await GlobPromise(HTML_FOLDER + '/*.html');
            for (let file of htmlFiles) {
                const html = await FS.promises.readFile(file, 'utf8');
                const courseDataArr = await app.parser.parseCourseData(html);
                for (let courseData of courseDataArr) {
                    app.generateNewTask(courseData);
                }
                try {
                    await FS.promises.unlink(file);
                } catch (e) {}
            }
        } catch (e) {
            throw new Error(`Problem with loading from ${HTML_FOLDER}: ${e.message}`);
        }
    }

    const tasksCount = app.tasks.length;
    if (tasksCount === 0) {
        console.log('Error: 0 tasks loaded!');
    } else {
        console.log(`Start ${tasksCount} tasks:`);
        app.runTasks();
    }
})();
