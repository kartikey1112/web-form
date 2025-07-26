import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './FormPage.css';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .required('City is required'),
  product: Yup.string()
    .oneOf(['Villa', 'Apartment', 'House', 'Condo'], 'Please select a valid product type')
    .required('Product type is required'),
  user_message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters')
    .required('Message is required'),
});

function FormPage() {
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitStatus({ type: '', message: '' });
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL || ''}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Thank you! Your inquiry has been submitted successfully.' 
        });
        resetForm();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitStatus({ 
          type: 'error', 
          message: errorData.message || 'Failed to submit form. Please try again.' 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>Web Form</h1>
        {submitStatus.message && (
          <div className={`alert ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}

        <Formik
          initialValues={{
            name: '',
            phone: '',
            city: '',
            product: '',
            user_message: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className={touched.name && errors.name ? 'error' : ''}
                />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <Field
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter 10-digit phone number"
                  className={touched.phone && errors.phone ? 'error' : ''}
                />
                <ErrorMessage name="phone" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="city">City *</label>
                <Field
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Enter your city"
                  className={touched.city && errors.city ? 'error' : ''}
                />
                <ErrorMessage name="city" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="product">Property Type *</label>
                <Field
                  as="select"
                  id="product"
                  name="product"
                  className={touched.product && errors.product ? 'error' : ''}
                >
                  <option value="">Select property type</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                </Field>
                <ErrorMessage name="product" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="user_message">Message *</label>
                <Field
                  as="textarea"
                  id="user_message"
                  name="user_message"
                  placeholder="Tell us about your requirements and preferences..."
                  rows="4"
                  className={touched.user_message && errors.user_message ? 'error' : ''}
                />
                <ErrorMessage name="user_message" component="div" className="error-message" />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default FormPage; 