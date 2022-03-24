exports.name = '【dev环境】sysAuditor-frontend';
exports.rules = `
9.135.146.67:9051 reqHeaders://({"Host":"localhost:3012","origin":"http://localhost:3012"})
/(http|ws)s://9.135.146.67:9051\/((?!(query|saml)).*)/ $1://localhost:3012/$2
`.trim()
