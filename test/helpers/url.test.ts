import { buildRUL, isAbsoluteURL, combineURL, isURLSameOrigin } from '../../src/helpers/url'

describe('helpers:url', () => {
    describe('buildRUL', () => {
      test('should support null params', () => {
        expect(buildRUL('/foo')).toBe('/foo')
      })
      test('should support params', () => {
        expect(
          buildRUL('/foo', {
            foo: 'bar'
          })
        ).toBe('/foo?foo=bar')
      })
      test('should ignore if some param value is null', () => {
        expect(
          buildRUL('/foo', {
            foo: 'bar',
            baz: null
          })
        ).toBe('/foo?foo=bar')
      })
      test('should ignore if the only param value is null', () => {
        expect(
          buildRUL('/foo', {
            baz: null
          })
        ).toBe('/foo')
      })
      test('should support object params', () => {
        expect(
          buildRUL('/foo', {
            foo: {
              bar: 'baz'
            }
          })
        ).toBe('/foo?foo=' + encodeURI('{"bar":"baz"}'))
      })
      test('should support date params', () => {
        const date = new Date()
        expect(
          buildRUL('/foo', {
            date: date
          })
        ).toBe('/foo?date=' + date.toISOString())
      })
      test('should support array params', () => {
        expect(
          buildRUL('/foo', {
            foo: ['bar', 'baz']
          })
        ).toBe('/foo?foo[]=bar&foo[]=baz')
      })
      test('should support special char params', () => {
        expect(
          buildRUL('/foo', {
            foo: '@:$, '
          })
        ).toBe('/foo?foo=@:$,+')
      })
      test('should support existing params', () => {
        expect(
          buildRUL('/foo?foo=bar', {
            bar: 'baz'
          })
        ).toBe('/foo?foo=bar&bar=baz')
      })
      test('should correct discard url hash mark', () => {
        expect(
          buildRUL('/foo?foo=bar#hash', {
            query: 'baz'
          })
        ).toBe('/foo?foo=bar&query=baz')
      })
      test('should use serializer if provided', () => {
        const serializer = jest.fn(() => {
          return 'foo=bar'
        })
        const params = { foo: 'bar' }
        expect(buildRUL('/foo', params, serializer)).toBe('/foo?foo=bar')
        expect(serializer).toHaveBeenCalled()   //函数被调用
        expect(serializer).toHaveBeenCalledWith(params)  //调用时会使用params作为参数
      })
  
      test('should support URLSearchParams', () => {
        expect(buildRUL('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
      })
    })
  
    describe('isAbsoluteURL', () => {
      test('should return true if URL begins with valid scheme name', () => {
        expect(isAbsoluteURL('https://api.github.com/users')).toBeTruthy()
        expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
        expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
      })
      test('should return false if URL begins with invalid scheme name', () => {
        expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
        expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
      })
      test('should return true if URL is protocol-relative', () => {
        expect(isAbsoluteURL('//example.com/')).toBeTruthy()
      })
      test('should return false if URL is relative', () => {
        expect(isAbsoluteURL('/foo')).toBeFalsy()
        expect(isAbsoluteURL('foo')).toBeFalsy()
      })
    })
  
    describe('combineURL', () => {
      test('should combine URL', () => {
        expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
      })
      test('should remove duplicate slashes', () => {
        expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
      })
      test('should insert missing slash', () => {
        expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
      })
      test('should not insert slash when relative url missing/empty', () => {
        expect(combineURL('https://api.github.com/users', '')).toBe('https://api.github.com/users')
      })
      test('should allow a single slash for relative url', () => {
        expect(combineURL('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
      })
    })
  
    describe('isURLSameOrigin', () => {
      test('should detect same origin', () => {
        expect(isURLSameOrigin(window.location.href)).toBeTruthy()
      })
      test('should detect different origin', () => {
        expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
      })
    })
  })