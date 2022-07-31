# Comic repo
All pages, code, video, etc. for the comic will go here.

Main comic page will be done with `index.html`, `main.css`, as well as any media stuff in `_assets`. Eventually, we may need to move `_assets` to some offshore host such as Amazon S3 (it has good pricing for our usecase), as github pages may not like it being over a gigabyte. Each volume of comic will get its own folder in `_assets`. The CACHE file in `_assets` describes each volume's number of pages and metadata.

The URL `friendteam.biz/comics` will be a landing page for all the comics, listed with a published date, title, and some basic credits (written by Apex, drawn by Percy, etc.). This info is pulled from the CACHE file.

The URI will look something like this `https://friendteam.biz/comics?volume=main1&page=512&part=2`. Volumes are what specific comic this is, the string being arbitrary. The page number is the page itself of the specified comic. Part refers to what part of the comic page is shown (think of TF2 comics and its dynamic paneling).
