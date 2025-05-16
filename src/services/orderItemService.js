const TABLE_NAME = 'order_item';

/**
 * Fetch order items with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - The response data and metadata
 */
export const fetchOrderItems = async (params = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const queryParams = {
      fields: [
        'Name', 'item_id', 'title', 'designer', 'price', 'image', 'color',
        'size', 'quantity', 'rental_days', 'rental_start', 'rental_end', 'order_id'
      ],
      orderBy: [
        { field: 'CreatedOn', direction: 'DESC' }
      ],
      // Apply additional filters from params
      ...params
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, queryParams);
    return response;
  } catch (error) {
    console.error('Error fetching order items:', error);
    throw error;
  }
};

/**
 * Get a specific order item by ID
 * @param {number|string} id - The ID of the order item
 * @returns {Promise<Object>} - The order item data
 */
export const getOrderItemById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.getRecordById(TABLE_NAME, id);
    return response;
  } catch (error) {
    console.error(`Error fetching order item with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get order items by order ID
 * @param {number|string} orderId - The ID of the parent order
 * @returns {Promise<Array>} - Array of order items belonging to this order
 */
export const getOrderItemsByOrderId = async (orderId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        'Name', 'item_id', 'title', 'designer', 'price', 'image', 'color',
        'size', 'quantity', 'rental_days', 'rental_start', 'rental_end', 'order_id'
      ],
      where: [
        { fieldName: 'order_id', operator: 'ExactMatch', values: [orderId.toString()] }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching order items for order ID ${orderId}:`, error);
    return [];
  }
};

/**
 * Create new order items (bulk operation)
 * @param {Array} items - Array of order items
 * @param {number|string} orderId - The ID of the parent order
 * @returns {Promise<Object>} - The create operation response
 */
export const createOrderItems = async (items, orderId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const records = items.map(item => ({
      Name: `Order Item - ${item.title}`,
      item_id: item.id.toString(),
      title: item.title,
      designer: item.designer,
      price: parseFloat(item.price),
      image: item.image,
      color: item.color,
      size: item.size,
      quantity: parseInt(item.quantity || 1),
      rental_days: parseInt(item.rentalDays),
      rental_start: item.rentalStart,
      rental_end: item.rentalEnd,
      order_id: orderId.toString()
    }));

    const params = { records };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error('Error creating order items:', error);
    throw error;
  }
};

/**
 * Update an existing order item
 * @param {number|string} id - The ID of the order item to update
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} - The updated order item data
 */
export const updateOrderItem = async (id, updates) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Id: id,
        ...updates
      }]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error(`Error updating order item with ID ${id}:`, error);
    throw error;
  }
};

export default {
  fetchOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  createOrderItems,
  updateOrderItem
};