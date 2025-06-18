import type { RequestController } from './voucherify-request-controller';

export class MetadataSchemas {
  constructor(private client: RequestController) {}

  /**
   * @see https://docs.voucherify.io/reference/list-metadata-schemas
   */
  public list () {
    return this.client.get<any>('/metadata-schemas');
  }

  public async getProperties (resourceName: string) {
    const metadata = await this.list();
    const metadataSchemas =  metadata?.schemas || [];
    const metadataSchema = metadataSchemas.find((schema: any) => schema.related_object === resourceName);

    return Object.keys(metadataSchema?.properties ?? {});
  }
}
