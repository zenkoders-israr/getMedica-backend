import { createDataSource } from './createDataSource';
import { runSeeders } from 'typeorm-extension';
import UserSeeder from './user/user.seed';

(async () => {
  const dataSource = await createDataSource();
  await dataSource.initialize();
  await runSeeders(dataSource, {
    seeds: [UserSeeder],
  });
})();
