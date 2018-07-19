/**
*  This file defines all the collections, publications and methods that the application provides
*  as an API to the client.
**/
// Define all collections: (IN API-CLIENT.JS)
import "./api-client.js";

// Publish all collections:
import "./collections/activityDescription/server/publications.js"
import "./collections/feedbackAnswer/server/publications.js"
import "./collections/feedbackQuestion/server/publications.js"
import "./collections/studyChain/server/publications.js"
import "./collections/studySession/server/publications.js"
import "./collections/summary/server/publications.js"
import "./collections/keyword/server/publications.js"

// Define all collection-specific methods:
import "./collections/activityDescription/methods.js"
import "./collections/feedbackAnswer/methods.js"
import "./collections/feedbackQuestion/methods.js"
import "./collections/studyChain/methods.js"
import "./collections/studySession/methods.js"
import "./collections/summary/methods.js"
import "./collections/keyword/methods.js"
