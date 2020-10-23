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
  Dialog,
} from '@material-ui/core';
import { Formik, FormikProps, Form, Field, FieldProps, FormikErrors, FormikHelpers } from 'formik';

import EntriesPicker from 'src/components/EntriesPicker';
import { useContainerRepos } from 'src/containers/Repos/hooks';
import * as reposSelectors from 'src/containers/Repos/selectors';
import { SerializedError } from '@reduxjs/toolkit';
import Message from '../Message';
import { useSelector } from 'react-redux';

export interface IRepositoryFormValues {
  code: string;
  entries: string[];
  server?: string;
}

export interface IPropsRepositoryForm {
  onSubmit?: () => void;
}

const validate = (values: IRepositoryFormValues) => {
  const { code, entries } = values;
  const errors: FormikErrors<typeof values> = {};

  if (!code || code.length === 0) {
    errors.code = 'Code required!';
  }

  if (entries.length === 0) {
    errors.entries = 'Choose at least one entry';
  }

  return errors;
};

const RepositoryForm: React.FC<IPropsRepositoryForm> = (props) => {
  const styles = useStyles();
  const { handleSubmit } = useHooks(props);

  return (
    <>
      <Card style={{ width: 400 }}>
        <CardHeader title={<Typography variant="h3">Create new repository</Typography>} />
        <CardContent>
          <Formik
            initialValues={{
              code: '',
              entries: [],
            }}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {(formikProps: FormikProps<IRepositoryFormValues>) => {
              const loading = formikProps.isSubmitting;
              return (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field name="code">
                        {(params: FieldProps<string>) => {
                          const { field, meta } = params;
                          return (
                            <TextField
                              fullWidth
                              error={Boolean(meta.touched && meta.error)}
                              label="Choose unique code"
                              variant="outlined"
                              {...field}
                            />
                          );
                        }}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="entries">
                        {(params: FieldProps<string[]>) => {
                          const { field, meta } = params;
                          return (
                            <>
                              <EntriesPicker
                                onUpdate={(items) => {
                                  formikProps.setFieldValue(
                                    'entries',
                                    items.map(({ code }) => code),
                                  );
                                }}
                                noItemsMessage={'There are no available entries. Create one first.'}
                                pickedSet={field.value}
                              />
                              {meta.touched && meta.error && (
                                <Typography
                                  variant={'caption'}
                                  color={'error'}
                                  className={styles.keyError}
                                >
                                  {meta.error}
                                </Typography>
                              )}
                            </>
                          );
                        }}
                      </Field>
                    </Grid>
                    {formikProps.errors.server && (
                      <Grid item container xs={12} style={{ alignItems: 'center' }}>
                        <Message>{formikProps.errors.server}</Message>
                      </Grid>
                    )}
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
                        {loading && <CircularProgress className={styles.progress} size={26} />}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </CardContent>
      </Card>
    </>
  );
};

export const RepositoryFormModal: React.FC = () => {
  const { toggleEditModal } = useContainerRepos();
  const isRepoEditModalOpened = useSelector(reposSelectors.isEditModalOpened);
  const closeModal = useCallback(() => {
    toggleEditModal({ isOpened: false });
  }, [toggleEditModal]);

  return (
    <Dialog open={isRepoEditModalOpened} onClose={closeModal}>
      <RepositoryForm onSubmit={closeModal} />
    </Dialog>
  );
};

const useHooks = (props: IPropsRepositoryForm) => {
  const { onSubmit } = props;
  const { createNewRepo } = useContainerRepos();

  const handleSubmit = useCallback(
    async (values: IRepositoryFormValues, formikHelpers: FormikHelpers<IRepositoryFormValues>) => {
      const result = await createNewRepo({
        code: values.code,
        name: values.code,
        description: values.code,
        keys: values.entries,
      });
      const error = (result as { error: SerializedError }).error;

      if (!error && onSubmit) {
        onSubmit();
      } else {
        formikHelpers.setErrors({ server: error.message });
      }
    },
    [createNewRepo, onSubmit],
  );

  return { handleSubmit };
};

const useStyles = makeStyles(() => ({
  progress: {
    marginLeft: 20,
  },
  keyTitle: {
    marginTop: 10,
    marginBotton: 10,
    paddingLeft: 10,
  },
  keyError: {
    paddingLeft: 10,
  },
}));

export default RepositoryForm;
