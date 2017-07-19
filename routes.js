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
 * Create or lazy-update a user
 * @return User._id
 */
router.post('/:platform_id', async ctx => {
  const user = await User.findOne({ platform_ids: { $elemMatch: { id: ctx.params.platform_id }}});
  const { first_name, last_name, phone, email, user_id, username, platform, gender } = ctx.request.body;

  if(user === undefined || user === null) {
    const newUser = new User({
      platform_ids: [{ id: user_id, name: platform }],
      first_name,
      last_name,
      phone,
      email,
      gender,
      username
    });
    ctx.body = await newUser.save();
  } else {
    user.first_name = user.first_name || first_name;
    user.last_name = user.last_name || last_name;
    user.phone = user.phone || phone;
    user.email = user.email || email;
    user.gender = user.gender || gender;
    user.username = user.username || username;
    ctx.body = await user.save();
  }

});

router.delete('/', async ctx => {
  await User.remove({});
  ctx.body = 'all users deleted';
});

module.exports = router.routes();