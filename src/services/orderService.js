const TABLE_NAME = 'order';

/**
 * Fetch orders with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - The response data and metadata
 */
export const fetchOrders = async (params = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const queryParams = {
      fields: [
        'Name', 'first_name', 'last_name', 'street_address', 'apt_suite', 
        'city', 'state', 'zip_code', 'country', 'phone', 'email',
        'subtotal', 'shipping_fee', 'tax', 'discount', 'total', 'promo_code'
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
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get a specific order by ID
 * @param {number|string} id - The ID of the order
 * @returns {Promise<Object>} - The order data
 */
export const getOrderById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.getRecordById(TABLE_NAME, id);
    return response;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new order
 * @param {Object} order - The order data
 * @returns {Promise<Object>} - The created order data
 */
export const createOrder = async (order) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Name: `Order ${new Date().toISOString()}`,
        first_name: order.firstName,
        last_name: order.lastName,
        street_address: order.streetAddress,
        apt_suite: order.aptSuite,
        city: order.city,
        state: order.state,
        zip_code: order.zipCode,
        country: order.country,
        phone: order.phone,
        email: order.email,
        subtotal: parseFloat(order.subtotal),
        shipping_fee: parseFloat(order.shippingFee),
        tax: parseFloat(order.tax),
        discount: parseFloat(order.discount || 0),
        total: parseFloat(order.total),
        promo_code: order.promoCode || ''
      }]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Update an existing order
 * @param {number|string} id - The ID of the order to update
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} - The updated order data
 */
export const updateOrder = async (id, updates) => {
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
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

export default {
  fetchOrders,
  getOrderById,
  createOrder,
  updateOrder
};