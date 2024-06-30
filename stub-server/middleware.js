async function initLowDb() {
    const { JSONFilePreset } = await import('lowdb/node')
    return await JSONFilePreset('db.json', { records: {} })
}

(async () => {
    const db = await initLowDb()
    this.app.use('/stub', (req, res) => {
        this.logger.info('Routing to stub reader')
        const id = req.query.id
        if (id) {
            this.logger.info(`Querying stub id=${id}`)
            res.send(db.data.records[id])
        }
    })

    this.app.use('/', (req, res, next) => {
        this.logger.info('Routing to all stub definitions')
        const stubKey = 'x-stub-id'
        db.update(({ records }) => {
            if (req.headers[stubKey]) {
                const record = {
                    stubId: req.headers[stubKey],
                    requestBody: req.body,
                    requestUrl: req.url,
                    requestMethod: req.method,
                    requestHeader: req.headers,
                }
                records[req.headers[stubKey]] = record
            }
        })
        next()
    },
        this.allRoutes
    )
})()