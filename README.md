This cloudflare worker creates an API to process data submitted through a form on the contact page of
davelongwebstudio.com.

## Background - Serverless Hosting & Cloudflare Worker Info

The site davelongwebstudio.com is hosted on Vercel's serverless platform and as such does not have a traditional back
end. In order to add form processing to the site, I chose to use Cloudflare workers. Cloudflare workers is an execution
environment that runs on Cloudflare's edge network.

This cloudflare worker is an es module worker written in JavaScript. It receives the form data sent from the site, saves the data to
Cloudflare's KV database, and sends an email to davelongdev@gmail.com with the form submission data. It was created
using the cloudflare wrangler command line interface (CLI).

## Index.js

The main entry point to this worker is index.js in the /src directory. It includes one default export module that
responds to http requests within the cloudflare runtime environment.

The module contains one main fetch function that calls two functions - optionsHandler and postHandler, which handle
options and post requests.

The optionsHandler function returns a response object containing a global headers object and a 200 http response status
code.

The postHandler function saves the form submission data to cloudflare's KV database and sends an email to me at
davelongdev@gmail.com containing the form submission data.

The worker also makes use of a wrangler.toml file which is not provided in this repo. It contains some configurations and
settings for the worker.

## Documentation / JSDoc

Documentation for this worker is provided using the JSDoc style and library.

The documentation can be viewed [here](https://cloudflare-worker-contact-form-docs.vercel.app/).

To view the documentation as a website hosted locally, you can follow these steps:
- clone the repo
- start a python web server
- navigate to the /jsdoc directory

Alternatively, you can use any web server that you like.

The directory /jsdoc contains all the jsdoc webpage files.

The directory /jsdoc/custom-template contains modified jsdoc template files (css styles, etc.).

jsdoc.json is the config file for jsdoc.

## Useful CLI Commands

**To update the jsdoc webpage using the jsdoc npm script**

- npm run jsdoc

**Start python web server (on localhost:8000)**

- python -m http.server - starts a python web server to view JSDoc documentation
- can use alias 'pys' if you have it set up.

**Wrangler commands**

- npx wrangler deploy

	- deploy changes to project to the Cloudflare Network

- npx wrangler dev --remote

	- run wrangler dev server w/ hosted Cloudflare libraries (useful for development)

### Other Files in the Repository

http-testing/ contains code for testing the api from a web page
