import { UserType } from '../enums/usertype.enum';
import { Specialty } from '../enums/specialty.enum';
export type JwtPayload = {
  id: number;
  name: string;
  specialty: Specialty;
  email: string | null;
  user_type: UserType;
};
