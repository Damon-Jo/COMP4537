// https://github.com/nabil828/comp4537repo/tree/main/Labs/Lab%202%20-%20MongoDB
// The special $lt, $lte, $gt, $gte and $ne
//For example, to get all male unicorns that weigh more than 700 pounds, we could do:
db.unicorns.find({gender: 'm', weight: {$gt: 700}})
//or (not quite the same thing, but for
//demonstration purposes)
db.unicorns.find({gender: {$ne: 'f'}, weight: {$gte: 701}})

// $in, $or operator

db.unicorns.find({gender: 'f', $or: [{loves: 'apple'}, {weight: {$lt: 500}}]})
//return all female unicorns which either love apples or weigh less than 500 pounds.