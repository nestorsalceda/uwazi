const COUCHDBURL = process.env.COUCHDB_URL;
export default {
  demo: 'http://127.0.0.1:5984/uwazi_demo',
  development: COUCHDBURL ? `${COUCHDBURL}/uwazi_development` : 'http://127.0.0.1:5984/uwazi_development',
  testing: COUCHDBURL ? `${COUCHDBURL}/uwazi_testing` : 'http://127.0.0.1:5984/uwazi_testing',
  production: 'http://127.0.0.1:5984/uwazi'
};
