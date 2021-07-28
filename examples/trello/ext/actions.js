import HttpError from '@wasp/core/HttpError.js'

/* List */

export const createList = async ({ name, pos }, context) => {
  if (!context.user) { throw new HttpError(403) }
  return context.entities.List.create({
    data: {
      name,
      pos,
      user: { connect: { id: context.user.id } }
    }
  })
}

export const updateList = async ({ listId, data }, context) => {
  if (!context.user) { throw new HttpError(403) }
  return context.entities.List.updateMany({
    where: { id: listId, user: { id: context.user.id } },
    data: {
      name: data.name
    }
  })
}

export const deleteList = async ({ listId }, context) => {
  if (!context.user) { throw new HttpError(403) }

  // We make sure that user is not trying to delete somebody else's list.
  const list = await context.entities.List.findUnique({
    where: { id: listId }
  })
  if (list.userId !== context.user.id) { throw new HttpError(403) }

  // First delete all the cards that are in the list we want to delete.
  await context.entities.Card.deleteMany({
    where: { listId }   
  })

  await context.entities.List.delete({
    where: { id: listId }
  })
}

/* Card */

export const createCard = async ({ title, listId }, context) => {
  if (!context.user) { throw new HttpError(403) }
  return context.entities.Card.create({
    data: {
      title,
      list: { connect: { id: listId } },
      author: { connect: { id: context.user.id } }
    }
  })
}

