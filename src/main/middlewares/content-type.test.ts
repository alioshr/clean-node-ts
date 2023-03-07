import request from 'supertest'
import app from '../config/app'

describe('Content Type middleware', () => {
  test('Should return content type default as JSON', async () => {
    app.get('/test_content_type', (req, res) => res.send())

    await request(app).get('/test_content_type').expect('content-type', /json/)
  })

  test('Should return xml when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => res.type('xml').send())

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
