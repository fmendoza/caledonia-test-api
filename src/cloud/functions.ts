Parse.Cloud.define('hello', (req: any) => {
  req.log.info(req);
  return 'Hi';
});

Parse.Cloud.define('asyncFunction', async (req: any) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  req.log.info(req);
  return 'Hi async';
});

Parse.Cloud.beforeSave('Test', () => {
  // @ts-expect-error
  throw new Parse.Error(9001, 'Saving test objects is not available.');
});