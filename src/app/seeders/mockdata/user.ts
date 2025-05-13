import { Specialty } from '@/app/contracts/enums/specialty.enum';
import { UserType } from '@/app/contracts/enums/usertype.enum';

export const doctorMockData = {
  user_type: UserType.DOCTOR,
  specialty: Specialty.GENERAL_SURGERY,
  email: 'doctor@gmail.com',
  password: 'click123',
  name: 'Doctor',
  created_at: new Date().getTime(),
  updated_at: new Date().getTime(),
};

export const patientMockData = {
  user_type: UserType.PATIENT,
  email: 'patient@gmail.com',
  password: 'click123',
  name: 'Patient',
  created_at: new Date().getTime(),
  updated_at: new Date().getTime(),
};
