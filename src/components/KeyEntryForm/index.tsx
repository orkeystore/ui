import React, { useCallback, useMemo } from 'react';
import {
  Card,
  CardHeader,
  Typography,
  CardContent,
  Grid,
  TextField,
  makeStyles,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Dialog,
} from '@material-ui/core';
import Inputmask from 'inputmask';
import {
  Formik,
  Form,
  Field,
  FieldProps,
  FormikProps,
  FormikErrors,
  FormikHelpers,
} from 'formik';
import { SerializedError } from '@reduxjs/toolkit';

import Message from 'src/components/Message';
import TextFieldWithOptions from 'src/components/TextFieldWithOptions';
import { useContainerKeys } from 'src/containers/Keys/hooks';
import * as keysSelectors from 'src/containers/Keys/selectors';
import { useSelector } from 'react-redux';

const unitOptions = {
  h: 'hours',
  d: 'days',
  w: 'weeks',
  m: 'months',
};

export interface IKeyEntryFormValues {
  name: string;
  code: string;
  rotation: string;
  rotatable: string;
  server?: string;
  unit: keyof typeof unitOptions;
}

export interface IPropsKeyEntryForm {
  onSubmit?: () => void;
}

const defaultInitialValues: IKeyEntryFormValues = {
  name: '',
  code: '',
  rotation: '',
  unit: 'd',
  rotatable: '1',
};

const KeyEntryForm: React.FC<IPropsKeyEntryForm> = (props) => {
  const styles = useStyles();
  const { codeMask, digitMask, menuItems, validate, handleSubmit } = useHooks(
    props,
  );

  return (
    <Card style={{ width: 400 }}>
      <CardHeader
        title={<Typography variant="h3">Add new key entry</Typography>}
      />
      <CardContent>
        <Formik
          initialValues={defaultInitialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {(formikProps: FormikProps<IKeyEntryFormValues>) => {
            const loading = formikProps.isSubmitting;
            return (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field name="name">
                      {(params: FieldProps<string>) => {
                        const { field, meta } = params;
                        return (
                          <TextField
                            className={styles.textfield}
                            error={Boolean(meta.touched && meta.error)}
                            label="Choose name"
                            variant="outlined"
                            {...field}
                          />
                        );
                      }}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="code">
                      {(params: FieldProps<string>) => {
                        const { field, meta } = params;
                        return (
                          <TextField
                            className={styles.textfield}
                            error={Boolean(meta.touched && meta.error)}
                            label="Unique code"
                            variant="outlined"
                            InputProps={{
                              inputRef: (el) => {
                                if (el) {
                                  codeMask.mask(el);
                                }
                              },
                            }}
                            {...field}
                          />
                        );
                      }}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="rotation">
                      {(params: FieldProps<string>) => {
                        const { field, meta } = params;
                        const isEnabled = formikProps.values.rotatable === '1';
                        return (
                          <TextFieldWithOptions
                            menu={menuItems}
                            onSelectMenuItem={(item) => {
                              if (typeof item.id === 'string') {
                                formikProps.setFieldValue('unit', item.id);
                              }
                            }}
                            disabled={!isEnabled}
                            currentMenuLabel={
                              unitOptions[formikProps.values.unit]
                            }
                            inputProps={{
                              inputRef: (el) => {
                                if (el) {
                                  digitMask.mask(el);
                                }
                              },
                            }}
                            fieldProps={{
                              error: Boolean(meta.touched && meta.error),
                              label: `Rotation interval`,
                              ...field,
                            }}
                          />
                        );
                      }}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="rotatable">
                      {(params: FieldProps<string>) => {
                        const { field } = params;
                        return (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value === '1'}
                                onChange={(_, checked) => {
                                  formikProps.setFieldValue(
                                    'rotatable',
                                    checked ? '1' : '0',
                                  );
                                }}
                                name="checkedB"
                                color="primary"
                              />
                            }
                            label="Enable rotation"
                          />
                        );
                      }}
                    </Field>
                  </Grid>

                  {formikProps.errors.server && (
                    <Grid
                      item
                      container
                      xs={12}
                      style={{ alignItems: 'center' }}
                    >
                      <Message root={{ style: { flexGrow: 1 } }}>
                        {formikProps.errors.server}
                      </Message>
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

export const KeyEntryFormModal: React.FC = () => {
  const isEditModalOpened = useSelector(keysSelectors.isEditModalOpened);
  const { toggleEditModal } = useContainerKeys();

  const closeModal = useCallback(() => {
    toggleEditModal({ isOpened: false });
  }, [toggleEditModal]);

  return (
    <Dialog open={isEditModalOpened} onClose={closeModal}>
      <KeyEntryForm onSubmit={closeModal} />
    </Dialog>
  );
};

const useHooks = (props: IPropsKeyEntryForm) => {
  const { fetchCreateKey } = useContainerKeys();

  const digitMask = useMemo(
    () => Inputmask({ regex: String.raw`[\d,.]*` }),
    [],
  );
  const codeMask = useMemo(() => Inputmask({ regex: String.raw`[\w]*` }), []);

  const menuItems = useMemo(() => {
    const options = Object.keys(unitOptions) as Array<keyof typeof unitOptions>;
    return options.map((unit) => {
      return {
        id: unit,
        label: unitOptions[unit],
      };
    });
  }, []);

  const { onSubmit } = props;

  const handleSubmit = useCallback(
    async (
      values: IKeyEntryFormValues,
      formikHelpers: FormikHelpers<IKeyEntryFormValues>,
    ) => {
      const result = await fetchCreateKey({
        name: values.name,
        code: values.code,
        rotation:
          values.rotatable === '1'
            ? `${values.rotation} ${values.unit}`
            : undefined,
      });

      const errorResult = result as { error: SerializedError };
      if (errorResult.error) {
        formikHelpers.setErrors({ server: errorResult.error.message });
      } else if (onSubmit) {
        onSubmit();
      }
    },
    [onSubmit, fetchCreateKey],
  );

  const validate = useCallback((values: IKeyEntryFormValues) => {
    const errors: FormikErrors<typeof values> = {};

    if (!values.name || values.name.length === 0) {
      errors.name = 'Name required!';
    }

    if (!values.code || values.code.length === 0) {
      errors.code = 'Code required!';
    }

    if (values.rotatable === '1') {
      if (!values.rotation && values.rotation.length === 0) {
        errors.rotation = 'Rotation interval required!';
      } else if (isNaN(parseInt(values.rotation))) {
        errors.rotation = 'Rotation interval should be number!';
      }
    }

    return errors;
  }, []);

  return {
    digitMask,
    codeMask,
    menuItems,
    handleSubmit,
    fetchCreateKey,
    validate,
  };
};

const useStyles = makeStyles(() => ({
  textfield: {
    width: '100%',
  },
  progress: {
    marginLeft: 20,
  },
  menu: {
    width: 150,
    marginLeft: 10,
  },
}));

export default KeyEntryForm;
