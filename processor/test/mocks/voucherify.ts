export const listVouchersOk = {
  object: 'list',
  data_ref: 'vouchers',
  vouchers: [
    {
      id: 'v_hrMBBeT4sOP9VSGPmj5KAgJwX202UjiY',
      code: 'LOYALTY-CARD-xLPbpbXR',
      campaign: 'Loyalty Program Fall 2022',
      campaign_id: 'camp_f7fBbQxUuTN7dI7tGOo5XMDA',
      category: 'First',
      category_id: 'cat_0bb343dee3cdb5ec0c',
      categories: [
        {
          id: 'cat_0bb343dee3cdb5ec0c',
          name: 'First',
          hierarchy: 1,
          created_at: '2022-09-16T11:47:19.568Z',
          object: 'category',
        },
      ],
      type: 'LOYALTY_CARD',
      discount: null,
      gift: null,
      loyalty_card: {
        points: 110,
        balance: 100,
        next_expiration_date: '2023-12-31',
        next_expiration_points: 100,
      },
      start_date: null,
      expiration_date: null,
      validity_timeframe: null,
      validity_day_of_week: null,
      active: true,
      additional_info: null,
      metadata: {},
      assets: {
        qr: {
          id: 'U2FsdGVkX19OrTPNyUztbNretF7tPRL4ZlUDPAUXVGL9e5UCPh6dic8zXEP8/6I6hUEqtz/F6IMIghWz1ljdjzpdizGHG3HZBw4c19fd8SD/DjhBRDSr8APqKGpZTLKe4QC2gislFTeDAq2lmJb6T1oOTBUGkUEwMgEX1Vlco9A=',
          url: 'https://dl.voucherify.io/api/v1/assets/qr/U2FsdGVkX19OrTPNyUztbNretF7tPRL4ZlUDPAUXVGL9e5UCPh6dic8zXEP8%2F6I6hUEqtz%2FF6IMIghWz1ljdjzpdizGHG3HZBw4c19fd8SD%2FDjhBRDSr8APqKGpZTLKe4QC2gislFTeDAq2lmJb6T1oOTBUGkUEwMgEX1Vlco9A%3D',
        },
        barcode: {
          id: 'U2FsdGVkX1/SpYuOrU9wd6/o1wzy6E/04wURHJ1xuMutzkIUx6OBTmHX5BO8XZRmEFHkgjC5eWJ27ArgAruJfwRXWuQfTNFD4raI9YvIiQNEzsZ0ydxwKBqJ/FJtiw69djuzQk1f4HdQo8s5gaZ7fd2U+1zbaeAvi9usyvRHZE4=',
          url: 'https://dl.voucherify.io/api/v1/assets/barcode/U2FsdGVkX1%2FSpYuOrU9wd6%2Fo1wzy6E%2F04wURHJ1xuMutzkIUx6OBTmHX5BO8XZRmEFHkgjC5eWJ27ArgAruJfwRXWuQfTNFD4raI9YvIiQNEzsZ0ydxwKBqJ%2FFJtiw69djuzQk1f4HdQo8s5gaZ7fd2U%2B1zbaeAvi9usyvRHZE4%3D',
        },
      },
      is_referral_code: false,
      created_at: '2022-09-19T07:56:22.355Z',
      updated_at: '2022-09-19T08:04:22.458Z',
      holder_id: 'cust_eWgXlBBiY6THFRJwX45Iakv4',
      redemption: {
        quantity: null,
        redeemed_quantity: 1,
        redeemed_points: 10,
        object: 'list',
        url: '/v1/vouchers/LOYALTY-CARD-xLPbpbXR/redemptions?page=1&limit=10',
      },
      publish: {
        object: 'list',
        count: 1,
        url: '/v1/vouchers/LOYALTY-CARD-xLPbpbXR/publications?page=1&limit=10',
      },
      object: 'voucher',
    },
    {
      id: 'v_OBVfpTVf24DBz0HZmKVZa5UEl1DUg2bn',
      code: 'AmountDiscount',
      campaign: null,
      campaign_id: null,
      category: 'First',
      category_id: 'cat_0bb343dee3cdb5ec0c',
      categories: [
        {
          id: 'cat_0bb343dee3cdb5ec0c',
          name: 'First',
          hierarchy: 1,
          created_at: '2022-09-16T11:47:19.568Z',
          object: 'category',
        },
      ],
      type: 'DISCOUNT_VOUCHER',
      discount: {
        type: 'AMOUNT',
        amount_off: 400,
        amount_off_formula: 'IF(CUSTOMER_METADATA("favorite_brands") contains "Nike";20;CUSTOMER_METADATA("age"))',
        effect: 'APPLY_TO_ORDER',
      },
      gift: null,
      loyalty_card: null,
      start_date: '2022-09-01T00:00:00.000Z',
      expiration_date: '2022-10-31T00:00:00.000Z',
      validity_timeframe: null,
      validity_day_of_week: [1, 2, 3, 4, 5],
      active: true,
      additional_info:
        'This voucher discount is based on a formula, payment must be using VISA, and order must be over $100.',
      metadata: {},
      assets: {
        qr: {
          id: 'U2FsdGVkX18tV6jdzxWPwEzjeiX4DoM06JpwaoKUNGMNx4Td5e8FwA68uIHQwPaRpJr9CUCpiP4IsSD8nEJn1YtEv6FnY83wIv7uljYoQOYmMPyhKec8Ct3zH7KurMGuj4Fhws3HNA3bqP5MYEy+aA==',
          url: 'https://dl.voucherify.io/api/v1/assets/qr/U2FsdGVkX18tV6jdzxWPwEzjeiX4DoM06JpwaoKUNGMNx4Td5e8FwA68uIHQwPaRpJr9CUCpiP4IsSD8nEJn1YtEv6FnY83wIv7uljYoQOYmMPyhKec8Ct3zH7KurMGuj4Fhws3HNA3bqP5MYEy%2BaA%3D%3D',
        },
        barcode: {
          id: 'U2FsdGVkX181+WljOgxIt9Jg1Urbuv226+8Ug0DIyZiI0WtThPNYKZZEodzqQpIsGSdrDGXr2chLo+4FH3Ey8G2YXCPM6nUhZRSMF5oL3+uNjcLtBvb7MF5+ynY5fIgpXolwUK0R/BuT4Pa8prhgTg==',
          url: 'https://dl.voucherify.io/api/v1/assets/barcode/U2FsdGVkX181%2BWljOgxIt9Jg1Urbuv226%2B8Ug0DIyZiI0WtThPNYKZZEodzqQpIsGSdrDGXr2chLo%2B4FH3Ey8G2YXCPM6nUhZRSMF5oL3%2BuNjcLtBvb7MF5%2BynY5fIgpXolwUK0R%2FBuT4Pa8prhgTg%3D%3D',
        },
      },
      is_referral_code: false,
      created_at: '2022-09-12T07:51:02.145Z',
      updated_at: '2022-09-19T08:29:12.566Z',
      holder_id: 'cust_eWgXlBBiY6THFRJwX45Iakv4',
      redemption: {
        quantity: null,
        redeemed_quantity: 2,
        object: 'list',
        url: '/v1/vouchers/AmountDiscount/redemptions?page=1&limit=10',
      },
      publish: {
        object: 'list',
        count: 1,
        url: '/v1/vouchers/AmountDiscount/publications?page=1&limit=10',
      },
      object: 'voucher',
    },
  ],
  total: 2,
};

export const getVoucherOk = {
  id: 'v_q5uy89nhs4oVpDW8u5sZY6eDReLxh6jJ',
  code: 'some-code',
  campaign: 'CTGiftCampaign',
  campaign_id: 'camp_m1QnhMGb8ImqkB28vvd9CRid',
  category: null,
  category_id: null,
  categories: [],
  type: 'GIFT_VOUCHER',
  discount: null,
  gift: { amount: 601900, balance: 563000, effect: 'APPLY_TO_ORDER' },
  loyalty_card: null,
  start_date: null,
  expiration_date: null,
  validity_timeframe: null,
  validity_hours: null,
  validity_day_of_week: null,
  active: true,
  additional_info: null,
  metadata: {},
  assets: {},
  is_referral_code: false,
  created_at: '2025-06-09T11:24:21.292Z',
  updated_at: '2025-06-16T06:16:21.605Z',
  validation_rules_assignments: { object: 'list', data_ref: 'data', data: [], total: 0 },
  redemption: {
    quantity: null,
    redeemed_quantity: 30,
    redeemed_amount: 38900,
    object: 'list',
    url: '/v1/vouchers/some-code/redemptions?page=1&limit=10'
  },
  publish: {
    object: 'list',
    count: 0,
    url: '/v1/vouchers/AmountDiscount/publications?page=1&limit=10',
  },
  object: 'voucher'
}

export const getNotExistingVoucher = {
  status: {
    state: "NotFound",
    errors: [
      {
        code: "NotFound",
        message: "Cannot find voucher with id some-code"
      }
    ]
  }
}

export const listMetadataSchemasOk = {
  object: 'list',
  data_ref: 'schemas',
  schemas: [
    {
      id: 'ms_s3c0N6m3ta6a4a5ch3ma',
      related_object: 'product',
      properties: {
        vendor: {
          type: 'string',
          array: false,
          optional: true,
          objectType: null
        },
        category: {
          type: 'string',
          array: false,
          optional: true,
          objectType: null
        }
      },
      allow_defined_only: null,
      created_at: '2023-03-10T09:47:20.831Z',
      updated_at: null,
      object: 'metadata_schema'
    }
  ],
  total: 4
}

export const validateVouchersOk = {
  valid: true,
  redeemables: [
    {
      status: 'APPLICABLE',
      id: 'M3X8IwW8',
      object: 'voucher',
      order: {
        amount: 2700,
        discount_amount: 100,
        items_discount_amount: 1700,
        total_discount_amount: 1800,
        total_amount: 900,
        applied_discount_amount: 100,
        total_applied_discount_amount: 100,
        items: [],
        metadata: {},
        customer_id: null,
        referrer_id: null,
        object: 'order',
      },
      applicable_to: {},
      inapplicable_to: {},
      result: {
        gift: {
          credits: 100,
          balance: 10000,
        },
      },
      metadata: {},
      categories: [],
    },
  ],
  tracking_id: 'track_9B0kB92+bJa8a+PegaWREw==',
};

export const validateVouchersNotOk = {
  valid: false,
  redeemables: [
    {
      status: 'NOT_APPLICABLE',
      id: 'M3X8IwW8',
      object: 'voucher',
      order: {
        amount: 2700,
        discount_amount: 100,
        items_discount_amount: 1700,
        total_discount_amount: 1800,
        total_amount: 900,
        applied_discount_amount: 100,
        total_applied_discount_amount: 100,
        items: [],
        metadata: {},
        customer_id: null,
        referrer_id: null,
        object: 'order',
      },
      applicable_to: {},
      inapplicable_to: {},
      result: {
        error: {
          key: 'not_found',
          message: 'Resource not found',
          details: 'voucher with given code does not exist',
        },
      },
      metadata: {},
      categories: [],
    },
  ],
  tracking_id: 'track_9B0kB92+bJa8a+PegaWREw==',
};

export const redeemVouchersOk = {
  redemptions: [
    {
      id: 'REDEMPTION_ID',
      date: '2024-10-30T07:58:41.861Z',
      amount: 1,
      order: {
        id: 'ORDER_ID',
        source_id: null,
        status: 'PAID',
        customer_id: null,
        referrer_id: null,
        amount: 1,
        discount_amount: 1,
        applied_discount_amount: 1,
        total_discount_amount: 1,
        total_applied_discount_amount: 1,
        total_amount: 0,
        metadata: {},
        created_at: '2024-10-30T07:58:41.848Z',
        object: 'order',
      },
      result: 'SUCCESS',
      status: 'SUCCEEDED',
      voucher: {
        id: 'VOUCHER_ID',
        code: '123456',
        gift: {
          amount: 10000,
          balance: 4981,
          effect: 'APPLY_TO_ORDER',
        },
        type: 'GIFT_VOUCHER',
        campaign: 'testing',
        campaign_id: 'CAMPAIGN_ID',
        is_referral_code: false,
        holder_id: 'HODLER_ID',
        category_id: null,
        active: true,
        created_at: '2024-10-20T22:24:47.836Z',
        updated_at: '2024-10-30T07:58:41.857Z',
        redemption: {
          quantity: null,
          redeemed_quantity: 29,
          redeemed_amount: 5019,
        },
        start_date: null,
        expiration_date: null,
        metadata: {},
        object: 'voucher',
      },
      metadata: null,
      object: 'redemption',
    },
  ],
  order: {
    id: 'ord_0f98d7abac878c6b5d',
    source_id: null,
    created_at: '2024-10-30T07:58:41.848Z',
    updated_at: null,
    status: 'PAID',
    amount: 1,
    discount_amount: 1,
    total_discount_amount: 1,
    total_amount: 0,
    applied_discount_amount: 1,
    total_applied_discount_amount: 1,
    metadata: {},
    customer_id: null,
    referrer_id: null,
    object: 'order',
    redemptions: {
      r_0f98d7abb1478c6b64: {
        date: '2024-10-30T07:58:41.861Z',
        related_object_type: 'voucher',
        related_object_id: 'v_a9xQHRQxEauu2yu56VxxXwnEFwnBg05f',
        related_object_parent_id: 'camp_SUN7MHJvbVwjpKXU52QyRk9K',
      },
    },
  },
  inapplicable_redeemables: [],
  skipped_redeemables: [],
};

export const rollbackVouchersRedemptionOk = {
  id: 'rr_0f90151bf1d0c97d06',
  object: 'redemption_rollback',
  date: '2024-10-23T12:40:47.875Z',
  customer_id: null,
  tracking_id: null,
  metadata: null,
  amount: -5000,
  redemption: 'r_0f900b4b48c0fa9567',
  reason: 'Product malfunction',
  result: 'SUCCESS',
  status: 'SUCCEEDED',
  order: {},
  channel: {
    channel_id: 'b964e8d1-9087-4d91-ad24-44b6ca0f7884',
    channel_type: 'API',
  },
  customer: null,
  related_object_type: 'voucher',
  related_object_id: 'v_a9xQHRQxEauu2yu56VxxXwnEFwnBg05f',
  voucher: {},
  gift: {
    amount: -5000,
  },
};
