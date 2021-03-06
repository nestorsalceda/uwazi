import documentsAPI from '../DocumentsAPI';
import {APIURL} from 'app/config.js';
import backend from 'fetch-mock';

describe('DocumentsAPI', () => {
  let arrayResponse = [{documents: 'array'}];
  let searchResponse = [{documents: 'search'}];
  let filteredSearchResult = [{documents: 'Alfred'}];
  let singleResponse = [{documents: 'single'}];
  let listResponse = [{documents: 'list'}];

  beforeEach(() => {
    backend.restore();
    backend
    .mock(APIURL + 'documents', 'GET', {body: JSON.stringify({rows: arrayResponse})})
    .mock(APIURL + 'documents/search', 'GET', {body: JSON.stringify(searchResponse)})
    .mock(APIURL + 'documents/list?keys=%5B%221%22%2C%222%22%5D', 'GET', {body: JSON.stringify({rows: listResponse})})
    .mock(APIURL + 'documents/uploads', 'GET', {body: JSON.stringify({rows: 'uploads'})})
    .mock(APIURL + 'documents/count_by_template?templateId=templateId', 'GET', {body: JSON.stringify(1)})
    .mock(APIURL + 'documents/match_title?searchTerm=term', 'GET', {body: JSON.stringify(searchResponse)})
    .mock(APIURL + 'documents/search?searchTerm=Batman&joker=true', 'GET', {body: JSON.stringify(filteredSearchResult)})
    .mock(APIURL + 'documents?_id=documentId', 'GET', {body: JSON.stringify({rows: singleResponse})})
    .mock(APIURL + 'documents?_id=id', 'DELETE', {body: JSON.stringify({backednResponse: 'testdelete'})})
    .mock(APIURL + 'documents', 'POST', {body: JSON.stringify({backednResponse: 'test'})});
  });

  describe('uploads', () => {
    it('should request uploads', (done) => {
      documentsAPI.uploads()
      .then((response) => {
        expect(response).toEqual('uploads');
        done();
      })
      .catch(done.fail);
    });
  });

  describe('get()', () => {
    it('should request documents', (done) => {
      documentsAPI.get()
      .then((response) => {
        expect(response).toEqual(arrayResponse);
        done();
      })
      .catch(done.fail);
    });

    describe('when passing an id', () => {
      it('should request for the thesauri', (done) => {
        documentsAPI.get('documentId')
        .then((response) => {
          expect(response).toEqual(singleResponse);
          done();
        })
        .catch(done.fail);
      });
    });
  });

  describe('list()', () => {
    it('should request documents list', (done) => {
      documentsAPI.list(['1', '2'])
      .then((response) => {
        expect(response).toEqual(listResponse);
        done();
      })
      .catch(done.fail);
    });
  });

  describe('getSuggestions()', () => {
    it('should match_title ', (done) => {
      documentsAPI.getSuggestions('term')
      .then((response) => {
        expect(response).toEqual(searchResponse);
        done();
      })
      .catch(done.fail);
    });
  });

  describe('countByTemplate()', () => {
    it('should count_by_template', (done) => {
      documentsAPI.countByTemplate('templateId')
      .then((response) => {
        expect(response).toEqual(1);
        done();
      })
      .catch(done.fail);
    });
  });

  describe('search()', () => {
    it('should search documents', (done) => {
      documentsAPI.search()
      .then((response) => {
        expect(response).toEqual(searchResponse);
        done();
      })
      .catch(done.fail);
    });

    describe('when passing filters', () => {
      it('should search for it', (done) => {
        documentsAPI.search({searchTerm: 'Batman', joker: true})
        .then((response) => {
          expect(response).toEqual(filteredSearchResult);
          done();
        })
        .catch(done.fail);
      });
    });
  });

  describe('save()', () => {
    it('should post the document data to /documents', (done) => {
      let data = {name: 'document name'};
      documentsAPI.save(data)
      .then((response) => {
        expect(JSON.parse(backend.lastOptions(APIURL + 'documents').body)).toEqual(data);
        expect(response).toEqual({backednResponse: 'test'});
        done();
      })
      .catch(done.fail);
    });
  });

  describe('delete()', () => {
    it('should delete the document', (done) => {
      let document = {_id: 'id'};
      documentsAPI.delete(document)
      .then((response) => {
        expect(response).toEqual({backednResponse: 'testdelete'});
        done();
      })
      .catch(done.fail);
    });
  });
});
