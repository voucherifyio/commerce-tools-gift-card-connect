import { ErrorGeneral } from '@commercetools/connect-payments-sdk';
import { VoucherifyError } from '../clients/voucherify.error';
import { ResourceNotFoundVoucherifyCustomError } from './resource-not-found.error';
import { VoucherifyApiError, VoucherifyCustomError } from './voucherify-api.error';

export const handleError = (error: unknown) => {
  if (error instanceof VoucherifyCustomError) {
    throw error;
  }

  if (error instanceof VoucherifyError) {
    switch (error.key) {
      case 'not_found':
        throw new ResourceNotFoundVoucherifyCustomError(error);
      default:
        throw new VoucherifyApiError(
          {
            code: error.code,
            message: error.message,
            key: error.key,
          },
          {
            privateFields: {
              details: error.details,
            },
            cause: error,
          },
        );
    }
  }

  throw new ErrorGeneral('Internal Server Error', {
    privateMessage: 'internal error making a call to voucherify',
    cause: error,
  });
};
