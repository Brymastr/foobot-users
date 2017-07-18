const 
  Router = require('koa-router'),
  router = new Router(),
  User = require('./User');

router.get('/', async ctx => {
  ctx.body = await User.find({});
});

/**
 * Get a user by user id
 */
router.get('/:id', async ctx => {
  ctx.body = await User.findOne({ _id: ctx.params.id });
});

/**
 * Get a user by platform id
 */
router.get('/platform/:id', async ctx => {
  ctx.body = await User.findOne({ platform_ids: { $elemMatch: { id: ctx.params.id }}});
});

/**
 * Get platform ids for a user
 */
router.get('/:id/platforms', async ctx => {
  ctx.body = await User.findOne({ _id: ctx.params.id }, { platform_ids: true });
});

/**
 * Get a users specific platform id
 */
router.get('/:id/platforms/:platform', async ctx => {
  ctx.body = await User.findOne({ platform_ids: { $elemMatch: { name: ctx.params.platform }}}, { id: true });
});

/**
 * Exchange a platform ID for a user ID
 * If the platform ID doesn't exist, create a new user
 * @return User._id
 */
router.post('/:platform_id', async ctx => {
  const user = await User.findOne({ platform_ids: ctx.params.platform_id });
  if(user === undefined || user === null) {
    const newUser = new User({
      platform_ids: [ctx.params.platform_id]
    });
    ctx.body = (await newUser.save())._id;
  } else {
    ctx.body = user._id;
  }
});

router.delete('/', async ctx => {
  await User.remove({});
  ctx.body = 'all users deleted';
});

module.exports = router.routes();