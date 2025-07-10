import { ValidationValidateStackableResponse } from '../clients/types/validations';
import { VoucherifyCustomError } from '../errors/voucherify-api.error';

export const handleStackableValidationResult = (
  validationValidateStackableResponse: ValidationValidateStackableResponse,
) => {
  if (!validationValidateStackableResponse?.inapplicable_redeemables) {
    return;
  }

  const inapplicableRedeemableResult = validationValidateStackableResponse.inapplicable_redeemables.find(
    (redeemable) => !!redeemable?.result?.error,
  )?.result;
  if (!inapplicableRedeemableResult) {
    return;
  }

  switch (inapplicableRedeemableResult.error?.key) {
    case 'voucher_expired':
      throw new VoucherifyCustomError({
        message: inapplicableRedeemableResult.error?.details || 'Gift card is expired',
        code: 400,
        key: 'Expired',
      });
    default:
      throw new VoucherifyCustomError({
        message: inapplicableRedeemableResult.error?.message || 'An error happened during this requests',
        code: inapplicableRedeemableResult.error?.code || 400,
        key: inapplicableRedeemableResult.error?.key || 'GenericError',
      });
  }
};
