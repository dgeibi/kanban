export default async ({ transaction, permissionCheck, Model, ids, extra }) => {
  if (!Array.isArray(ids)) throw Error('ids should be array')

  const update = async (id, index) => {
    const m = await Model.findById(id, { transaction, attributes: ['id'] })
    if (!(await permissionCheck(m))) {
      throw Error('权限不足')
    }
    await m.update({ index, ...extra }, { transaction })
  }

  for (let index = 0; index < ids.length; index++) {
    await update(ids[index], index)
  }
}
