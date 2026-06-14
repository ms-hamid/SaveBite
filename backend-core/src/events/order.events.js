/**
 * @file order.events.js
 * @description In-process event emitter for the Order domain.
 *              Decouples order lifecycle side-effects (notifications, analytics)
 *              from the core transactional flow.
 *
 * Events emitted:
 *   - 'order:created'    → triggers push notification to customer
 *   - 'order:completed'  → triggers reward credit & analytics ping
 *   - 'order:cancelled'  → triggers stock rollback & notification
 */

import { EventEmitter } from 'events';
export const orderEmitter = new EventEmitter();

// TODO: register listeners here
// orderEmitter.on('order:created', async (order) => { ... });
