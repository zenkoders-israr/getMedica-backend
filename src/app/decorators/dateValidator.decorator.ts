import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regEx = /^\d{4}-\d{2}-\d{2}$/;

          if (!value || !value.match(regEx)) return false; // Invalid format

          const d = new Date(value);
          if (Number.isNaN(d.getTime())) return false; // Invalid date

          return d.toISOString().slice(0, 10) === value;
        },
      },
    });
  };
}
