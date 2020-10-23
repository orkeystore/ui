import React, { useCallback } from 'react';
import {
  Card,
  CardHeader,
  Typography,
  CardContent,
  Grid,
  TextField,
  Button,
  CircularProgress,
  makeStyles,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { Formik, FormikProps, Form, Field, FieldProps } from 'formik';
import { useContainerAccounts } from 'src/containers/Accounts/hooks';

export interface IAccountFormValues {
  login: string;
  password: string;
  admin: string;
}

export interface IPropsAccountForm {
  onSubmit?: () => void;
}

const initialValues: IAccountFormValues = {
  login: '',
  password: '',
  admin: '0',
};

const AccountForm: React.FC<IPropsAccountForm> = (props) => {
  const styles = useStyles();
  const { handleSubmit, validate } = useHooks(props);

  return (
    <Card style={{ width: 400 }}>
      <CardHeader
        title={<Typography variant="h3">Create new account</Typography>}
      />
      <CardContent>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {(formikProps: FormikProps<IAccountFormValues>) => {
            const loading = formikProps.isSubmitting;
            return (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field name="login">
                      {(params: FieldProps<string>) => {
                        const { field, meta } = params;
                        return (
                          <TextField
                            fullWidth
                            error={Boolean(meta.touched && meta.error)}
                            label="Enter login"
                            variant="outlined"
                            {...field}
                          />
                        );
                      }}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="password">
                      {(params: FieldProps<string>) => {
                        const { field, meta } = params;
                        return (
                          <TextField
                            fullWidth
                            error={Boolean(meta.touched && meta.error)}
                            label="Password"
                            type="password"
                            autoComplete={'off'}
                            variant="outlined"
                            {...field}
                          />
                        );
                      }}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="admin">
                      {(params: FieldProps<string>) => {
                        const { field } = params;
                        return (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value === '1'}
                                onChange={(_, checked) => {
                                  formikProps.setFieldValue(
                                    'admin',
                                    checked ? '1' : '0',
                                  );
                                }}
                                name="checkedB"
                                color="primary"
                              />
                            }
                            label="Administrator"
                          />
                        );
                      }}
                    </Field>
                  </Grid>
                  <Grid item container xs={12} style={{ alignItems: 'center' }}>
                    <Button
                      disabled={loading}
                      size="large"
                      type="submit"
                      variant={'contained'}
                      color="secondary"
                      disableElevation
                      fullWidth
                    >
                      {!loading && 'Submit'}
                      {loading && (
                        <CircularProgress
                          className={styles.progress}
                          size={26}
                        />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </CardContent>
    </Card>
  );
};

const useHooks = (props: IPropsAccountForm) => {
  const { onSubmit } = props;
  const { fetchCreateAccount } = useContainerAccounts();

  const validate = useCallback(() => { return {}; }, []);

  const handleSubmit = useCallback(
    async (values: IAccountFormValues) => {
      await fetchCreateAccount({
        isAdmin: values.admin === '1',
        login: values.login,
        password: values.password,
      });
      if (onSubmit) {
        onSubmit();
      }
    },
    [onSubmit, fetchCreateAccount],
  );

  return {
    validate,
    handleSubmit,
    fetchCreateAccount,
  };
};

const useStyles = makeStyles(() => ({
  progress: {
    marginLeft: 20,
  },
}));

export default AccountForm;
