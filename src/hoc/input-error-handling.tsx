import React, { ComponentType, useState } from 'react';
import CustomForm, { CustomFormProps } from '../components/forms/custom-form';

// Define a type for props that the HOC accepts
interface WithInputValidationProps {
  // Optionally, you can add any props that the HOC may require
}

// Define the HOC function
const withInputValidation = <P extends CustomFormProps>(WrappedComponent: ComponentType<P>) => {
  const WithInputValidation: React.FC<P & WithInputValidationProps> = (props) => {
    const [errors, setErrors] = useState<any>({});

    const validateForm = (formData: any, fields: CustomFormProps['fields']) => {
      const newErrors: any = {};
      fields.forEach((field: any) => {
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
