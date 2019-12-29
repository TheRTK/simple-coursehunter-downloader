const HTMLParser = require('node-html-parser');

class Parser {

    constructor(axios) {
        this.axios = axios;
    }

    async getHtmlByUrl(url) {
        const response = await this.axios.get(url);
        return response.data;
    }

    async parseCourseData(html) {
        const root = HTMLParser.parse(html);

        const pageTitle = root.querySelector('title');
        const courseName = pageTitle ? pageTitle.rawText.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') : 'unnamed';
        const data = [];

        const liVideos = root.querySelector('#lessons-list');

        if (!liVideos)
            return data;

        let counter = 1;
        for (let li of liVideos.childNodes) {
            if (li.tagName === 'li') {
                const videoName = li.querySelector('.lessons-name').rawText.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

                if (!li.childNodes)
                    continue;

                for (let link of li.childNodes) {
                    if (link.tagName === 'link' && link.rawAttrs.includes('itemprop="url"')) {
                        const url = link.rawAttrs.replace('href="', '').replace('" itemprop="url"', '');
                        data.push({
                            courseName,
                            videoName: `${counter++}. ${videoName}`,
                            url
                        });
                    }
                }
            }
        }
        return data;
    }
}

module.exports = Parser;
