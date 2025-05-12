import { registerDecorator, ValidationOptions } from 'class-validator';

export function isValidTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regEx = /^(?:[01]\d|2[0-3]):([0-5]\d)$/;

          if (!value || !value.match(regEx)) return false;

          const [hours, minutes] = value.split(':').map(Number);

          if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return false;
          }

          return true;
        },
      },
    });
  };
}
