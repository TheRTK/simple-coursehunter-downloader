## Description
This is a simple script for downloading video from the coursehunter.net

## Installation

```
git clone https://github.com/TheRTK/simple-coursehunter-downloader
cd simple-coursehunter-downloader
npm install
```

## How use

### Free course
Run `node index.js %link%`

e.g. `node index.js https://coursehunter.net/course/angular-pro`

### Premium course

**You have to pay a paid subscription.**

- You need to open the page of the selected course.
- Press **Ctrl+U** and copy the source HTML code of the page.
- Create folder `html` at the root of the project.
- Create file `*.html` in `html` folder and paste the source code of page.
- Run `node index.js`


### FAQ
**Q: Can I download paid courses for free?**
>No.

**Q: Can I download several courses at a time?**
> Yes. You can create several html files or specify several arguments.
>
>> e.g. `node index.js https://coursehunter.net/course/angular-pro https://coursehunter.net/course/nedelya-oop-tretiy-potok`

**Q: Where are the downloaded files?**
> Default location: .../simple-coursehunter-downloader/media/%course_name%/

**Q: Can I save courses to another folder?**
>Yes. Need to change `MEDIA_FOLDER` in the [index.js](https://github.com/TheRTK/simple-coursehunter-downloader/blob/master/index.js#L6)

**Q: Can I load  html files from another folder?**
>Yes. Need to change `HTML_FOLDER` in the [index.js](https://github.com/TheRTK/simple-coursehunter-downloader/blob/master/index.js#L7)
