import { kitType } from './kit'
import { productType } from './product'
import { reviewType } from './review'

/**
 * Schema registry — add new document types here as the product grows.
 * Planned additions: Article (if migrating from MDX), Author, Category
 */
export const schemaTypes = [kitType, productType, reviewType]
