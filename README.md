## WCA ScoreCards

WCA online tool for creating monthly ScoreCards reports
[WCA ScoreCards](https://xdesk.ifad.org/sites/pa/tools/scorecards/index.aspx)

### Install
```
1- git clone https://github.com/supertrip86/scorecards
2- npm install
3- npm run start
```

### Usage
```
This web application ONLY leverages SharePoint lists and libraries in its own site collection via REST API.

For development and testing outside SharePoint: 

- in /src/index.js, comment out SP variables 
- in /src/index.js, uncomment all links to /dist/api

To produce bundle js and css files:
```
npm run bundle
```

To produce production js and css files (bundled and minified)
```
npm run compress
```
