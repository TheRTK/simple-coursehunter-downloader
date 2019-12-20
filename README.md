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
run `node index.js %link%`

eg: `node index.js https://coursehunter.net/course/angular-pro`

### Premium course

**You have to pay a paid subscription.**

- You need to open the page of the selected course
- Press **Ctrl+U** and copy the source HTML code of the page
- Create `page.html` file at the root of the project 
- Paste the source code into `page.html` 
- run `node index.js`

### FAQ
**Q: Can I download paid courses for free?**
>No.

**Q: Where are the downloaded files?**
>simple-coursehunter-downloader/media/%course_name%/

**Q: Your code is terrible, what's wrong with you?!**
>I wrote this script in 20 minutes for personal use. 
If you want to rewrite it - good luck.
