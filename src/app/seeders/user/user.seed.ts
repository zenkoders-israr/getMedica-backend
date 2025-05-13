import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserModel } from '../../models/user/user.model';
import { doctorMockData, patientMockData } from '../mockdata/user';
import { hashPassword } from '../../utils/bcrypt.helper';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(UserModel);
    const [doctor, patient] = await Promise.all([
      userRepo.findOne({ where: { email: doctorMockData.email } }),
      userRepo.findOne({ where: { email: patientMockData.email } }),
    ]);

    const [docPassword, patientPassword] = await Promise.all([
      hashPassword(doctorMockData.password),
      hashPassword(patientMockData.password),
    ]);
    doctorMockData.password = docPassword;
    patientMockData.password = patientPassword;

    if (!doctor) {
      await userRepo.save(doctorMockData);
    }

    if (!patient) {
      await userRepo.save(patientMockData);
    }
  }
}
