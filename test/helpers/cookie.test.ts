import cookie from '../../src/helpers/cookie'

describe('helpers: cookie', () => {
    test('should read cookie', () => {
        document.cookie = 'name=ttn'
        expect(cookie.read('name')).toBe('ttn')
    })

    test('should return null if name is not exist', () => {
        document.cookie = 'age=27'
        expect(cookie.read('job')).toBeNull()
    })
})