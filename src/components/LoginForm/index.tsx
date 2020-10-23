import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Formik,
  Form,
  Field,
  FieldProps,
  FormikErrors,
  FormikProps,
} from 'formik';

import Message from 'src/components/Message';
import { errors as userServerErrors } from 'src/containers/Session/selectors';

import {
  TextField,
  CardContent,
  Card,
  Typography,
  CardHeader,
  Button,
} from '@material-ui/core';
import { useContainerSession } from 'src/containers/Session/hooks';
import { makeStyles } from '@material-ui/styles';

export interface IUserLoginData {
  username: string;
  password: string;
}

const initialValues = { username: '', password: '' };

const LoginForm: React.FC = () => {
  const serverErrors = useSelector(userServerErrors);
  const { handleSubmit, validate } = useHooks();
  const s = useStyles();

  return (
    <Card>
      <CardHeader title={<Typography variant="h3">Sign in</Typography>} />
      <CardContent>
        <div className={s.container}>
          <div>
            <Formik
              initialValues={initialValues}
              validate={validate}
              onSubmit={handleSubmit}
            >
              {(_props: FormikProps<IUserLoginData>) => {
                return (
                  <Form>
                    <div className={s.bodyLine}>
                      <Field name="username">
                        {(params: FieldProps<string>) => {
                          const { field, meta } = params;
                          return (
                            <TextField
                              error={Boolean(meta.touched && meta.error)}
                              label="Login"
                              variant="outlined"
                              autoComplete="current-login"
                              {...field}
                            />
                          );
                        }}
                      </Field>
                    </div>
                    <div className={s.bodyLine}>
                      <Field name="password">
                        {(params: FieldProps<string>) => {
                          const { field, meta } = params;
                          return (
                            <TextField
                              label="Password"
                              variant="outlined"
                              type="password"
                              autoComplete="current-password"
                              error={Boolean(meta.touched && meta.error)}
                              {...field}
                            />
                          );
                        }}
                      </Field>
                    </div>
                    {serverErrors.loginForm && (
                      <div className={s.bodyLine}>
                        <Message>{serverErrors.loginForm}</Message>
                      </div>
                    )}
                    <div className={s.bodyLine}>
                      <div className={s.lineItem}>
                        <Button
                          fullWidth
                          color="secondary"
                          size="large"
                          type="submit"
                          variant="contained"
                        >
                          Войти
                        </Button>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const useHooks = () => {
  const { fetchLoginUser } = useContainerSession();

  const handleSubmit = useCallback(
    async (values: IUserLoginData) => {
      await fetchLoginUser(values);
    },
    [fetchLoginUser],
  );

  const validate = useCallback((values: IUserLoginData) => {
    const { username, password } = values;
    const errors: FormikErrors<typeof values> = {};

    if (!username || username.length === 0) {
      errors.username = 'Username required';
    }

    if (!password || password.length === 0) {
      errors.password = 'Password required';
    }

    return errors;
  }, []);

  return {
    validate,
    handleSubmit,
  };
};

const useStyles = makeStyles(() => {
  return {
    container: {
      width: 300,
    },
    bodyLine: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: 20,
      '&:last-child': {
        marginBottom: 0,
      },
    },
    lineItem: {
      flexGrow: 1,
      marginBottom: 10,
      '&:last-child': {
        marginBottom: 0,
      },
    },
  };
});

export default LoginForm;
