const express = require('express')
const deparments = express.Router()
const cache = require('../../data/cache')
const {
    getErrorMessage
} = require('./../../core/config')
const mssql = require('mssql')
const model = require('../../data/model')
deparments.get('/all', async(req, res) => {
    const data = await new mssql.Request().query(`SELECT CODE, ID, PARENT_ID AS parentId, NAME, TYPE2, factoryId
    FROM            base.DEPARTMENT
    WHERE        (PARENT_ID IS NOT NULL)
    UNION ALL
    SELECT CODE, ID, 0 AS parentId, NAME, TYPE2, factoryId
    FROM            base.DEPARTMENT
    WHERE        (PARENT_ID IS NULL)`)
    res.status(200).send(data.recordset);
})
deparments.get('/khoi', async(req, res) => {
    const data = await new mssql.Request().query(`
    SELECT * FROM (
        select d.ID, d.NAME, d.CODE, a.LAST_NAME, p.NAME POSITION, t.LAST_NAME2, t.POSITION2, 1 THU_TU from base.DEPARTMENT d 
inner join base.ROLE_DEPARTMENT rd on d.id = rd.DEPARTMENT_ID
inner join base.ACCOUNT a on rd.ACCOUNT_ID = a.ID
left join base.POSITION p on rd.POSITION_ID = p.ID
left join (
select d.ID, a.LAST_NAME LAST_NAME2, p.NAME POSITION2 from base.DEPARTMENT d 
inner join base.ROLE_DEPARTMENT rd on d.id = rd.DEPARTMENT_ID
inner join base.ACCOUNT a on rd.ACCOUNT_ID = a.ID
left join base.POSITION p on rd.POSITION_ID = p.ID
where d.ID = 102627 and rd.DESK_MANAGER = 2
) t on t.ID = d.ID
where d.ID = 102627 and rd.DESK_MANAGER = 1
            union
			select d.ID, d.NAME, d.CODE, a.LAST_NAME, p.NAME POSITION, t.LAST_NAME2, t.POSITION2, 2 THU_TU from base.DEPARTMENT d 
inner join base.ROLE_DEPARTMENT rd on d.id = rd.DEPARTMENT_ID
inner join base.ACCOUNT a on rd.ACCOUNT_ID = a.ID
left join base.POSITION p on rd.POSITION_ID = p.ID
left join (
select d.ID, a.LAST_NAME LAST_NAME2, p.NAME POSITION2 from base.DEPARTMENT d 
inner join base.ROLE_DEPARTMENT rd on d.id = rd.DEPARTMENT_ID
inner join base.ACCOUNT a on rd.ACCOUNT_ID = a.ID
left join base.POSITION p on rd.POSITION_ID = p.ID
where d.ID = 102298 and rd.DESK_MANAGER = 2
) t on t.ID = d.ID
where d.ID = 102298 and rd.DESK_MANAGER = 1
            UNION
			select d.ID, d.NAME, d.CODE, a.LAST_NAME, p.NAME POSITION, t.LAST_NAME2, t.POSITION2, 3 THU_TU from base.DEPARTMENT d 
inner join base.ROLE_DEPARTMENT rd on d.id = rd.DEPARTMENT_ID
inner join base.ACCOUNT a on rd.ACCOUNT_ID = a.ID
left join base.POSITION p on rd.POSITION_ID = p.ID
left join (
select d.ID, a.LAST_NAME LAST_NAME2, p.NAME POSITION2 from base.DEPARTMENT d 
inner join base.ROLE_DEPARTMENT rd on d.id = rd.DEPARTMENT_ID
inner join base.ACCOUNT a on rd.ACCOUNT_ID = a.ID
left join base.POSITION p on rd.POSITION_ID = p.ID
where PARENT_ID is null AND D.ID NOT IN (102627, 102298) and rd.DESK_MANAGER = 2
) t on t.ID = d.ID
where PARENT_ID is null AND D.ID NOT IN (102627, 102298) and rd.DESK_MANAGER = 1

            ) T ORDER BY THU_TU
    `)
    res.status(200).send(data.recordset);
})

deparments.get('/parentId', async(req, res) => {
    const data = await new mssql.Request().query(`
    select d.ID, d.NAME, d.CODE, a.LAST_NAME, p.NAME POSITION, t.LAST_NAME2, t.POSITION2, 3 THU_TU from base.DEPARTMENT d 
inner join base.ROLE_DEPARTMENT rd on d.id = rd.DEPARTMENT_ID
inner join base.ACCOUNT a on rd.ACCOUNT_ID = a.ID
left join base.POSITION p on rd.POSITION_ID = p.ID
left join (
select d.ID, a.LAST_NAME LAST_NAME2, p.NAME POSITION2 from base.DEPARTMENT d 
inner join base.ROLE_DEPARTMENT rd on d.id = rd.DEPARTMENT_ID
inner join base.ACCOUNT a on rd.ACCOUNT_ID = a.ID
left join base.POSITION p on rd.POSITION_ID = p.ID
where PARENT_ID = ${req.query.parentId} and rd.DESK_MANAGER = 2
) t on t.ID = d.ID
where PARENT_ID = ${req.query.parentId} and rd.DESK_MANAGER = 1
    `)
    res.status(200).send(data.recordset);
})

deparments.get('/by-id', async(req, res) => {
    const data = await new mssql.Request().query(`
    select d.ID, CODE, NAME, a.LAST_NAME, a.POSITION from base.DEPARTMENT d
    inner join base.ACCOUNT a on d.accountId = a.ID
    where d.ID = ${req.query.id}
    `)
    res.status(200).send(data.recordset);
})

deparments.get('/all-departments', async(req, res) => {
    let data = await model.departments.findAll();
    res.status(200).send(data)
})
deparments.get('/', (req, res) => {
    if (req.query.factoryId) {
        let getDepartmentByFactoryId = `
        WITH
            temp(id, parentId, code, name, type, type2, accountId, accountId1, accountId2, factoryId, [order], thuTu)
            as
            (
                            Select id, null as parentId, code, name, type, type2, accountId, accountId1, accountId2, factoryId, [ORDER],
							case 
							when ID = 102627 then 1
							when ID = 102298 then 2
							when ID = 102497 then 3
							when ID = 102299 then 4
							when ID = 102395 then 5
							when ID = 102422 then 6
                            when ID = 102858 then 7
							end as thuTu
                    From base.DEPARTMENT
                    Where ID in (102627, 102298, 102299, 102395, 102422, 102497,102858)
                Union All
                    Select b.id, b.PARENT_ID as parentId, b.code, b.name, b.type, b.type2, b.accountId, b.accountId1, b.accountId2, b.factoryId, b.[ORDER], 7 thuTu
                    From temp as a, base.DEPARTMENT as b
                    Where a.id = b.parent_id and b.ID not in (102627, 102298, 102299, 102395, 102422, 102497,102858)
            )
        Select *
        From temp order by thuTu
        option (maxrecursion 0)
        `
        new mssql.Request()
            .input('ID', req.query.factoryId)
            .query(getDepartmentByFactoryId, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                else
                    res.api.sendData(record.recordset)
            })
    } else {
        res.api.sendData(cache.departments.findBy(req.query))
    }

})
deparments.get('/full/department', (req, res) => {
        let query = `
        WITH
            temp(id, parentId, code, name, type, type2, accountId, accountId1, accountId2, factoryId, [order], thuTu, GROUP_ID)
            as
            (
                            Select id, null as parentId, code, name, type, type2, accountId, accountId1, accountId2, factoryId, [ORDER], 
							case 
							when ID = 102627 then 1
							when ID = 102298 then 2
							when ID = 102497 then 3
							when ID = 102299 then 4
							when ID = 102395 then 5
							when ID = 102422 then 6
                            when ID = 102858 then 7
							end as thuTu, GROUP_ID
                    From base.DEPARTMENT
                    Where ID in (102627, 102298, 102299, 102395, 102422, 102497,102858) and (TYPE2 is null or TYPE2 != 'close')
                Union All
                    Select b.id, b.PARENT_ID as parentId, b.code, b.name, b.type, b.type2, b.accountId, b.accountId1, b.accountId2, b.factoryId, b.[ORDER], 7 thuTu, b.GROUP_ID
                    From temp as a, base.DEPARTMENT as b
                    Where a.id = b.parent_id and b.ID not in (102627, 102298, 102299, 102395, 102422, 102497,102858) and (b.TYPE2 is null or b.TYPE2 != 'close')
            )
            Select temp.*, gd.[ORDER] groupOrder
            From temp left join
            prod.GROUP_DEPARTMENT gd on temp.id = gd.DEPARTMENT_ID
            order by thuTu, temp.name
            option (maxrecursion 0)
        `
        new mssql.Request()
            .query(query, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                else
                    res.api.sendData(record.recordset)
            })
})

deparments.get('/position', (req, res) => {
        let query = `
        select ID value, NAME label from base.POSITION
        `
        new mssql.Request()
            .query(query, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                else
                    res.api.sendData(record.recordset)
            })
    

})
deparments.post('/', model.departments.insert, (req, res) => {
    res.api.sendData(req.result);
})
deparments.get('/:factoryId/departments', async(req, res) => {
    let data = await model.departments.findAll({
        where: {
            factoryId: req.params.factoryId
        }
    });
    res.status(200).send(data)
})
deparments.put('/:id', model.departments.updateById)
deparments.post('/del:id', async(req, res) => {
    const data = await new mssql.Request()
        .input('ID', req.params.id)
        .query(`delete FROM base.DEPARTMENT where ID = @ID
        delete from base.ROLE_VALUE where ROLE_TYPE_ID in (100001, 100002) and VALUE = '${req.params.id}'`)
    res.status(200).send(data.recordset);
})

module.exports = deparments