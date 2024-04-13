const axios = require('axios');
const fs = require('fs');

async function sendXMLAndGetPDF() {
  try {
    // Prepare the XML data
    const xmlData = fs.readFileSync('cv.xml', 'utf-8');

    // Set up the HTTP request headers
    const config = {
      headers: {
        'Content-Type': 'text/plain'
      },
      responseType: 'arraybuffer' // Important for handling binary data
    };

    // POST the XML data
    const response = await axios.post('https://webservicesp.anaf.ro/prod/FCTEL/rest/transformare/FACT1', xmlData, config);

    // Write the PDF file received in response
    fs.writeFileSync('output.pdf', response.data);

    console.log('PDF file has been saved.');
  } catch (error) {
    console.error('Error during API call:', error.message);
  }
}

sendXMLAndGetPDF();
