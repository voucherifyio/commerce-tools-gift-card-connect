import { Amount, BalanceType, BaseOptions, GiftCardComponent, GiftCardOptions } from '../providers/definitions';
import { BaseComponentBuilder, DefaultComponent } from './definitions';
import { addFormFieldsEventListeners, fieldIds, getInput } from './utils';
import inputFieldStyles from '../style/inputField.module.scss';
import I18n from '../i18n';
import { translations } from '../i18n/translations';

export class FormBuilder extends BaseComponentBuilder {
  constructor(baseOptions: BaseOptions) {
    super(baseOptions);
  }

  build(config: GiftCardOptions): GiftCardComponent {
    return new FormComponent({
      giftcardOptions: config,
      baseOptions: this.baseOptions,
    });
  }
}

export class FormComponent extends DefaultComponent {
  protected i18n: I18n;

  constructor(opts: { giftcardOptions: GiftCardOptions; baseOptions: BaseOptions }) {
    super(opts);
    this.i18n = new I18n(translations);
  }

  async balance(): Promise<BalanceType> {
    try {
      const giftCardCode = getInput(fieldIds.code).value.replace(/\s/g, '');
      const fetchBalanceURL = this.baseOptions.processorUrl.endsWith('/')
        ? `${this.baseOptions.processorUrl}balance/${giftCardCode}`
        : `${this.baseOptions.processorUrl}/balance/${giftCardCode}`;
      const response = await fetch(fetchBalanceURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': this.baseOptions.sessionId,
        },
      });

      return await response.json();
    } catch (err) {
      this.baseOptions.onError(err);
    }
    return null;
  }

  submit(_: { amount?: Amount }): void {
    if (this.giftcardOptions?.onGiftCardSubmit) {
      this.giftcardOptions.onGiftCardSubmit();
      return
    }
    // TODO: Implement call to /redeem https://commercetools.atlassian.net/browse/SCC-2621
    return null;
  }

  mount(selector: string): void {
    document.querySelector(selector).insertAdjacentHTML('afterbegin', this._getField());
    addFormFieldsEventListeners(this.giftcardOptions);

    this.giftcardOptions?.onGiftCardReady?.();
  }

  private _getField() {
    return `
      <div class="${inputFieldStyles.wrapper}">
        <form class="${inputFieldStyles.paymentForm}">
          <div class="${inputFieldStyles.inputContainer}">
            <label class="${inputFieldStyles.inputLabel}" for="giftcard-code">
              ${this.i18n.translate('giftCardPlaceholder', this.baseOptions.locale)} <span aria-hidden="true"> *</span>
            </label>
            <input class="${inputFieldStyles.inputField}" type="text" id="giftcard-code" name="giftCardCode" value="">
            <span class="${inputFieldStyles.hidden} ${inputFieldStyles.errorField}">${this.i18n.translate('giftCardErrorInput', this.baseOptions.locale)}</span>
          </div>
        </form>
      </div>
    `;
  }

  getState(): { code?: string; } {
    return {
      code: getInput(fieldIds.code).value.replace(/\s/g, '')
    }
  }
}
