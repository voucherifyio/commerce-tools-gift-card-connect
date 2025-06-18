import { Type } from "@sinclair/typebox";
import { AmountSchema } from "../dtos/operations/payment-intents.dto";
import { StatusSchema } from "../dtos/voucherify-giftcards.dto";

const ValidationsStackingRulesSchema = Type.Object({
    redeemables_limit: Type.Number(),
    applicable_redeemables_limit: Type.Number(),
    applicable_redeemables_per_category_limit: Type.Optional(Type.Number()),
    applicable_exclusive_redeemables_limit: Type.Number(),
    applicable_exclusive_redeemables_per_category_limit: Type.Optional(Type.Number()),
    exclusive_categories: Type.Array(Type.String()),
    joint_categories: Type.Array(Type.String()),
    redeemables_application_mode: Type.Union([Type.Literal('ALL'), Type.Literal('PARTIAL')]),
    redeemables_sorting_rule: Type.Union([Type.Literal('CATEGORY_HIERARCHY'), Type.Literal('REQUESTED_ORDER')])
});

const ProductSchema = Type.Object({
    name: Type.Optional(Type.String()),
    override: Type.Optional(Type.Boolean()),
});

const SkuSchema = Type.Object({
    sku: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.Object({})),
    override: Type.Optional(Type.Boolean()),
});

const ItemSchema = Type.Object({
    object: Type.Optional(Type.String()),
    id: Type.Optional(Type.String()),
    source_id: Type.Optional(Type.String()),
    related_object: Type.Optional(Type.String()),
    quantity: Type.Optional(Type.Number()),
    initial_quantity: Type.Optional(Type.Number()),
    amount: Type.Optional(Type.Number()),
    initial_amount: Type.Optional(Type.Number()),
    price: Type.Optional(Type.Number()),
    subtotal_amount: Type.Optional(Type.Number()),
    product: Type.Optional(ProductSchema),
    sku: Type.Optional(SkuSchema),
});

const OrderSchema = Type.Optional(Type.Object({
    amount: Type.Optional(Type.Number()),
    discount_amount: Type.Optional(Type.Number()),
    total_discount_amount: Type.Optional(Type.Number()),
    total_amount: Type.Optional(Type.Number()),
    applied_discount_amount: Type.Optional(Type.Number()),
    total_applied_discount_amount: Type.Optional(Type.Number()),
    items: Type.Optional(Type.Array(ItemSchema)),
    customer_id: Type.Optional(Type.String()),
    referrer_id: Type.Optional(Type.String()),
    object: Type.Optional(Type.String()),
}));

const ApplicableToSchema = Type.Object({
    object: Type.Union([Type.Literal('product'), Type.Literal('sku'), Type.Literal('products_collection')]),
    id: Type.String(),
    source_id: Type.Optional(Type.String()),
    product_id: Type.Optional(Type.String()),
    product_source_id: Type.Optional(Type.String()),
    strict: Type.Boolean(),
    price: Type.Optional(Type.Number()),
    price_formula: Type.Optional(Type.Number()),
    effect: Type.Union([Type.Literal('APPLY_TO_EVERY'), Type.Literal('APPLY_TO_CHEAPEST'), Type.Literal('APPLY_TO_MOST_EXPENSIVE')]),
    quantity_limit: Type.Optional(Type.Number()),
    aggregated_quantity_limit: Type.Optional(Type.Number()),
    amount_limit: Type.Optional(Type.Number()),
    aggregated_amount_limit: Type.Optional(Type.Number()),
    order_item_indices: Type.Optional(Type.Array(Type.Number())),
});

export const BalanceResponseSchema = Type.Object({
    status: StatusSchema,
    amount: AmountSchema,
    redeemables: Type.Optional(Type.Array(Type.Object({
        id: Type.String(),
        object: Type.String(),
        order: OrderSchema,
        applicable_to: Type.Optional(Type.Object({
            data: Type.Array(ApplicableToSchema),
            total: Type.Number(),
            object: Type.String(),
            data_ref: Type.String(),
        })),
        inapplicable_to: Type.Optional(Type.Object({
            data: Type.Array(ApplicableToSchema),
            total: Type.Number(),
            object: Type.String(),
            data_ref: Type.String(),
        })),
        result: Type.Optional(Type.Object({
            gift: Type.Optional(Type.Object({
                balance: Type.Optional(Type.Number()),
                credits: Type.Optional(Type.Number()),
            })),
        })),
        metadata: Type.Optional(Type.Object({})),
    }))),
    order: Type.Optional(OrderSchema),
    stacking_rules: ValidationsStackingRulesSchema,
});
