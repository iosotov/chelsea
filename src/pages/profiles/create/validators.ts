import * as yup from 'yup'
import { isValid, parseISO } from 'date-fns'

export const requiredMsg = 'Required'

export const dateTimeValidator = (
  errorMessage = 'Required'
): yup.StringSchema<string | undefined, Record<string, any>> => {
  return yup
    .string()
    .required(requiredMsg)
    .matches(
      /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(T(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]Z?)?$/,
      errorMessage
    )
    .test('is-valid-date', 'Date-Time is not valid', (value: string | undefined) => {
      if (!value) return false
      const date = parseISO(value)

      return isValid(date)
    })
}

export const createSSNValidator = (
  errorMessage = 'Required'
): yup.StringSchema<string | undefined, Record<string, any>> => {
  return yup
    .string()
    .required(requiredMsg)
    .matches(/^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/, errorMessage)
}

export const personalSchema = yup
  .object({
    campaignId: yup.string().required(requiredMsg),
    firstName: yup.string().required(requiredMsg),
    middleName: yup.string().optional(),
    lastName: yup.string().required(requiredMsg),
    birthdate: dateTimeValidator(),
    ssn: createSSNValidator(),
    gender: yup.number().min(0).max(3).required(requiredMsg)
  })
  .required()

export type PersonalInformationForm = yup.InferType<typeof personalSchema>
