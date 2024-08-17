
//--------------------------
// WORKER - web-studo
//--------------------------

// import modules for sending emails from worker
import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

/**
 * @file index.js contains the cloudflare worker source code for processing
 * contact page form submissions.
 * @author davelong <davelongdev@gmail.com>
 * @see <a href="https://davelongwebstudio.com">davelongwebstudio</a>
 */

/**
 * Create global constant for headers
 * @constant {object} headers
 * @default
 */
const headers = new Headers({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': '*'
});

/**
 * Handle OPTIONS requests
 * @returns {Response} - The response object
 */
async function optionsHandler() {

  // Return response object
  return new Response(null, {
			headers: headers,
			status: 200
		});
}

/**
 * Handle POST requests
 * @param {Request} request	- The request object
 * @param {Object} env - The env parameter contains the bindings assigned
 * to the worker.  Bindings are used for interacting with the cloudflare KV database
 * and sending email.
 * @returns {Response} - The response object
 */
async function postHandler(request, env) {

  // Get the request body as form data object
  const fd_obj = await request.formData();

	// serialize fd_obj into js object
	const fd_jsobj = Object.fromEntries(fd_obj)

	// create form_data variable containing the data from the form submission
	const form_data = {
			first_name: fd_jsobj.first_name,
			last_name: fd_jsobj.last_name,
			email: fd_jsobj.email,
			message: fd_jsobj.message,
	};

	// if form submission wasn't saved, return 404 error
	if (form_data === null) {
			return new Response('Something went wrong. Your form submission has not been processed', {
					status: 404,
					headers: headers
			});
	}

	// save form_data variable to database with unique key of email + Date.now string
	await env.CONTACTS.put(`${fd_jsobj.email}_${Date.now()}`, JSON.stringify(fd_jsobj));

	// call sendEmail function
	await sendEmail(form_data, env)

	// if form submission saved and email sent,
	// return the form submission data and success message
	return new Response(JSON.stringify({
		message: 'form submission data successfully processed',
		form_data
		}),
		{
			status: 200,
			headers: headers
	});
}

/**
 * Send email
 * @param {Object} form_data - Data from the form submission
 * @param {Object} env - The env parameter contains the bindings assigned
 * to the worker.  Bindings are used for interacting with the cloudflare KV database
 * and sending email.
 * @returns {Response} - The response object
 */
async function sendEmail(form_data, env) {

	// stringify form_data object
	const fdata = JSON.stringify(form_data, null, 2)

	// create message content using imported func createMimeMessage
	const msg = createMimeMessage();
	msg.setSender({ name: "Dave", addr: "dave@davelongwebstudio.com" });
	msg.setRecipient("dave@davelongwebstudio.com");
	msg.setSubject("Form Submission");
	msg.addMessage({
		 contentType: 'text/plain',
		 data: fdata
	});

	// create new message
	const message = new EmailMessage(
	 "dave@davelongwebstudio.com",
	 "davelongdev@gmail.com",
	 msg.asRaw()
	);

	// send email
	try {
	 await env.EMAIL.send(message);
	} catch (e) {
	 return new Response(e.message);
	}
}
/**
 * The main worker module for handling calls to the
 * cloudflare worker api.
 * @module
 * @returns {Response} The response object
 */
export default {

/**
 * Respond to http requests from davelongwebstudio.com
 * @param {Request} request			The request object
 * @param {Object} env - The env parameter contains the bindings assigned
 * to the worker.  Bindings are used for interacting with the cloudflare KV database
 * and sending email.
 */
  async fetch(request, env) {

		// handle options requests
		if (request.method === "OPTIONS") {
				return await optionsHandler(request);
			};

		// handle post requests
		if (request.method === "POST") {
				return await postHandler(request, env);
			}
		}
};
