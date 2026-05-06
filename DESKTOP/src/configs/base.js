const apiHost = (typeof window !== 'undefined' && window.location && window.location.hostname) || 'localhost'
const baseURL = 'http://' + apiHost + ':2003'
export default baseURL