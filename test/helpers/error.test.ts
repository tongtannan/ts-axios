import { createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('helpers:error', () => {
  test('error config', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = {
      method: 'post'
    }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'OK',
      headers: null,
      request,
      config,
      data: { foo: 'bar' }
    }
    const error = createError('xxx', config, 'sth', request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('xxx')
    expect(error.config).toBe(config)
    expect(error.code).toBe('sth')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
