import React, { ComponentType, useState } from 'react';
import CustomForm, { CustomFormProps } from '../components/forms/custom-form';

// Define a type for props that the HOC accepts
interface WithInputValidationProps {}

// Define the type for the errors object
interface Errors {
  [key: string]: string;
}

// Define the HOC function
const withInputValidation = <P extends CustomFormProps>(WrappedComponent: ComponentType<P>) => {
  const WithInputValidation: React.FC<P & WithInputValidationProps> = (props) => {
    const [errors, setErrors] = useState<Errors>({});

    const validateForm = (formData: any, fields: CustomFormProps['fields']) => {
      const newErrors: Errors = {};
      fields.forEach((field) => {
        const { name, required, type } = field;
        const value = formData[name];

        if (required && (!value || typeof value !== 'string' || value.trim() === '')) {
          newErrors[name] = `${field.label} can't be empty`;
        } else if (type === 'number' && isNaN(Number(value))) {
          newErrors[name] = 'Only numbers are allowed';
        } else {
          newErrors[name] = '';
        }
      });
      setErrors(newErrors);
      return Object.values(newErrors).every((error) => error === '');
    };

    return <WrappedComponent {...props as P} validateForm={validateForm} errors={errors} />;
  };

  return WithInputValidation;
};

export default withInputValidation;