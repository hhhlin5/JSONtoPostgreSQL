
/* 
  Import modules/files you may need to correctly run the script. 
  Make sure to save your DB's uri in the config file, then import it using `import` statements so that we can ensure we are using ES6 modules 
 */
  import { Sequelize, Model, DataTypes,  QueryTypes, sql } from '@sequelize/core';
  
  //imports dontenv module and allows us to access stored environment variables stored in .env file - See https://www.npmjs.com/package/dotenv
  import 'dotenv/config';

  //Import file system - Examples of how to use the file system module - fs - https://www.scaler.com/topics/nodejs/fs-module-in-node-js/
  import * as fs from 'fs';

  //imports the Listing Model we created in ListingModels.js
  import { Listing } from './ListingModel.js';
  // import ListingModel from './ListingModel.js'; // Import the default export
  // const Listing = ListingModel; // Rename the default export to Listing

/* Connect to your database 
  See: Sequalize Getting Started - Connecting to a database by passing a URI - Read: https://sequelize.org/docs/v6/getting-started/#connecting-to-a-database
  Copy URI/URL string from ElephantSQL - under details. 
  Security Best Practice: Don't use the URL/URI string (postgres://username:password@hostname/databasename) directly in applciation code. Store the database URL as the API_URL environment variable within the .env file. 
  BAD Implementation - const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres
  Good Implementation - const sequelize = new Sequelize(process.env.API_URL);
  Read - artilce to learn more about environment variables - https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
*/
//ADD CODE HERE to connect to you database
const sequelize = new Sequelize(process.env.API_URL);

//Testing that the .env file is working - This should print out the port number
console.log(process.env.PORT); //Should print out 8080 
console.log(process.env.API_Key); //Should print out "Key Not set - starter code only"

 try {
  //Setup table in the DB
  //Read more about Model Synchronization - https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
  await Listing.sync({ force: true });
  console.log("The table for the Listing model was just (re)created!");
  
  /* This callback function read the listings.json file into memory (data) and stores errors in (err).
      Write code to save the data into the listingData variable and then save each entry into the database.
   */
  fs.readFile('listings.json', 'utf8', async function(err, data) {
    // Errors-Check out this resource for an idea of the general format err objects and Throwing an existing object.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw#throwing_an_existing_object
    if (err) throw err;
    console.log(data);

    //Save and parse the data from the listings.json file into a variable, so that we can iterate through each instance - Similar to Bootcamp#1
   //ADD CODE HERE
   const jsonData = JSON.parse(data);
  
     //Use Sequelize create a new row in our database for each entry in our listings.json file using the Listing model we created in ListingModel.js
    // to https://sequelize.org/docs/v6/core-concepts/model-instances/#creating-an-instance
     //ADD CODE HERE

     if (!Array.isArray(jsonData.entries)) {
      console.error('The "entries" property is not an array.');
      return;
    }
    const listingData = jsonData.entries;

     // Iterate through the array and create a new row in the database for each entry
    for (const listing of listingData) {
      try {
        const newListing = await Listing.create({
          code: listing.code,
          name: listing.name,
          coordinates: listing.coordinates,
          address: listing.address,
        });

        console.log(`Created a new row for: ${listing.name}`);
      } catch (error) {
        console.error(`Error creating a row for: ${listing.name}`, error);
      }
    }
    console.log('All entries have been created in the database.');

    });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}


 /* 
  Once you've written + run the script, check out your ElephantSQL database to ensure that it saved everything correctly. 
 */

 