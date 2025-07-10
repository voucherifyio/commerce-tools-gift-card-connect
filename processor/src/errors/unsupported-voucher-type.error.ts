import { VoucherifyCustomError } from './voucherify-api.error';

export class UnsupportedVoucherTypeCustomError extends VoucherifyCustomError {
  constructor() {
    super({
      code: 400,
      key: 'unsupported_voucher_type',
      message: 'Voucher is not supported. Only gift vouchers are supported.',
    });
  }
}
