import axios from 'axios';
import HttpClient from './HttpClient';

jest.mock('axios');

describe('HttpClient', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /', () => {
    describe('promise resolved', () => {
      beforeEach(() => {
        axios.get.mockReturnValue(
          Promise.resolve({
            status: 200,
            data: { key: 'val' },
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      it('should return the body without headers', async () => {
        const res = await HttpClient.get('/url', true);

        expect(res).toEqual({ key: 'val' });
      });

      it('should return the body with headers', async () => {
        const res = await HttpClient.get('/url', false);

        expect(res).toEqual({
          body: { key: 'val' },
          headers: { 'Content-Type': 'application/json' },
        });
      });
    });

    describe('promise rejected', () => {
      beforeEach(() => {
        axios.get.mockImplementation(() => Promise.reject(new Error('message')));
      });

      it('should catch error', async () => {
        let actualError;
        try {
          await HttpClient.get('/url', true);
        } catch (er) {
          actualError = er;
        }
        expect(actualError.message).toEqual('message');
      });
    });
  });

  describe('POST /', () => {
    describe('promise resolved', () => {
      beforeEach(() => {
        axios.post.mockReturnValue(
          Promise.resolve({
            status: 200,
            data: { key: 'val' },
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      it('should return the body without headers', async () => {
        const res = await HttpClient.post('/url', { key: 'val' }, true);
        expect(res).toEqual({ key: 'val' });
      });

      it('should return the body with headers', async () => {
        const res = await HttpClient.post('/url', { key: 'val' }, false);
        expect(res).toEqual({
          body: { key: 'val' },
          headers: { 'Content-Type': 'application/json' },
        });
      });
    });

    describe('promise rejected', () => {
      beforeEach(() => {
        axios.post.mockImplementation(() => Promise.reject(new Error('message')));
      });

      it('should catch error', async () => {
        let actualError;
        try {
          await HttpClient.post('/url', true);
        } catch (er) {
          actualError = er;
        }
        expect(actualError.message).toEqual('message');
      });
    });
  });

  describe('PUT /', () => {
    describe('promise resolved', () => {
      beforeEach(() => {
        axios.put.mockReturnValue(
          Promise.resolve({
            status: 200,
            data: { key: 'val' },
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      it('should return the body without headers', async () => {
        const res = await HttpClient.put('/url', { key: 'val' }, true);

        expect(res).toEqual({ key: 'val' });
      });

      it('should return the body with headers', async () => {
        const res = await HttpClient.put('/url', { key: 'val' }, false);

        expect(res).toEqual({
          body: { key: 'val' },
          headers: { 'Content-Type': 'application/json' },
        });
      });
    });
    describe('promise rejected', () => {
      beforeEach(() => {
        axios.post.mockImplementation(() => Promise.reject(new Error('message')));
      });

      it('should catch error', async () => {
        let actualError;
        try {
          await HttpClient.post('/url', true);
        } catch (er) {
          actualError = er;
        }
        expect(actualError.message).toEqual('message');
      });
    });
  });

  describe('DELETE /', () => {
    describe('promise resolved', () => {
      beforeEach(() => {
        axios.delete.mockReturnValue(
          Promise.resolve({
            status: 200,
            data: { key: 'val' },
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      it('should return the body without headers', async () => {
        const res = await HttpClient.delete('/url');

        expect(res).toEqual({
          status: 200,
          data: { key: 'val' },
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
      });
    });
    describe('promise rejected', () => {
      beforeEach(() => {
        axios.delete.mockImplementation(() => Promise.reject(new Error('message')));
      });

      it('should catch error', async () => {
        let actualError;
        try {
          await HttpClient.delete('/url');
        } catch (er) {
          actualError = er;
        }
        expect(actualError.message).toEqual('message');
      });
    });
  });
});
